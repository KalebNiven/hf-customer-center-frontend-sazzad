import React, { useEffect, useState, useMemo, useCallback } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useClient } from "@splitsoftware/splitio-react";
import { useHistory } from "react-router-dom";
import GlobalStyle from "../../styles/GlobalStyle";
import { AnalyticsPage, AnalyticsTrack } from "../common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import PaymentPortal from "./paymentPortal";
import {
  PAYMENTS_ACL,
  BINDER_ACL,
  SHOW_PAYMENTS_REACT_APP,
  SHOW_BINDER_REACT_APP,
} from '../../constants/splits';
import GlobalError from "../common/globalErrors/globalErrors";
import Spinner from "../common/spinner";
import { PaymentsModalContext, PaymentsModalContextProvider, usePaymentsModalContext } from "../../context/paymentsModalContext";
import MemberSelectionModal from "./memberSelectionModal";
import { requestSelectPlan } from "../../store/actions";
import BinderPortal from "./binderPortal";

const handleSegmentBtn = (customerInfo, label, link = null) => {
  AnalyticsPage();
  AnalyticsTrack(
    `${label} button clicked`,
    customerInfo,
    {
      raw_text: label,
      destination_url: link,
      description: `${label} button clicked`,
      category: ANALYTICS_TRACK_CATEGORY.payments,
      type: ANALYTICS_TRACK_TYPE.buttonClicked,
      targetMemberId: customerInfo?.data?.memberId,
      location: {
        desktop: {
          width: 960,
          value: "left",
        },
        tablet: {
          width: 768,
          value: "right",
        },
        mobile: {
          width: 0,
          value: "right",
        },
      },
    },
  );
  if (link) window.location.href = link;
};

