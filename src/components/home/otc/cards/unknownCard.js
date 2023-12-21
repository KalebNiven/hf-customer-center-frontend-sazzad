import React from "react";
import styled from "styled-components";
import {
    CardHeader,
    CardBody,
    CardFooter,
    Card,
    FooterActions,
    FooterBody,
} from "./styles.js";
import OTCBenefitsCenterButton from "./otcBenefitsCenterButton";
import LearnMoreButton from "./learnMoreButton";
import { FeatureTreatment } from "../../../../libs/featureFlags";
import { OTC_WIDGET_PAGE } from '../../../../constants/splits'
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { generateCardType } from '../../../overTheCounter/utils';
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../../../constants/segment";
import { AnalyticsTrack } from "../../../common/segment/analytics";

const UnknownCard = ({ handleLearnMore, handleOTCRetryButton }) => {
    const customerInfo = useSelector((state) => state.customerInfo);
    const otcProfile = useSelector((state) => state.otcCard.profile);
    const history = useHistory();

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

    const getTitle = (hohPlans) => {
        let cardType = generateCardType(hohPlans);
        return cardType;
    }
    return (
        <Card>
            <OTCIcon alt="" src="/react/images/otc-icon.svg" />
            <CardHeader>
                <BalanceTitle>Account Status</BalanceTitle>
            </CardHeader>
            <CardBody>
                <Balance>Unknown</Balance>
                <Paragraph>
                    <Img
                        alt=""
                        src="/react/images/alert-icon.svg"
                        width="16px"
                        height="16px"
                        margin="0 3px 0 0"
                    />{" "}
                    OTC has failed to connect.{" "}
                    <TryAgainBtn onClick={handleOTCRetryButton}>
                        Try again
                    </TryAgainBtn>
                </Paragraph>
            </CardBody>
            <CardFooter>
                <FooterActions style={{justifyContent: 'center'}}>
                    <FeatureTreatment
                    treatmentName={OTC_WIDGET_PAGE}
                    onLoad={() => { }}
                    onTimedout={() => { }}
                    attributes={{
                      planCode: customerInfo?.data?.planCode,
                      companyCode: customerInfo?.data?.hohPlans[0]?.CompanyNumber,
                      benefitPackage: customerInfo?.data?.hohPlans[0]?.BenefitPackage,
                      membershipStatus: customerInfo?.data?.hohPlans[0]?.MembershipStatus,
                    }}
                    >
                      <ActiveButton onClick={ () => handleClick() }>Manage {getTitle(customerInfo?.data.hohPlans)}</ActiveButton>
                    </FeatureTreatment>
                  </FooterActions>
            </CardFooter>
        </Card>
    );
};

export const Wrapper = styled.div`
    margin-bottom: 1.5rem;
`;


export const Title = styled.h3`
    font-size: 18px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: left;
    color: #003863;
    margin-left: 16px;
    margin-bottom: 16px;
`;

export const OTCIcon = styled.img`
    position: absolute;
    top: 16px;
    right: 16px;
`;

export const HeaderLeft = styled.div``;

export const HeaderRight = styled.div``;

export const BalanceTitle = styled.h4`
    flex-grow: 0;
    font-size: 16px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: left;
    color: #003863;
`;

export const Balance = styled.div`
    flex-grow: 0;
    margin: 8px 0 4px 0;
    font-size: 32px;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #003863;
`;

export const ActivateCTATitle = styled.div`
    font-size: 18px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: left;
    color: #003863;
`;

export const ActivateCTADesc = styled.div`
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: normal;
    text-align: left;
    color: #474b55;
    margin-top: 4px;
`;

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

export const ShowOnlineCardWrapper = styled.div`
    margin-top: 8px;
    padding: 19px 16px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
    position: relative;
    background: #fff;
    cursor: pointer;
`;

export const ShopOnlineTitle = styled.h4`
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.13;
    letter-spacing: normal;
    text-align: left;
    color: #474b55;
`;

export const ShopOnlineIcon = styled.img`
    position: absolute;
    top: 16px;
    right: 16px;
`;

export const Paragraph = styled.div`
    font-size: 12px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: left;
    color: #474b55;
    display: flex;
    margin-bottom:8px;
`;

export const Img = styled.img`
    width: ${(props) => props.width && props.width};
    height: ${(props) => props.height && props.height};
    margin: ${(props) => props.margin && props.margin};
`;

export const TryAgainBtn = styled.span`
    font-weight: bold;
    color: #008bbf;
    margin-left: 3px;
    cursor: pointer;
`;

export default UnknownCard;
