import React, { useState } from "react";
import styled from "styled-components";
import {   useSelector, useDispatch } from "react-redux";
import { SHOW_MAIL_ID_CARD } from "../../constants/splits"; 
import { FeatureTreatment } from "../../libs/featureFlags";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import { AnalyticsTrack } from "../common/segment/analytics";

const MailIdCardButton = ({ handleClick, disableBtn, memberId}) => {
      const dispatch = useDispatch();
      const customerInfo = useSelector((state) => state.customerInfo);
      const splitAttributes = {
        lob: customerInfo.data.sessLobCode,
        companyCode: customerInfo.data.companyCode,
        benefitPackage: customerInfo.data.benefitPackage,
        membershipStatus: customerInfo.data.membershipStatus,
        accountStatus: customerInfo.data.accountStatus,
      }

      const handleClickWithAnalytics = () =>{
        AnalyticsTrack(
          "Mail Me a New ID Card Button Clicked", 
          customerInfo, 
          {
              "raw_text": "Mail Me a New ID Card", 
              "description": "Mail Me a New ID Card", 
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
        </Container>
    )
}

const Container = styled.div`
    font-family: museo-sans;
`;

const MailIdCard = styled.button`
    margin-top: 1rem;
    object-fit: contain;
    border-radius: 5px;
    background-color: #3E7128;
    cursor: ${props => props.disableBtn ? "default" : "pointer" };
    border: none;
    text-align: center;
    display:block;
    @media only screen and (max-width: 480px) {
      width: 100%;
      margin: 16px auto;
    }
    ${props => props.disableBtn ? `
        background-color: #fff;
      ` : ''
    }
    ${props => !props.disableBtn ? `
      &:hover {
        background-color: #517f3d;
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
    font-size: 18px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 2;
    letter-spacing: -0.06px;
    color: ${props => props.disableBtn ? "#757575" : "#fff" };
    padding: 12px 16px;
    cursor: ${props => props.disableBtn ? "default" : "pointer" };
    `;
export default MailIdCardButton;


