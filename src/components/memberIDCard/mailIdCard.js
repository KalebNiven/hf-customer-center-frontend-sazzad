import React, { useEffect, useState,useMemo } from "react";
import styled from "styled-components";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import { requestCustomerDemographicsInfo } from '../../store/actions/index';
import Spinner from "../common/spinner";
import { useDispatch, useSelector } from "react-redux";
import {AnalyticsPage, AnalyticsTrack } from "../../components/common/segment/analytics";
import MailIdCardButton from './mailIdCardButton'
import MailMemberIDCardForm from './mailMemberIDCardForm'


const MailIdCard = (props) => {

    const customerInfo = useSelector((state) => state.customerInfo);
    const mailMemberIDCardStatus = useSelector((state) => state.correspondenceStatus);
    const customerDemographicsInfo = useSelector( (state) => state.customerDemographicsInfo.data);
    const [renderIdCardForm, setRenderIdCardForm] = useState(false);

    const handleSegmentBtn = (label) => { 
 
      AnalyticsPage()
      // Segment Track
      AnalyticsTrack(
        label + " " + "link clicked",
        customerInfo,
        {
          "raw_text": label,
          "destination_url": window.location.pathname,
          "description": label,
          "category": ANALYTICS_TRACK_CATEGORY.memberIdCard,
          "type": ANALYTICS_TRACK_TYPE.linkClicked,
          "targetMemberId": props?.memberSelection?.memberId,
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


    useEffect(() => {
       // dispatch(requestIdCard(props.memberId));
       dispatch(requestCustomerDemographicsInfo(customerInfo.data.memberId));
    }, []);

    const openForm = () => {
      setRenderIdCardForm(true);
    };

    const dispatch = useDispatch();
    return (
        <>
        {
        false ? // This will be replaced with status loading
        <Container>
            <ProgressWrapper>
                <Spinner />
            </ProgressWrapper>
        </Container> : (
        <Container>
            <Label className="no-print">Need a New ID Card?</Label>
            <Description className="no-print">Order a new Member ID Card and have it send directly to your home address.</Description>
            <MailIdCardContainer>
              <MailIdCardButton handleClick={openForm} disableBtn={typeof(mailMemberIDCardStatus.data) !== "undefined" && mailMemberIDCardStatus.data !== null && mailMemberIDCardStatus.data.status == true ? true : false} memberId={props?.memberSelection?.memberId} />
              {(typeof(mailMemberIDCardStatus.data) !== "undefined" && mailMemberIDCardStatus.data !== null && mailMemberIDCardStatus.data.length != 0 ? true : false) ?
              <RecentRequestText className="no-print">A physical Member ID Card was recently requested. A new request can be made after 14 days.</RecentRequestText>
              :
              null}
            </MailIdCardContainer>
            <MailMemberIDCardForm showForm={renderIdCardForm} member={props?.memberSelection} customerDemographicsInfo = {customerDemographicsInfo} unmountMe={() => setRenderIdCardForm(false)}/>
        </Container>
        )}
        </>
    )
}

const Container = styled.div`
    font-family: museo-sans;
    @media only screen and (max-width: 820px) {
        display: flex;
        flex-direction: column;
        align-items: left;
    }
`;

const MailIdCardContainer = styled.div`
margin-left:15px;
@media (max-width: 480px) {
  margin-left:0;
  width: 100%;
}
`

const Label = styled.div`
text-align: left;
width: 100%;
@media only screen and (max-width: 480px) {
  margin: 0px 0px;
}
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  padding-top: 2rem;
  letter-spacing: normal;
  color:#003863;
  margin: 0px 15px;
`;


const Description = styled.div`
text-align: left;
width: 100%;
@media only screen and (max-width: 480px) {
  margin: 8px 0px 16px;
}
  font-size: 16px;
  color: #474B55;
  line-height: 25px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  margin: 8px 15px 16px;
`;

const RecentRequestText = styled.p`
  margin-top: .5rem;
  font-size: 14px;
  color: #474b55;
  line-height: 1.43;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
`;

const ProgressWrapper = styled.div`
  width:100%;
  margin-top: 10px;
  margin-bottom: 10px;
`

export default MailIdCard;


