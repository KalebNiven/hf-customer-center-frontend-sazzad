import styled from "styled-components";
import React, { useState, useEffect } from "react";
import GlobalStyle from "../../styles/GlobalStyle";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
import {
  getRecertificationDate,
  isEligibleForRecertDate,
} from "../../utils/misc.js";

const HOHDependents = () => {
  const hohDependents = useSelector((state) => state.customerInfo.data);
  const activeOrUpcomingDependents = hohDependents.dependents.filter(
    (dependent) =>
      dependent.Status === "active" || dependent.Status === "upcoming"
  );
  const history = useHistory();
  const [showPlan, setShowPlan] = useState(false);

  useEffect(() => {
    hohDependents.dependents.map((dependent, index) => {
      (dependent.Status === "active" || dependent.Status === "upcoming") &&
        setShowPlan(true);
    });
  }, []);

  return (
    hohDependents.dependents !== undefined &&
    hohDependents.dependents.length > 0 && (
      <>
        {" "}
        <GlobalStyle />
        {showPlan && <MyHouseholdTxt>My Household</MyHouseholdTxt>}
        <HOHDependent>
          {activeOrUpcomingDependents.map((dependent, index) => (
            <Card
              key={index}
              space={index + 1 === activeOrUpcomingDependents.length}
              status={dependent.Status}
              onClick={() =>
                dependent.Status === "active" &&
                history.push({
                  pathname: "/idcard",
                  state: { dependentMemberId: dependent.memberId },
                })
              }
            >
              {dependent.firstName.concat(" ", dependent.lastName).length >=
              24 ? (
                <Tooltip title={dependent.firstName + " " + dependent.lastName}>
                  <DependentName>
                    {dependent.firstName
                      .concat(" ", dependent.lastName)
                      .substring(0, 24)
                      .concat("...")}
                  </DependentName>
                </Tooltip>
              ) : (
                <DependentName>
                  {dependent.firstName.concat(" ", dependent.lastName)}
                </DependentName>
              )}
              <PlanName>{dependent.planName}</PlanName>
              <MemberDetails>Member ID: {dependent.memberId}</MemberDetails>
              <Status status={dependent.Status}>
                <StatusTxt status={dependent.Status}>
                  {dependent.Status}
                </StatusTxt>
              </Status>
              {isEligibleForRecertDate(
                dependent.companyCode,
                dependent.benefitPackage,
                dependent.renewalDate
              ) && (
                <RenewalDate>
                  {getRecertificationDate(
                    dependent.companyCode,
                    dependent.benefitPackage,
                    dependent.renewalDate
                  )}
                </RenewalDate>
              )}
              {dependent.Status === "active" && (
                <MemberIcon alt="" src="/react/images/icn-household.svg" />
              )}
            </Card>
          ))}
        </HOHDependent>
      </>
    )
  );
};

export default HOHDependents;

const MyHouseholdTxt = styled.div`
  flex-grow: 0;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
  margin-bottom: 16px;
  @media only screen and (max-width: 480px) {
    margin: 0px 0px 0px 0px;
  }
`;

const HOHDependent = styled.div`
  @media only screen and (max-width: 768px) {
    margin-right: -86px;
  }
  @media only screen and (max-width: 668px) {
    margin-right: -16px;
  }
  margin-bottom: 40px;
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  overflow-x: auto;
  max-height: 145px;
  ::-webkit-scrollbar {
    display: none;
  }
  @media only screen and (min-width: 960px) {
    box-shadow: 0 2px 8px 0 #d8d8d8;
    margin-right: 0px;
    max-height: 420px;
    flex-direction: column;
    overflow-y: auto;
    ::-webkit-scrollbar {
      display: block;
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      border-radius: 8px;
    }
    ::-webkit-scrollbar-thumb {
      background: #a8abac;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #c3c3ce;
    }
  }
`;

const Card = styled.div`
  width: 100%;
  flex-grow: 0;
  margin: ${(props) => !props.space && "0 0 10px 0"};
  cursor: ${(props) => props.status === "active" && "pointer"};
  padding: 16px;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  position: relative;
  @media only screen and (max-width: 959px) {
    margin: ${(props) =>
      !props.space ? "16px 8px 16px 0px" : "16px 0px 16px 0px"};
  }
  @media only screen and (max-width: 768px) {
    width: 294px;
  }
  @media only screen and (max-width: 480px) {
    width: 256px;
  }
  &:hover {
    background: ${(props) =>
      props.status === "active" &&
      "linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), #FFFFFF"};
  }
`;

const DependentName = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: #474b55;
`;

const PlanName = styled.div`
  flex-grow: 0;
  margin: 0 0px 2px 0px;
  font-size: 12px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  text-transform: capitalize;
`;

const MemberDetails = styled.div`
  flex-grow: 0;
  margin: 2px 0 0 0px;
  font-size: 12px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: left;
  color: #757575;
`;

const Status = styled.div`
  width: 90px;
  height: 20px;
  margin: 5px 0;
  padding: 4px 6px;
  background-color: ${(props) =>
    props.status === "active"
      ? "#3e7128"
      : props.status === "inactive"
      ? "#d43900"
      : "#ffffff"};
  border-radius: 5px;
  border: ${(props) => props.status === "upcoming" && "solid 1px #529535"};
`;

const StatusTxt = styled.p`
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 1.5px;
  text-align: center;
  text-transform: uppercase;
  color: ${(props) => (props.status === "upcoming" ? "#529535" : "#ffffff")};
`;

const MemberIcon = styled.img`
  filter: opacity(0.3) drop-shadow(0 0 0 #474b55);
  width: 20px;
  height: 20px;
  position: absolute;
  right: 10px;
  top: 10px;
  &:hover {
    cursor: pointer;
  }
  bottom: 95px;
`;

const RenewalDate = styled.div`
  color: #474b55;
  font-size: 14px;
  font-weight: 400;
`;
