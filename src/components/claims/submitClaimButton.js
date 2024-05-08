import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { SHOW_SUBMIT_CLAIM_BUTTON } from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";
import { StyledButton } from "../../components/common/styles";
import {
  AnalyticsPage,
  AnalyticsTrack,
} from "../../components/common/segment/analytics";
import {
  ANALYTICS_TRACK_TYPE,
  ANALYTICS_TRACK_CATEGORY,
} from "../../constants/segment";
const SubmitClaimButton = ({ handleClick, isMobile }) => {
  const handleSegmentBtn = (label) => {
    handleClick();
    // Segment Track
    AnalyticsTrack(label + " " + "Button clicked", customerInfo, {
      raw_text: label,
      destination_url: window.location.pathname,
      description: label,
      category: ANALYTICS_TRACK_CATEGORY.claims,
      type: ANALYTICS_TRACK_TYPE.buttonClicked,
      targetMemberId: customerInfo?.data?.memberId,
      location: {
        desktop: {
          width: 960,
          value: "left",
        },
        tablet: {
          width: 768,
          value: "right",
        },
        mobile: {
          width: 0,
          value: "right",
        },
      },
    });
  };

  const customerInfo = useSelector((state) => state.customerInfo);
  const splitAttributes = {
    lob: customerInfo.data.sessLobCode,
    companyCode: customerInfo.data.companyCode,
    benefitPackage: customerInfo.data.benefitPackage,
    membershipStatus: customerInfo.data.membershipStatus,
    accountStatus: customerInfo.data.accountStatus,
  };

  return (
    <>
      <FeatureTreatment
        treatmentName={SHOW_SUBMIT_CLAIM_BUTTON}
        onLoad={() => {}}
        onTimedout={() => {}}
        attributes={splitAttributes}
      >
        <StyledButton
          variant="primary"
          isMobile={isMobile}
          onClick={() => handleSegmentBtn("Submit a Claim")}
        >
          Submit a Claim
        </StyledButton>
        {/* <SubmitClaim onClick={handleClick}>
          <BtnText>
            Submit a Claim
          </BtnText>
        </SubmitClaim> */}
      </FeatureTreatment>
    </>
  );
};

const SubmitClaim = styled.button`
  height: 40px;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #3e7128;
  border: none;
`;

const BtnText = styled.span`
  fontfamily: "museo-sans";
  font-size: 18px;
  font-weight: bold;
  line-height: 1.33;
  letter-spacing: -0.08px;
  text-align: center;
  color: var(--white);
`;
export default SubmitClaimButton;
