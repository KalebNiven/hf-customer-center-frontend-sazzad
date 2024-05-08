import styled from "styled-components";
import React from "react";
import GlobalStyle from "../../styles/GlobalStyle";

const ReportAnIssue = () => {
  return (
    <>
      <GlobalStyle />
      <Card>
        <IncorrectTxt>See something above that’s incorrect?</IncorrectTxt>
        <ReportIssue>Report an Issue</ReportIssue>
      </Card>
    </>
  );
};

export default ReportAnIssue;

const Card = styled.div`
  width: 100%;
  margin: 16px 0 0;
  padding: 16px 5px 16px 16px;
  border-radius: 4px;
  background-color: rgba(170, 170, 170, 0.12);
  @media only screen and (max-width: 480px) {
    margin: 16px 0px 16px -10px;
  }
`;

const IncorrectTxt = styled.div`
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
`;

const ReportIssue = styled.div`
  margin: 6px 0px 0 0;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: left;
  color: #3e7128;
`;
