import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useClient } from "@splitsoftware/splitio-react";
import GlobalStyle from "../../styles/GlobalStyle";
import { AnalyticsPage, AnalyticsTrack } from "../common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import PaymentPortal from "./paymentPortal";
import { PAYMENTS_ACL, BINDER_ACL, SHOW_PAYMENTS_REACT_APP } from '../../constants/splits';
import GlobalError from "../common/globalErrors/globalErrors";
import Spinner from "../common/spinner";
import { PaymentsModalContext, PaymentsModalContextProvider, usePaymentsModalContext } from "../../context/paymentsModalContext";
import MemberSelectionModal from "./memberSelectionModal";
import { useHistory } from "react-router-dom";

const PaymentPage = () => {

  const { MIX_REACT_APP_BINDER_SITE_HREF } = process.env;
  const { MIX_REACT_APP_PAYMENT_SITE_HREF } = process.env;
  const { paymentsModalState, setPaymentsModalState, resetPaymentsModal } = usePaymentsModalContext();
  const [showPortal, setShowPortal] = useState(false);
  const [loading, setLoading] = useState(true);
  const customerInfo = useSelector((state) => state.customerInfo);
  const selectedPlan = useSelector((state) => state.selectPlan);
  const {
    memberId,
    companyCode,
    customerId,
    benefitPackage,
    sessLobCode,
    membershipStatus,
    accountStatus
  } = customerInfo?.data ?? {};
  const [splitAttributes, setSplitAttributes] = useState({
    memberId: memberId,
    lob: sessLobCode,
    membershipStatus,
    benefitPackage,
    accountStatus,
    companyCode,
  });
  const history = useHistory();
  const splitHookClient = useClient();
  const { treatment } = splitHookClient.getTreatmentWithConfig(SHOW_PAYMENTS_REACT_APP, splitAttributes); //defaults to 'control'
  let paymentsEnabledTreatment = splitHookClient.getTreatmentWithConfig(PAYMENTS_ACL, splitAttributes)
  let binderEnabledTreatment = splitHookClient.getTreatmentWithConfig(BINDER_ACL, splitAttributes)
  useEffect(() => {
    sessionStorage.setItem("longLoad", false);
    if(customerInfo?.data?.hohPlans.length > 1){
      displayMembersModal('link', 'Payments');
    }
  }, []);

  const showNewPaymentsApp = useMemo(() => {
    if (!(splitHookClient && splitHookClient.Event.SDK_READY)) return false;
    return treatment === "on";
  }, [splitHookClient, treatment]);

  useEffect(() => {
    if(paymentsModalState?.membership == null) return;
    setSplitAttributes({
      memberId: paymentsModalState?.membership?.MemberId,
      lob: paymentsModalState?.membership?.LOBCode,
      membershipStatus: paymentsModalState?.membership?.MembershipStatus,
      benefitPackage: paymentsModalState?.membership?.BenefitPackage,
      accountStatus: accountStatus,
      companyCode: paymentsModalState?.membership?.CompanyNumber,
    });
  }, [paymentsModalState]);

  useEffect(() => {
    paymentsEnabledTreatment = splitHookClient.getTreatmentWithConfig(PAYMENTS_ACL, splitAttributes)
    binderEnabledTreatment = splitHookClient.getTreatmentWithConfig(BINDER_ACL, splitAttributes)
  }, [splitAttributes]);

  // ACL Redirect
  useEffect(() => {
    if(customerInfo.data.hohPlans.length > 1 && (selectedPlan.status === 'init' || paymentsModalState.membership == null)) return;
    if(null == localStorage.getItem('okta-token-storage') || !splitHookClient || paymentsEnabledTreatment.treatment === "control" || binderEnabledTreatment.treatment === "control") return;
      let isRedirecting = false;
      if(paymentsEnabledTreatment.treatment === "on" && binderEnabledTreatment.treatment === "off"){
        if(showNewPaymentsApp){
          setShowPortal(showNewPaymentsApp);
        }
        else{
          isRedirecting = true;
          history.goBack();
          window.location.href = MIX_REACT_APP_PAYMENT_SITE_HREF;
        }
      }
      if(paymentsEnabledTreatment.treatment === "off" && binderEnabledTreatment.treatment === "on"){
        isRedirecting = true;
        history.goBack();
        window.location.href = MIX_REACT_APP_BINDER_SITE_HREF;
      }
      setLoading(isRedirecting);
  }, [splitHookClient, paymentsEnabledTreatment, binderEnabledTreatment, selectedPlan])

  const displayMembersModal = (routeLink, externalLinkName) => {
    setPaymentsModalState({ ...paymentsModalState, showMemberModal: true, routeLink, externalLinkName })
  }

  const handleSegmentBtn = (label,link) => {
    AnalyticsPage();
    AnalyticsTrack(
    label + " " + "button clicked",
    customerInfo,
    {
    "raw_text": label,
    "destination_url": link,
    "description": `${label} button clicked`,
    "category": ANALYTICS_TRACK_CATEGORY.payments,
    "type": ANALYTICS_TRACK_TYPE.buttonClicked,
    "targetMemberId": memberId,
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
    if(link) window.location.href = link;
  }

  const handleMonthlyPaymentBtnClick = () => {
    handleSegmentBtn("Monthly premium payment", !showNewPaymentsApp && MIX_REACT_APP_PAYMENT_SITE_HREF);
    setShowPortal(showNewPaymentsApp);
  };
  if(paymentsEnabledTreatment.treatment === "off" && binderEnabledTreatment.treatment === "off") return (<GlobalError />);

  if(showPortal) return (
  <PaymentPortalWrapper>
    <BrandingContainer>
      <BrandingImage src="react/images/leaf-icon@3x.png" alt="" />
      <BrandingTitleWrapper>
        <BrandingTitle>Payments</BrandingTitle>
      </BrandingTitleWrapper>
    </BrandingContainer>
    <PaymentPortal />
  </PaymentPortalWrapper>
  );

  return(
    (loading || selectedPlan.loading) ?
    <Container>
        <ProgressWrapper>
            <Spinner />
        </ProgressWrapper>
    </Container>
    :
    <Container>
      <>
    <GlobalStyle />
    <PaymentTypeTxt>What type of payment would you like to make?</PaymentTypeTxt>
      <InnerContainer>
        <LeftContainer>
          <Card>
          <Heading>Monthly premium payment</Heading>
          <Description>Make ongoing monthly payments towards your premium plan.</Description>
          <PaymentButton onClick={handleMonthlyPaymentBtnClick}>Monthly Premium Payment</PaymentButton>
          </Card>
        </LeftContainer>
        <RightContainer>
        <Card>
        <Heading>First premium payment for a new plan</Heading>
          <Description>Make your first payment for your new plan. This payment will confirm your enrollment so you can start using your benefits. </Description>
          <FirstPaymentButton onClick={() => handleSegmentBtn("First premium payment", MIX_REACT_APP_BINDER_SITE_HREF)}>First Premium Payment</FirstPaymentButton>
            </Card>
        </RightContainer>
      </InnerContainer>
      </>
    </Container>
  )
};

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

const BrandingContainer = styled.div`
  height: 240px;
  overflow: hidden;
  position: relative;
  background-image: linear-gradient(to bottom,#003863, rgba(238, 238, 238, 0)),linear-gradient(
    101deg, #0377a3, #0377a3, #367c19);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
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

const BrandingTitleWrapper = styled.div`
  position: absolute;
  top: 38%;
  width: 60rem;
  max-width: 90%;
`;

const BrandingTitle = styled.h1`
  font-family: 'museo-sans', sans-serif;
  font-size: 32px;
  line-height: 40px;
  font-weight: 600;
  color: #fff;
  @media only screen and (max-width: 768px) {
    text-align: center;
  }
`;

const ProgressWrapper = styled.div`
  width:100%;
  margin-top: 10px;
  margin-bottom: 10px;
`

export default PaymentPage;
