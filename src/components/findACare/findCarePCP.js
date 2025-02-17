import React, { useState, useEffect } from "react";
import styled from "styled-components";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { requestPcpHousehold } from "../../store/actions";
import Spinner from "../common/spinner";
import GlobalError from "../common/globalErrors/globalErrors";
import { getLanguageFromUrl } from "../../utils/misc";

const PRIMARY_CARE_PROVIDER = "PRIMARY_CARE_PROVIDER";

const FindCarePCP = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const { MIX_REACT_APP_PROVIDER_API_KEY } = process.env;
  const [isGlobalError, setGlobalError] = useState(false);
  const language = getLanguageFromUrl();

  const pcpHousehold = useSelector((state) => state.pcpHousehold);
  useEffect(() => {
    if (pcpHousehold.data) return;
    dispatch(requestPcpHousehold());
    sessionStorage.setItem("longLoad", false);
  }, []);

  const handleChangePCP = () => {
    history.push({
      pathname: "/search",
    });
  };

  const handleOtherLocClicked = (result) => {
    history.push({
      pathname: "/details",
      result,
    });
  };

  const handleMemberChanged = (id, details) => {
    sessionStorage.setItem("currentMemberId", id);
  };

  useEffect(() => {
    if (pcpHousehold.loading || !pcpHousehold.data) return;

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
          pcpId: pcpHousehold?.data?.dependents[dep?.memberId]?.id ?? null,
          disablePcpUpdate: dep.Status === "active" ? false : true,
          membershipEffectiveDate: moment(dep.MembershipEffectiveDate).format(
            "MM-DD-YYYY",
          ),
          lang: language,
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
          lang: language,
        };
      }) || [];

    const memberDetails = [
      hohPlans[0],
      ...hohPlans.slice(1).filter((plan) => plan.disablePcpUpdate === false),
      ...memberDependents.filter((plan) => plan.disablePcpUpdate === false),
    ];

    let mountProps;
    if (
      customerInfo.accountStatus !== "NON-MEMBER" &&
      customerInfo.membershipStatus !== "inactive"
    ) {
      mountProps = {
        parentElement: "#findcarePCPWrapper",
        widget: PRIMARY_CARE_PROVIDER,
        memberId: customerInfo.memberId,
        channel: "customer-center",
        memberDetails: memberDetails,
        token: customerInfo.id_token,
        apiKey: MIX_REACT_APP_PROVIDER_API_KEY,
        lang: language,
        onOtherLocClicked: handleOtherLocClicked,
        onMemberChanged: handleMemberChanged,
        onChangePCP: handleChangePCP,
      };
      if (customerInfo.memberId && ProviderDirectoryWidget) {
        const currentMemberId = sessionStorage.getItem("currentMemberId");
        sessionStorage.setItem(
          "currentMemberId",
          currentMemberId ? currentMemberId : customerInfo.memberId,
        );
        if (!ProviderDirectoryWidget.isMounted(PRIMARY_CARE_PROVIDER)) {
          ProviderDirectoryWidget.mount(mountProps);
        }
      }
    } else {
      setGlobalError(true);
    }

    () => {
      if (ProviderDirectoryWidget.isMounted()) {
        ProviderDirectoryWidget.unmount(mountProps.widget);
      }
    };
  }, [customerInfo, pcpHousehold]);

  useEffect(() => {
    return () => {
      if (ProviderDirectoryWidget.isMounted(PRIMARY_CARE_PROVIDER)) {
        ProviderDirectoryWidget.unmount(PRIMARY_CARE_PROVIDER);
      }
    };
  });

  if (pcpHousehold.loading)
    return (
      <Wrapper>
        <Spinner />
      </Wrapper>
    );

  return (
    <Wrapper>
      <div id="findcarePCPWrapper"></div>
      {isGlobalError && <GlobalError />}
    </Wrapper>
  );
};

export default FindCarePCP;

export const Wrapper = styled.div`
  height: 100%;
`;