function PaymentPage() {
  const { MIX_REACT_APP_BINDER_SITE_HREF } = process.env;
  const { MIX_REACT_APP_PAYMENT_SITE_HREF } = process.env;
  const { paymentsModalState, setPaymentsModalState, resetPaymentsModal } = usePaymentsModalContext();
  const [showPaymentPortal, setShowPaymentPortal] = useState(false);
  const [showBinderPortal, setShowBinderPortal] = useState(false);
  const [loading, setLoading] = useState(true);
  const customerInfo = useSelector((state) => state.customerInfo);
  const [plans, setPlans] = useState(null);
  const selectedPlan = useSelector((state) => state.selectPlan);
  const {
    memberId,
    companyCode,
    customerId,
    benefitPackage,
    sessLobCode,
    membershipStatus,
    accountStatus,
  } = customerInfo?.data ?? {};
  const [splitAttributes, setSplitAttributes] = useState({
    memberId,
    lob: sessLobCode,
    membershipStatus,
    benefitPackage,
    accountStatus,
    companyCode,
  });
  const dispatch = useDispatch();
  const history = useHistory();
  const splitHookClient = useClient();
  const displayReactPaymentsTreatment = splitHookClient.getTreatmentWithConfig(SHOW_PAYMENTS_REACT_APP, splitAttributes); // defaults to 'control'
  const displayReactBinderTreatment = splitHookClient.getTreatmentWithConfig(SHOW_BINDER_REACT_APP, splitAttributes);
  let paymentsEnabledTreatment = splitHookClient.getTreatmentWithConfig(PAYMENTS_ACL, splitAttributes);
  let binderEnabledTreatment = splitHookClient.getTreatmentWithConfig(BINDER_ACL, splitAttributes);

  useEffect(() => {
    sessionStorage.setItem("longLoad", false);
    if(splitHookClient.Event.SDK_READY){
      let filteredPlans = getPlansWithPayments();
      setPlans(filteredPlans);
      if((filteredPlans.length > 1)){
        displayMembersModal('link', 'Payments');
      }
    }
  }, []);

  const showNewPaymentsApp = useMemo(() => {
    if (!(splitHookClient && splitHookClient.Event.SDK_READY)) return false;
    return displayReactPaymentsTreatment.treatment === "on";
  }, [splitHookClient, displayReactPaymentsTreatment]);

  const showReactBinder = useMemo(() => {
    if (!(splitHookClient && splitHookClient.Event.SDK_READY)) return false;
    return displayReactBinderTreatment.treatment === "on";
  }, [splitHookClient, displayReactBinderTreatment]);

  const onShowPaymentPortal = useCallback((isBtnClick = true) => {
    setShowPaymentPortal(showNewPaymentsApp);

    if (isBtnClick) return handleSegmentBtn(customerInfo, "Monthly premium payment", !showNewPaymentsApp && MIX_REACT_APP_PAYMENT_SITE_HREF);
    if (!showNewPaymentsApp) {
      setLoading(true);
      history.goBack();
      window.location.href = MIX_REACT_APP_PAYMENT_SITE_HREF;
    }
  }, [memberId, showNewPaymentsApp, setLoading, history]);

  const onShowBinder = useCallback((isBtnClick = true) => {
    setShowBinderPortal(showReactBinder);
    if (isBtnClick) return handleSegmentBtn(customerInfo, "First premium payment", !showReactBinder && MIX_REACT_APP_BINDER_SITE_HREF);
    // else on page load ACL checks
    if (!showReactBinder) {
      setLoading(true);
      history.goBack();
      window.location.href = MIX_REACT_APP_PAYMENT_SITE_HREF;
    }
  }, [showReactBinder, setShowBinderPortal, setLoading, history]);

  const checkACLs = (plan, accountStatus) => {
    let planAttrs = {
      memberId: plan?.MemberId,
      lob: plan?.LOBCode,
      membershipStatus: plan?.MembershipStatus,
      benefitPackage: plan?.BenefitPackage,
      accountStatus: accountStatus,
      companyCode: plan?.CompanyNumber,
    };
    let paymentsEnabledTreatment = splitHookClient.getTreatmentWithConfig(PAYMENTS_ACL, planAttrs);
    let binderEnabledTreatment = splitHookClient.getTreatmentWithConfig(BINDER_ACL, planAttrs);
    return (paymentsEnabledTreatment.treatment === "on" || binderEnabledTreatment.treatment === "on");
  }

  const getPlansWithPayments = () => {
    let filteredPlans = [];
    customerInfo.data.hohPlans.forEach((plan) => {
        if(checkACLs(plan, customerInfo?.data?.accountStatus)){
            filteredPlans.push(plan);
        }
    });
    return filteredPlans;
  }

  useEffect(() => {
    if (paymentsModalState?.membership == null) return;
    setSplitAttributes({
      memberId: paymentsModalState?.membership?.MemberId,
      lob: paymentsModalState?.membership?.LOBCode,
      membershipStatus: paymentsModalState?.membership?.MembershipStatus,
      benefitPackage: paymentsModalState?.membership?.BenefitPackage,
      accountStatus,
      companyCode: paymentsModalState?.membership?.CompanyNumber,
    });
  }, [paymentsModalState]);

  useEffect(() => {
    paymentsEnabledTreatment = splitHookClient.getTreatmentWithConfig(PAYMENTS_ACL, splitAttributes);
    binderEnabledTreatment = splitHookClient.getTreatmentWithConfig(BINDER_ACL, splitAttributes);
  }, [splitAttributes]);

  splitHookClient.on(splitHookClient.Event.SDK_READY, function() {
    let filteredPlans = getPlansWithPayments();
    setPlans(filteredPlans);
    if((filteredPlans.length > 1)){
      displayMembersModal('link', 'Payments');
    }
  });

  useEffect(() => {
    if(customerInfo?.data?.hohPlans[0]?.MembershipKey == null) return;
    if(customerInfo?.data?.hohPlans.length === 1){
      dispatch(requestSelectPlan(customerInfo?.data?.hohPlans[0]?.MembershipKey));
    }
  }, [customerInfo]);

  // ACL Redirect
  useEffect(() => {
    if((plans === null || plans.length > 1) && (selectedPlan?.status === 'init' || paymentsModalState?.membership == null)) return;
    if (localStorage.getItem('okta-token-storage') == null || !splitHookClient || paymentsEnabledTreatment.treatment === "control" || binderEnabledTreatment.treatment === "control") return;
    if (plans.length === 0) onShowBinder(true);

    if(plans.length == 1){
      plans.forEach((plan) => {
        let planAttrs = {
          memberId: plan?.MemberId,
          lob: plan?.LOBCode,
          membershipStatus: plan?.MembershipStatus,
          benefitPackage: plan?.BenefitPackage,
          accountStatus: accountStatus,
          companyCode: plan?.CompanyNumber,
        };
        let paymentsEnabledTreatment = splitHookClient.getTreatmentWithConfig(PAYMENTS_ACL, planAttrs);
        let binderEnabledTreatment = splitHookClient.getTreatmentWithConfig(BINDER_ACL, planAttrs);
        if (paymentsEnabledTreatment.treatment === "on" && binderEnabledTreatment.treatment === "off") onShowPaymentPortal(false);
        else if (paymentsEnabledTreatment.treatment === "off" && binderEnabledTreatment.treatment === "on") onShowBinder(false);
      })
    }
    else if(paymentsModalState?.membership){
      let planAttrs = {
        memberId: paymentsModalState?.membership?.MemberId,
        lob: paymentsModalState?.membership?.LOBCode,
        membershipStatus: paymentsModalState?.membership?.MembershipStatus,
        benefitPackage: paymentsModalState?.membership?.BenefitPackage,
        accountStatus: accountStatus,
        companyCode: paymentsModalState?.membership?.CompanyNumber,
      };
      let paymentsEnabledTreatment = splitHookClient.getTreatmentWithConfig(PAYMENTS_ACL, planAttrs);
      let binderEnabledTreatment = splitHookClient.getTreatmentWithConfig(BINDER_ACL, planAttrs);
      if (paymentsEnabledTreatment.treatment === "on" && binderEnabledTreatment.treatment === "off") onShowPaymentPortal(false);
      else if (paymentsEnabledTreatment.treatment === "off" && binderEnabledTreatment.treatment === "on") onShowBinder(false);
    }
    setLoading(false);
  }, [splitHookClient, paymentsEnabledTreatment, binderEnabledTreatment, selectedPlan]);

  const displayMembersModal = (routeLink, externalLinkName) => {
    setPaymentsModalState({
      ...paymentsModalState, showMemberModal: true, routeLink, externalLinkName,
    });
  };

  if (paymentsEnabledTreatment.treatment === "off" && binderEnabledTreatment.treatment === "off") return (<GlobalError />);

  if (showBinderPortal) {
    return (
      <PaymentPortalWrapper>
        <BinderPortal />
      </PaymentPortalWrapper>
    );
  }

  if (showPaymentPortal) {
    return (
      <PaymentPortalWrapper>
        <Banner>
          <BrandingContainer>
            <BrandingInnerContainer>
              <BrandingLeftContainer>
                <LeafIcon alt = "" type = {accountStatus } src="/react/images/leaf-icon@3x.png"></LeafIcon>
                <Div type = {accountStatus}>
                  <BrandingTitle>Payments</BrandingTitle>
                </Div>
              </BrandingLeftContainer>
              <BrandingRightContainer/>
            </BrandingInnerContainer>
          </BrandingContainer>
        </Banner>
        <PaymentPortal />
      </PaymentPortalWrapper>
    );
  }

  return (
    (loading || selectedPlan.loading)
      ? (
        <Container>
          <ProgressWrapper>
            <Spinner />
          </ProgressWrapper>
        </Container>
      )
      : (
        <Container>
          <>
            <GlobalStyle />
            <PaymentTypeTxt>What type of payment would you like to make?</PaymentTypeTxt>
            <InnerContainer>
              <LeftContainer>
                <Card>
                  <Heading>Monthly premium payment</Heading>
                  <Description>Make ongoing monthly payments towards your premium plan.</Description>
                  <PaymentButton onClick={onShowPaymentPortal}>Monthly Premium Payment</PaymentButton>
                </Card>
              </LeftContainer>
              <RightContainer>
                <Card>
                  <Heading>First premium payment for a new plan</Heading>
                  <Description>Make your first payment for your new plan. This payment will confirm your enrollment so you can start using your benefits. </Description>
                  <FirstPaymentButton onClick={onShowBinder}>First Premium Payment</FirstPaymentButton>
                </Card>
              </RightContainer>
            </InnerContainer>
          </>
        </Container>
      )
  );
}

