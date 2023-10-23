import React, { useState } from "react";
import styled, {keyframes} from 'styled-components';
import {   useSelector, useDispatch } from "react-redux";
import { SHOW_MAIL_ID_CARD } from "../../constants/splits"; 
import { FeatureTreatment } from "../../libs/featureFlags";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import { AnalyticsTrack } from "../common/segment/analytics";
import { Button } from "../../styles/commonStyles";

const MailIdCardButton = ({ handleClick, disableBtn, memberId}) => {
      const dispatch = useDispatch();
      const customerInfo = useSelector((state) => state.customerInfo);
      const mailMemberIDCardStatus = useSelector((state) => state.correspondenceStatus);
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
                {mailMemberIDCardStatus.loading ?
                  <FormButton green={true}>
                    <ProgressSpinner></ProgressSpinner>
                  </FormButton>
                : (
                <MailIdCard onClick={disableBtn ? null : handleClickWithAnalytics} disableBtn={disableBtn}>
                  <NewCardBtnText className="no-print" disableBtn={disableBtn}>
                      Mail Me a New ID Card
                  </NewCardBtnText>
                </MailIdCard>
                )}
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
const FormButton = styled(Button)`
  float: none!important;
  width: 16rem;
  margin-left: 0;
  margin-right: 0;
  cursor: default;
  @media only screen and (max-width: 480px) {
    width: 100%;
    margin: 16px auto;
  }
`;
const SpinnerRotate = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
`;
  
const ProgressSpinner = styled.div`
  text-align: center;
  margin: auto;
  border: .2rem solid #375225;
  border-top: .2rem solid white;
  border-radius: 50%;
  height: 1.5rem;
  width: 1.5rem;
  margin-left: auto;
  margin-right: auto;
  animation-name: ${SpinnerRotate};
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  @media only screen and (max-width: 768px) {
    margin-left: auto;
    margin-right: auto;
  }
`;
export default MailIdCardButton;


