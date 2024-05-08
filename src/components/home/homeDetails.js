import styled from "styled-components";
import React, { useEffect, useState } from "react";
import Carousel from "./carousel";
import HealthFirstPlan from "./healthFirstPlan";
import PreviousHealthPlan from "./prevHealthPlan";
import AddMembership from "./addMembership";
import PrimaryCareProvider from "./primaryCareProvider";
import SSOCards from "./ssoCards";
import PlanDetails from "./planDetails";
import MembershipLookup from "./membershipLookup";
import MakePayment from "./makePayment";
import HealthFirstChecklist from "./healthfirstChecklist";
import ReportAnIssue from "./reportAnIssue";
import UpcomingPlan from "./upcomingPlan";
import CoverageActivation from "./coverageActivation";
import HOHDependents from "./hohDependents";
import HelpfulTips from "./helpfulTips";
import { Hidden } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../common/spinner";
import { requestCarouselItems } from "../../store/actions";
import OTC from "./otc/index";

const HomeDetails = () => {
  const carouselLoading = useSelector(
    (state) => state.homeDetails.carouselLoading
  );
  const customerInfo = useSelector((state) => state.customerInfo);
  const dispatch = useDispatch();

  const formatCarouselReqPayload = (memberships) => {
    let arr = [];
    memberships.forEach((membership) => {
      arr.push({
        benefitPackage: membership["BenefitPackage"],
        companyCode: membership["CompanyNumber"],
        membershipStatus: membership["MembershipStatus"],
      });
    });
    return arr;
  };

  useEffect(() => {
    if (customerInfo.data.customerId) {
      dispatch(
        requestCarouselItems(
          formatCarouselReqPayload(customerInfo.data.hohPlans)
        )
      );
    }
  }, []);

  return customerInfo.data.accountStatus === "MEMBER" ? (
    customerInfo.data.membershipStatus === "active" ? (
      !customerInfo.loading && !carouselLoading ? (
        <Container>
          <Hidden smDown>
            <InnerContainer>
              <LeftContainer>
                <HealthFirstPlan />
                <HOHDependents />
                <PrimaryCareProvider />
                <PreviousHealthPlan />
                <OTC />
              </LeftContainer>
              <RightContainer>
                <Carousel />
                <HelpfulTips />
                <SSOCards />
              </RightContainer>
            </InnerContainer>
          </Hidden>
          <Hidden mdUp>
            <MobContainer>
              <Carousel />
              <HelpfulTips />
              <HealthFirstPlan />
              <HOHDependents />
              <PrimaryCareProvider />
              <PreviousHealthPlan />
              <OTC />
              <SSOCards />
            </MobContainer>
          </Hidden>
        </Container>
      ) : (
        <ProgressWrapper>
          <Spinner />
        </ProgressWrapper>
      )
    ) : customerInfo.data.membershipStatus === "inactive" ? (
      <Container>
        <Hidden smDown>
          <InnerContainer>
            <LeftContainer membershipStatus="inactive"></LeftContainer>
            <RightContainer membershipStatus="inactive">
              <Carousel />
              <MakePayment />
              <SSOCards />
              <PlanDetails />
            </RightContainer>
          </InnerContainer>
        </Hidden>
        <Hidden mdUp>
          <MobContainer>
            <Carousel />
            <MakePayment />
            <SSOCards />
            <PlanDetails />
          </MobContainer>
        </Hidden>
      </Container>
    ) : (
      <Container>
        <Hidden smDown>
          <InnerContainer>
            <LeftContainer>
              {/* <HealthFirstPlan /> */}
              <PreviousHealthPlan />
            </LeftContainer>
            <RightContainer>
              <Carousel />
              <UpcomingPlan />
            </RightContainer>
          </InnerContainer>
        </Hidden>
        <Hidden mdUp>
          <MobContainer>
            <Carousel />
            <UpcomingPlan />
            {/* <HealthFirstPlan /> */}
            <PreviousHealthPlan />
          </MobContainer>
        </Hidden>
      </Container>
    )
  ) : (
    <Container>
      <Hidden smDown>
        <InnerContainer>
          <LeftContainer>
            {/* <HealthFirstPlan /> */}
            <AddMembership />
            {/* <ReportAnIssue /> */}
          </LeftContainer>
          <RightContainer>
            <CoverageActivation />
            <HealthFirstChecklist />
          </RightContainer>
        </InnerContainer>
      </Hidden>
      <Hidden mdUp>
        <MobContainer>
          <CoverageActivation />
          {/* <HealthFirstPlan /> */}
          <AddMembership />
          {/* <ReportAnIssue /> */}
          <HealthFirstChecklist />
        </MobContainer>
      </Hidden>
    </Container>
  );
};

const Container = styled.div`
  backgroundcolor: #484c55;
  color: black;
  position: relative;
  margin-top: 56px;
  width: 100%;
  @media only screen and (max-width: 896px) {
    margin-top: 56px;
  } ;
`;

const InnerContainer = styled.div`
  display: flex;
  gap: 35px;
  flex: 1 1 auto;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  margin: 0 144px;
  width: calc(100% - 288px);
  @media only screen and (max-width: 1200px) {
    margin: 0 86px;
    width: calc(100% - 172px);
  } ;
`;

const LeftContainer = styled.div`
  display: block;
  width: 310px;
  ${(props) => props.membershipStatus === "inactive" && "order:2"};
`;

const RightContainer = styled.div`
  display: block;
  width: 650px;
  ${(props) => props.membershipStatus === "inactive" && "order:1"};
`;

const MobContainer = styled.div`
  @media only screen and (max-width: 960px) {
    margin: 0 86px;
    width: calc(100% - 172px);
  }
  @media only screen and (max-width: 668px) {
    margin: 0 16px;
    width: calc(100% - 32px);
  } ;
`;

const ProgressWrapper = styled.div`
  width: 100%;
  position: relative;
  margin-top: 100px;
`;

export default HomeDetails;