const Container = styled.div`
position:relative;
color:#f4f4f4;
height:100%;
margin: 0 144px;
  width:calc(100% - 288px);
  @media only screen and (max-width: 1200px) {
    margin: 0 86px;
    width:calc(100% - 172px);
  };
  @media only screen and (max-width: 768px) {
    display:block;
    margin: 0 16px;
    width:calc(100% - 32px);
  };
`;

const PaymentTypeTxt = styled.div`
margin: 40px 0 24px 0;
margin-left:auto;
margin-right:auto;
font-size: 20px;
font-weight: 500;
font-stretch: normal;
font-style: normal;
line-height: 1.6;
letter-spacing: normal;
color: #003863;
display: flex;
width: 896px;
justify-content: flex-start;
@media only screen and (max-width: 768px) {
  width:100%;
  overflow-wrap: break-word;
};
`;

const InnerContainer = styled.div`
  display: flex;
  gap:10px;
  flex: 1 1 auto;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  @media only screen and (max-width: 768px) {
    display:block;
  };
`;

const LeftContainer = styled.div`
  display: block;
  width:448px;
  @media only screen and (max-width: 768px) {
    width:100%;
  };
`;

const RightContainer = styled.div`
  display: block;
  width:448px;
  @media only screen and (max-width: 768px) {
    width:100%;
  };
`;

