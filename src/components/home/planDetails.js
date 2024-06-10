import styled from "styled-components";
import React from "react";
import GlobalStyle from "../../styles/GlobalStyle";
import moment from "moment";
import { useSelector } from "react-redux";

const PlanDetails = () => {
  const customerInfo = useSelector((state) => state.customerInfo.data);

  return (
    <>
      <GlobalStyle />
      <PlanStsMsg>Your Plan is No Longer Active</PlanStsMsg>
      <Card>
        <AlertIcon alt="" src="/react/images/icn-alert.svg" />
        <AlertMsg>
          <PlanTxt>Your {customerInfo.planName.toLowerCase()}</PlanTxt>
          {` plan is inactive as of ${moment(
            customerInfo.membershipExpirationDate,
          ).format("L")}. For any other questions,`}
          <ContactTxt href="https://healthfirst.org/contact" target="_blank">
            contact us
          </ContactTxt>
          .
        </AlertMsg>
      </Card>
    </>
  );
};

export default PlanDetails;

const PlanTxt = styled.span`
  text-transform: capitalize;
`;

const PlanStsMsg = styled.div`
  flex-grow: 0;
  margin: 0px 0px 16px 0px;
  font-size: 18px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
  @media only screen and (max-width: 480px) {
    margin: 0px 0px 0px 0px;
  }
`;

const Card = styled.div`
  width: 100%;
  min-height: 136px;
  margin: 16px 0 179px;
  padding: 16px 5px 16px 16px;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
`;

const AlertIcon = styled.img`
  width: 40px;
  height: 40px;
  margin: auto;
  object-fit: contain;
`;

const AlertMsg = styled.div`
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: center;
  color: #474b55;
`;

const ViewClaims = styled.div`
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  border-radius: 4px;
  border: solid 1px #d8d8d8;
  height: 30px;
  text-align: center;
  width: 120px;
  padding: 6px 16px;
  background-color: #ffffff;
  color: #008bbf;
  margin: auto;
  margin-top: 15px;
  &:hover {
    color: #2a6a9e;
    text-decoration: underline;
    cursor: pointer;
  }
`;

const ContactTxt = styled.a`
  text-decoration: underline;
  color: #474b55;
  font-weight: bold;
`;
