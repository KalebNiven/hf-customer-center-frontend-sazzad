import React, { useState } from "react";
import styled from "styled-components";
import {   useSelector, useDispatch } from "react-redux";
import { SHOW_MAIL_ID_CARD } from "../../constants/splits"; 
import { FeatureTreatment, FeatureFactory } from "../../libs/featureFlags";
import { getFeatureFlagList } from "../../constants/splits"; 
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import { AnalyticsTrack } from "../common/segment/analytics";

const MailIdCardButton = ({ handleClick, disableBtn, memberId}) => {
      console.log('disableBtn', disableBtn);
      const dispatch = useDispatch();

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
      const handleClickWithAnalytics = () =>{
        AnalyticsTrack(
          "Mail Me a New ID Card Button Clicked", 
          customerInfo, 
          {
              "raw_text": "Mail Me a New ID Card", 
              "destination_url": "N/A", 
              "category": ANALYTICS_TRACK_CATEGORY.memberIdCard, 
              "type": ANALYTICS_TRACK_TYPE.buttonClicked, 
              "targetMemberId": memberId,
              "location": {
                  "desktop":{
                      "width": 1024,
                      "value": "right"
                  },
                  "tablet":{
                      "width": 768,
                      "value": "right"
                  },
                  "mobile":{
                      "width": 0,
                      "value": "bottom right"
                  }
              }
          }
        );
        handleClick();
      }
    return (
        <Container>
            <FeatureFactory splitKey={MIX_SPLITIO_KEY} options={featureFlagOptions}>
                <FeatureTreatment
                    treatmentName={SHOW_MAIL_ID_CARD}
                    onLoad={() => { }}
                    onTimedout={() => { }}
                    attributes={splitAttributes}
                >
                    <MailIdCard onClick={disableBtn ? null : handleClickWithAnalytics} disableBtn={disableBtn}>
                        <NewCardBtnText className="no-print" disableBtn={disableBtn}>
                            Mail Me a New ID Card
                        </NewCardBtnText>
                    </MailIdCard>
                </FeatureTreatment>
            </FeatureFactory>
        </Container>
    )
}

const Container = styled.div`
    font-family: museo-sans;
`;

const MailIdCard = styled.button`
    width: 180px;
    margin: 16px 0 16px auto;
    object-fit: contain;
    box-shadow: 1px 1px 2px 1px ${props => props.disableBtn ? "#757575" : "#3e7128" };
    border-radius: 5px;
    background-color: #fff;
    cursor: ${props => props.disableBtn ? "default" : "pointer" };
    border: none;
    text-align: center;
    display:block;
    @media only screen and (max-width: 768px) {
      width: 100%;
      margin: 16px auto;
    }
    ${props => !props.disableBtn ? `
      &:hover {
        background-color: #3e7128;
      }` : ''
    }

    ${props => !props.disableBtn ? `
      &:hover  > span{
        color: #fff;
      }` : ''
    }
  `;

const NewCardBtnText = styled.span` 
    font-family: "museo-sans", Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 2;
    letter-spacing: -0.06px;
    color: ${props => props.disableBtn ? "#757575" : "#3e7128" };
    padding: 12px 16px;
    cursor: ${props => props.disableBtn ? "default" : "pointer" };
    `;
export default MailIdCardButton;


