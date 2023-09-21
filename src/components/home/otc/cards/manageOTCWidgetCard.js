import React, { useState } from 'react'
import { FeatureTreatment } from "../../../../libs/featureFlags";
import { OTC_WIDGET_PAGE } from '../../../../constants/splits'
import styled from 'styled-components';
import { useSelector } from 'react-redux'; 
import { AnalyticsTrack } from "../../../common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../../../constants/segment";
import { generateCardType } from '../../../overTheCounter/utils';
import { useHistory } from 'react-router-dom';
import {
  CardHeader,
  CardBody,
  CardFooter,
  Card,
  FooterActions,
} from "./styles";
import { Balance, BalanceTitle, OTCIcon, Paragraph } from './activeCard';
import moment from "moment";

const ManageOTCWidgetCard = () => {
    const customerInfo = useSelector((state) => state.customerInfo);
    const otcProfile = useSelector((state) => state.otcCard.profile);
    const [showClaimCard, setShowClaimCard] = useState(false);
    
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

    const handleClick = () => {
      handleSegmentBtn('Manage OTC'); 
      history.push('/otc-widget');
    }
    return (
        <>
          <Card>
              <OTCIcon alt="" src="/react/images/otc-icon.svg" />
              <CardHeader>
                  <BalanceTitle>Remaining Balance</BalanceTitle>
              </CardHeader>
              <CardBody>
                  <Balance>${otcProfile?.data?.balance}</Balance>
                  <Paragraph>
                      Allowance resets in{" "}
                      {moment(otcProfile?.data?.balanceReloadDate,"MM-Do-YYYY").format(
                          "MMMM YYYY"
                      )}
                  </Paragraph>
              </CardBody>
              <CardFooter>
                  <FooterActions style={{justifyContent: 'center'}}>
                    <FeatureTreatment
                    treatmentName={OTC_WIDGET_PAGE}
                    onLoad={() => { }}
                    onTimedout={() => { }}
                    attributes={{
                        planCode: customerInfo.data.planCode,
                        companyCode: customerInfo.data.companyCode,
                        benefitPackage: customerInfo.data.hohPlans[0].BenefitPackage,
                        membershipStatus: customerInfo.data.membershipStatus,
                    }}
                    >
                      <ActiveButton onClick={ () => handleClick() }>Manage {getTitle(customerInfo?.data.hohPlans)}</ActiveButton>
                    </FeatureTreatment>
                  </FooterActions>
              </CardFooter>
            </Card>
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

export default ManageOTCWidgetCard
