import styled from "styled-components";
import React from "react";
import GlobalStyle from "../../styles/GlobalStyle";

const MembershipLookup = () => {
  return (
    <>
      <GlobalStyle />
      <Card>
        <PrevPlanTxt>
          Find out if you already have an active Healthfirst plan.
        </PrevPlanTxt>
        <MembershipLookUp>Membership Look-up</MembershipLookUp>
      </Card>
    </>
  );
};

export default MembershipLookup;

const Card = styled.div`
  width: 100%;
  margin-top: 16px;
  margin-bottom: 40px;
  padding: 16px 16px 16px 16px;
  border-radius: 4px;
  background-color: #ffffff;
`;

const PrevPlanTxt = styled.div`
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: center;
  color: #474b55;
`;

const MembershipLookUp = styled.div`
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  border-radius: 4px;
  border: solid 0px;
  height: 30px;
  text-align: center;
  width: 200px;
  padding: 8px 16px;
  background-color: #3e7128;
  color: #ffffff;
  margin: auto;
`;
