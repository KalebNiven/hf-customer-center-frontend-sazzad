import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { SHOW_SUBMIT_CLAIM_BUTTON } from "../../constants/splits";
import { FeatureTreatment, FeatureFactory } from "../../libs/featureFlags";
import { getFeatureFlagList } from "../../constants/splits";
import {StyledButton} from "../../components/common/styles"
import {AnalyticsPage, AnalyticsTrack } from "../../components/common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
const SubmitClaimButton = ({ handleClick,isMobile }) => {


  const handleSegmentBtn = (label) => { 
  
   handleClick()
    // Segment Track
    AnalyticsTrack(
      label + " " + "Button clicked",
      customerInfo,
      {
        "raw_text":label ,
        "destination_url": window.location.pathname,
        "description": label,
        "category": ANALYTICS_TRACK_CATEGORY.claims,
        "type": ANALYTICS_TRACK_TYPE.buttonClicked,
        "targetMemberId": customerInfo?.data?.memberId,
        "location": {
          "desktop": {
            "width": 960,
            "value": "left"
          },
          "tablet": {
            "width": 768,
            "value": "right"
          },
          "mobile": {
            "width": 0,
            "value": "right"
          }
        }
      }
    );
   
    
  }


  const { MIX_SPLITIO_KEY } = process.env;
  const customerInfo = useSelector((state) => state.customerInfo);
  const splitAttributes = {
    lob: customerInfo.data.sessLobCode,
    companyCode: customerInfo.data.companyCode,
    benefitPackage: customerInfo.data.benefitPackage,
    membershipStatus: customerInfo.data.membershipStatus,
    accountStatus: customerInfo.data.accountStatus,
  }
  const featureFlagList = getFeatureFlagList();
  const featureFlagOptions = {
    scheduler: { featuresRefreshRate: 300, metricsRefreshRate: 30 },
    sync: {
      splitFilters: [
        {
          type: "byName",
          values: featureFlagList,
        },
      ],
    },
  };
  return (
    <>
      <FeatureFactory splitKey={MIX_SPLITIO_KEY} options={featureFlagOptions}>
                <FeatureTreatment
                    treatmentName={SHOW_SUBMIT_CLAIM_BUTTON}
                    onLoad={() => { }}
                    onTimedout={() => { }}
                    attributes={splitAttributes}
                >
                  <StyledButton variant="primary" isMobile={isMobile} onClick={() =>handleSegmentBtn("Submit a Claim")}>Submit a Claim</StyledButton>
      {/* <SubmitClaim onClick={handleClick}>
        <BtnText>
          Submit a Claim
        </BtnText>
      </SubmitClaim> */}
      </FeatureTreatment>
            </FeatureFactory >
    </>
  )
}

const SubmitClaim = styled.button`
  height: 40px;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #3e7128;
  border:none;
  `;

const BtnText = styled.span` 
  fontFamily: "museo-sans";
  font-size: 18px;
  font-weight: bold;
  line-height: 1.33;
  letter-spacing: -0.08px;
  text-align: center;
  color: var(--white);
  `;
export default SubmitClaimButton;


