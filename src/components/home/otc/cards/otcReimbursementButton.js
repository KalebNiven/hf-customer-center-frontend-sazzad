import React from 'react'
import { FeatureTreatment } from "../../../../libs/featureFlags";
import { SHOW_OTC_CLAIM_REIMBURSEMENT_BUTTON } from '../../../../constants/splits'
import styled from 'styled-components';
import { useSelector } from 'react-redux'; 
import { AnalyticsTrack } from "../../../common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../../../constants/segment";
import { generateCardType } from '../../../overTheCounter/utils';
import { cardTypes } from '../../../overTheCounter/const'
import { useHistory } from 'react-router-dom';

const OTCReimbursementButton = () => {
    const customerInfo = useSelector((state) => state.customerInfo);
    const history = useHistory();
    const getTitle = (hohPlans) => {
      let cardType = generateCardType(hohPlans);
      return cardType;
  }
    const handleSegmentBtn = (label) => {  
        AnalyticsTrack(
          label + " " + "Clicked",
          customerInfo,
          {
            "raw_text": label,
            "destination_url": label,
            "description": label + " in Homepage",
            "category": ANALYTICS_TRACK_CATEGORY.settings,
            "type": ANALYTICS_TRACK_TYPE.buttonClicked,
            "targetMemberId":customerInfo?.data.memberId,
            "location": {
              "desktop": {
                "width": 960,
                "value": "center"
              },
              "tablet": {
                "width": 768,
                "value": "center"
              },
              "mobile": {
                "width": 0,
                "value": "center"
              }
            }
          }
        );
      }

    return (
        <>
            <FeatureTreatment
                treatmentName={SHOW_OTC_CLAIM_REIMBURSEMENT_BUTTON}
                onLoad={() => { }}
                onTimedout={() => { }}
                attributes={{
                    planCode: customerInfo.data.planCode,
                    companyCode: customerInfo.data.companyCode,
                    benefitPackage: customerInfo.data.hohPlans?.map(plan => plan.BenefitPackage),
                    membershipStatus: customerInfo.data.membershipStatus,
                }}
            >
              <ActiveButton onClick={ () => handleSegmentBtn('OTC Reimbursement Form')}>{getTitle(customerInfo?.data.hohPlans)} Reimbursement Form</ActiveButton>
            </FeatureTreatment>
        </>
    )
}

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

export default OTCReimbursementButton
