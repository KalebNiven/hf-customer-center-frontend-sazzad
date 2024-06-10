import React, { useEffect } from "react";
import {
  getHraStatusesLocalOnly,
  getMemberAnswers,
  getAllRecomendedResources,
} from "../../store/saga/apis";
import { useHealthResourcesContext } from "./healthResourcesContext";
import { HRA_RESOURCES_COMPANY_CODES, OBESE_BMI } from "./const";
import { isValidCompanyCode } from "./utils";

const HealthResources = ({ customerInfo }) => {
  const {
    setSurveyLocalStatuses,
    setGeneralResources,
    setCurrentCompanyCodes,
    setGeneralResourcesLoader,
    surveyLocalStatuses,
    currentResources,
    setCurrentResources,
  } = useHealthResourcesContext();

  const generateUniqueCompanyCodes = (filteredDependents, customerInfo) => {
    let membersCompanyCodes = [
      ...new Set(filteredDependents?.map((dep) => dep.companyCode)),
    ];
    if (
      isValidCompanyCode(
        customerInfo.companyCode,
        HRA_RESOURCES_COMPANY_CODES,
      ) &&
      !membersCompanyCodes.includes(customerInfo.companyCode)
    ) {
      membersCompanyCodes.push(customerInfo.companyCode);
    }
    return membersCompanyCodes;
  };

  useEffect(() => {
    if (!Object.keys(customerInfo).length) return;

    // filter out invalid members
    let filteredDependents = customerInfo.dependents?.filter((dep) =>
      isValidCompanyCode(dep.companyCode, HRA_RESOURCES_COMPANY_CODES),
    );
    let depMemebrIdsList = filteredDependents?.map((dep) => dep.memberId);

    // create list of avalable companyCodes
    let membersCompanyCodes = generateUniqueCompanyCodes(
      filteredDependents,
      customerInfo,
    );
    setCurrentCompanyCodes([...membersCompanyCodes]);

    // create membersId list
    let memberIdsList = [];
    if (
      isValidCompanyCode(customerInfo.companyCode, HRA_RESOURCES_COMPANY_CODES)
    )
      memberIdsList.push(customerInfo.memberId);
    memberIdsList = [...memberIdsList, ...depMemebrIdsList];

    // get local hra statuses by list of memberIds
    getHraStatusesLocalOnly(memberIdsList).then((data) => {
      const statuses = {};
      data.forEach((item) => {
        const data = item.data;
        statuses[data.memberId] = data.status;
      });
      setSurveyLocalStatuses(statuses);
    });
  }, [customerInfo]);

  useEffect(() => {
    if (!surveyLocalStatuses) return;
    const codeExistList = [];
    let generalResourcesList = [];
    let unfilteredResources = {};
    let allFilteredResources = {};

    const validateRecomendedQuestion = (q, memberAnswers, surveyData) => {
      const { question_id, answer } = q;
      let isValid = false;
      if (!memberAnswers[question_id]) return isValid;

      const isObese = (weight, height) => {
        const weightFloat = parseFloat(weight);
        const heightFloat = parseFloat(height);

        if (Number.isNaN(weightFloat) || Number.isNaN(heightFloat))
          return false;

        const bmi = ((weight, height) => {
          const pounds = weight;
          const inches = height;
          // BMI formula: (pounds * 0.425) / (inches * 0.025)^2
          return (pounds * 0.425) / (inches * 0.025 * (inches * 0.025));
        })(weight, height);

        return bmi >= OBESE_BMI;
      };

      memberAnswers[question_id].forEach((ans) => {
        // SINGLE_CHOICE, MULTIPLE_CHOICE, MATRIX
        if (ans.answer_code && ans.answer_code === answer) {
          isValid = true;
          return isValid;
        }
        // FREE_TEXT
        if (ans.value) {
          // validate obesity for ["01", "20"]
          if (
            ["v1.2021.0"].includes(surveyData?.questionareId) &&
            ["01", "20"].includes(surveyData?.companyCode) &&
            question_id === "q18"
          ) {
            const height = memberAnswers["q17"][0].value;
            const weight = ans.value;
            isValid = isObese(weight, height);
            return isValid;
          }
          // if(["v1.2021.0"].includes(surveyData?.questionareId) && ["42", "45"].includes(surveyData?.companyCode) && question_id === "q22") {
          //   const height = memberAnswers["q21"][0].value;
          //   const weight = ans.value;
          //   return isObese(weight, height)
          // }
          isValid = false;
        }
      });
      return isValid;
    };

    const getRecomendedResources = ({ resources, answersData, surveyData }) => {
      let recomendedList = [];
      const { memberAnswers } = answersData;
      resources.forEach((resource) => {
        resource.assigned_questions.forEach((q) => {
          if (validateRecomendedQuestion(q, memberAnswers, surveyData)) {
            recomendedList.push({
              title: resource.title,
              resource_url: resource.resource_url,
            });
          }
        });
      });
      return recomendedList;
    };

    const generateGeneralResources = (item) => {
      if (!codeExistList.includes(item[0].companyCode)) {
        generalResourcesList = [
          ...generalResourcesList,
          ...item[0].general_resources,
        ];
        codeExistList.push(item[0].companyCode);
      }
      setGeneralResources(generalResourcesList);
      setGeneralResourcesLoader(false);
    };

    const setUnfilteredResources = (item) => {
      unfilteredResources[item[0].member_id] = [
        ...item[0].recommended_resources,
      ];
    };

    const setFilteredResources = (answer) => {
      const {
        member_id,
        visited_questions,
        current_answers,
        questionare_id,
        company_code,
      } = answer;
      const answersData = {
        visited: JSON.parse(visited_questions),
        memberAnswers: JSON.parse(current_answers),
      };
      const filteredResources = getRecomendedResources({
        resources: unfilteredResources[member_id],
        answersData: answersData,
        surveyData: {
          questionareId: questionare_id,
          companyCode: company_code,
        },
      });
      let uniq = filteredResources.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.title === value.title),
      );
      allFilteredResources[member_id] = uniq;
    };

    const memberIds = [];
    Object.entries(surveyLocalStatuses).forEach(
      ([key, value]) => value === "COMPLETE" && memberIds.push(key),
    );

    getMemberAnswers(memberIds).then((membersAnswers) => {
      setGeneralResourcesLoader(true);
      let resourceParams = membersAnswers.map((item) => ({
        questionareId: item.questionare_id,
        companyCode: item.company_code,
        memberId: item.member_id,
      }));

      getAllRecomendedResources(resourceParams).then((resources) => {
        if (!resources || !resources.length) setGeneralResourcesLoader(false);

        resources.forEach((item) => {
          setUnfilteredResources(item);
          generateGeneralResources(item);
        });
        membersAnswers.forEach((answer) => setFilteredResources(answer));
        setCurrentResources({ ...currentResources, ...allFilteredResources });
      });
    });
  }, [surveyLocalStatuses]);

  return <></>;
};

export default HealthResources;
