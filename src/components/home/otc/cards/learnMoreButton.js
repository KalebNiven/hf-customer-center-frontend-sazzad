import React from "react";
import { FeatureTreatment } from "../../../../libs/featureFlags";
import { SHOW_OTC_LEARN_MORE_BUTTON } from "../../../../constants/splits";
import styled from "styled-components";
import { useSelector } from "react-redux";

const LearnMoreButton = ({ handleLearnMore }) => {
  const customerInfo = useSelector((state) => state.customerInfo);

  return (
    <>
      <FeatureTreatment
        treatmentName={SHOW_OTC_LEARN_MORE_BUTTON}
        onLoad={() => {}}
        onTimedout={() => {}}
        attributes={{
          planCode: customerInfo.data.planCode,
          companyCode: customerInfo.data.companyCode,
          benefitPackage: customerInfo.data.hohPlans?.map(
            (plan) => plan.BenefitPackage,
          ),
          membershipStatus: customerInfo.data.membershipStatus,
        }}
      >
        <ActiveButton onClick={handleLearnMore}>Learn More</ActiveButton>
      </FeatureTreatment>
    </>
  );
};

export const ActiveButton = styled.span`
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: right;
  color: #008bbf;
  cursor: pointer;
`;

export default LearnMoreButton;
