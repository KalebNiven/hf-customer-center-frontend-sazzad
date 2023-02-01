import styled from "styled-components";
import React from "react";
import GlobalStyle from "../../styles/GlobalStyle";
import { useSelector } from "react-redux";
import moment from 'moment';

const UpcomingPlan = () => {

  
  const customerInfo = useSelector((state) => state.customerInfo.data);

  return (
    <><GlobalStyle />
      <Card>
        <CoverageDetails>
        Your Coverage will begin on {moment(customerInfo.membershipEffectiveDate).format('LL')}.When your coverage begins
        you'll be able to:
        </CoverageDetails>
                 <Dot/>
                 <AboutTeam>View Claims and Authorizations</AboutTeam>
                 <Dot/>
                 <AboutTeam>Enroll in  AutoPay(if applicable)</AboutTeam>
                 <Dot/>
                 <AboutTeam>Search for in-network providers</AboutTeam>
                 <Dot/>
                 <AboutTeam>And so much more</AboutTeam>
                 

      </Card>
    </>
  );
};

export default UpcomingPlan;

const Card = styled.div`
  margin-bottom: 40px;
  padding: 16px 15px 16px 16px;
  border-radius: 4px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.23);
  background-color: #ffffff;
  word-break: break-word;
`;

const CoverageDetails = styled.div`
margin: 0 0 8px;
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
`;

const Dot = styled.span`
width: 4px;
height: 4px;
border-radius:50%;
background-color: #474b55;
float:left;
margin-top: 6px;
margin-left: 16px;
`;

const AboutTeam = styled.span`
  display: block;
  overflow: hidden;
  margin: 0 0 17px 30px;
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #474b55;
`;