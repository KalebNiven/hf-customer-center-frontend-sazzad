import React, { useState, useEffect } from "react";
import styled from "styled-components";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { requestPcpHousehold } from "../../store/actions";
import Spinner from "../common/spinner";
import { getLanguageFromUrl } from "../../utils/misc";

const SEARCH = "SEARCH";

const FindCareSearch = (props) => {
  const { MIX_REACT_APP_PROVIDER_API_KEY } = process.env;
  const dispatch = useDispatch();
  const history = useHistory();
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const pcpHousehold = useSelector((state) => state.pcpHousehold);
  const [isGlobalError, setGlobalError] = useState(false);

  useEffect(() => {
    if (pcpHousehold.data) return;
    dispatch(requestPcpHousehold());
  }, []);

  const handleResultClicked = (resultId) => {
    history.push({
      pathname: "/details",
      result: resultId,
    });
  };

  const handleMemberChanged = (id, details) => {
    sessionStorage.setItem("currentMemberId", id);
  };

  /** Adding Widget script for  provider search and Mounting the widget on page load */
  const memberDependents =
    customerInfo?.dependents.map((dep) => {
      return {
        memberId: dep.memberId,
        age: dep.Age,
        benefitPackage: dep.benefitPackage,
        groupNumber: dep.groupNumber,
        year: dep.year,
        firstName: dep.firstName,
        lastName: dep.lastName,
        pcpId: pcpHousehold?.data?.dependents[dep?.memberId] ?? null,
        disablePcpUpdate: dep.Status === "active" ? false : true,
        membershipEffectiveDate: moment(dep.MembershipEffectiveDate).format(
          "MM-DD-YYYY",
        ),
      };
    }) || [];

  const hohPlans =
    customerInfo?.hohPlans.map((plan) => {
      return {
        memberId: plan.MemberId,
        age: plan.age,
        benefitPackage: plan.BenefitPackage,
        groupNumber: plan.GroupNumber,
        year: plan.memberYear,
        firstName: plan.FirstName,
        lastName: plan.LastName,
        pcpId: pcpHousehold?.data?.hohPlans[plan?.MemberId]?.id ?? null,
        disablePcpUpdate: plan.MembershipStatus === "active" ? false : true,
        membershipEffectiveDate: moment(plan.MembershipEffectiveDate).format(
          "MM-DD-YYYY",
        ),
      };
    }) || [];

  useEffect(() => {
    if (pcpHousehold.loading || !pcpHousehold.data) return;

    const memberDetails = [
      hohPlans[0],
      ...hohPlans.slice(1).filter((plan) => plan.disablePcpUpdate === false),
      ...memberDependents.filter((plan) => plan.disablePcpUpdate === false),
    ];

    if (customerInfo.accountStatus !== "NON-MEMBER") {
      const mountProps = {
        parentElement: "#findcareSearchWrapper",
        widget: SEARCH,
        memberId: customerInfo.memberId,
        channel: "customer-center",
        companyCode: customerInfo.companyCode,
        lob: customerInfo.sessLobCode,
        zipcode: customerInfo.zipcode,
        planName: customerInfo.planName,
        benefitPackage: customerInfo.benefitPackage,
        groupNumber: customerInfo.groupNumber,
        year: customerInfo.memberYear,
        memberDetails: memberDetails,
        token: customerInfo.id_token,
        apiKey: MIX_REACT_APP_PROVIDER_API_KEY,
        lang: getLanguageFromUrl(),
        pcpId: customerInfo.pcpId,
        onMemberChanged: handleMemberChanged,
        onResultClicked: handleResultClicked,
      };
      if (
        customerInfo.memberId &&
        pcpHousehold &&
        !pcpHousehold.pcpLoading &&
        ProviderDirectoryWidget
      ) {
        if (!ProviderDirectoryWidget.isMounted(SEARCH)) {
          ProviderDirectoryWidget.mount(mountProps);
        }
      }
    } else {
      setGlobalError(true);
    }
  }, [customerInfo, pcpHousehold]);

  useEffect(() => () => {
    if (ProviderDirectoryWidget.isMounted(SEARCH)) {
      ProviderDirectoryWidget.unmount(SEARCH);
    }
  });

  if (pcpHousehold.loading)
    return (
      <Wrapper>
        <Spinner />
      </Wrapper>
    );

  return (
    <>
      <div id="findcareSearchWrapper"></div>
      {isGlobalError && <GlobalError />}
    </>
  );
};

export default FindCareSearch;

export const Wrapper = styled.div`
  height: 100%;
`;