const Card = styled.div`
  height:100%;
  flex-grow: 0;
  padding: 24px;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  @media only screen and (max-width: 768px) {
    margin-bottom: 21px;
  };
`;

const Heading = styled.div`
  @media only screen and (min-width: 768px) and (max-width: 1069px) {
    height: 2.5rem;
  };
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #003863;
`;

const Description = styled.div`
padding: 0 0 12px;
  max-height: 50px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #474b55;
`;

const PaymentButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  margin: 30px 0 0;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #3e7128;
  border: 1px solid #3e7128;
  color: #ffffff;
  font-weight: bold;
  font-size: 1.25rem;
  line-height: 1.5rem;
  @media only screen and (max-width: 768px) {
    margin: 0;
  };
`;

const FirstPaymentButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  margin: 30px 0 0;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #3e7128;
  border: 1px solid #3e7128;
  color: #ffffff;
  font-weight: bold;
  font-size: 1.25rem;
  line-height: 1.5rem;
  @media only screen and (max-width: 768px) {
    margin: 6px 0 0;
  };
`;

const PaymentPortalWrapper = styled.div`
  display: block;
  width: 100%;
  background-color: none;
  color: #000;
  font-weight: 400;
  font-size: 16px;
  line-height: normal;
  position:relative;
  height:100%;
`;

const Banner = styled.div`
  height: 240px;
  margin: auto;
  @media only screen and (max-width: 480px) {
    height: 240px;
  }
  background-image: linear-gradient(to bottom,#003863, rgba(238, 238, 238, 0)),linear-gradient(
  101deg, #0377a3, #0377a3, #367c19);
`;

const BrandingContainer = styled.span`
  position:absolute;
  padding-top: 40px;
  margin: 3px 0 0px 0px;
  width:100%;
  @media only screen and (max-width: 960px) {
    margin-top: 21px;
    padding-top: 20px;
  };
  @media only screen and (max-width: 768px) {
    margin-top: 21px;
    padding-top: 20px;
  };
  @media only screen and (max-width: 480px) {
    // margin-top: -34px;
    margin-left: 0px;
    // padding-top:20px
  }
`;

const BrandingInnerContainer = styled.div`
  display: flex;
  margin: 0 144px;
  width:calc(100% - 288px);
  gap:35px;
  flex: 1 1 auto;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  @media only screen and (max-width: 1200px) {
    margin: 0 86px;
    width:calc(100% - 172px);
  };
  @media only screen and (max-width: 960px) {
    display: contents;
    margin: 0;
    width:100%;
  };
`;

const BrandingLeftContainer = styled.div`

  display: block;
  width:950px;
    @media only screen and (max-width: 960px) {
      margin: 0 86px;
      width: calc(100% - 172px);
    };

    @media only screen and (max-width: 668px) {
      margin: 0 16px;
      width:calc(100% - 32px);
    };

`;

const LeafIcon = styled.img`
  width: 240px;
  float: left;
  margin-left: -144px;
  object-fit: contain;
  position:absolute;
  margin-top :0px;
  @media only screen and (max-width: 960px) {
     margin-left: -144px;
     float:right;
    position:relative;
    margin-top: -60px;
  }
  @media only screen and (max-width: 480px) {
    padding-right:8px;
    width:240px;
    height:240px;
    padding-top:0;
    top:0px;
    margin-top: -30px;
  }
`;

const Div = styled.div`
  margin-top: 40px;
`;

const BrandingRightContainer = styled.div`
  display: block;
`;

const BrandingImage = styled.img`
  width: 240px;
  padding-top: 20px;
  @media only screen and (max-width: 960px) {
    margin-left: auto;
  }
  @media only screen and (min-width: 960px) {
    margin-right: auto;
  }
`;

const BrandingTitle = styled.h1`
  height: 60px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  font-size: 48px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: normal;
  color: white;text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: block;
  @media only screen and (max-width: 768px) {
    font-size: 48px;
  };
`;

const ProgressWrapper = styled.div`
  width:100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export default PaymentPage;
