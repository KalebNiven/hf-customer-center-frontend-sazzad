import styled from "styled-components";
import React, { useState, useEffect} from "react";
import GlobalStyle from "../../styles/GlobalStyle";
import { useSelector } from "react-redux";
import { useHomeContext } from './homeContext';
import { handleSegmentClick } from "../../libs/segment";
import { useHistory } from "react-router-dom";
import { useClient } from "@splitsoftware/splitio-react";
import { PAYMENTS_ACL, BINDER_ACL, SHOW_PAYMENTS_REACT_APP } from '../../constants/splits';

const CoverageActivation = () => {

  
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const customerInfoData = useSelector((state) => state.customerInfo);
  const history = useHistory();
  const { showCoverageActivation, setShowCoverageActivation } = useHomeContext();
  const { MIX_REACT_PAYMENTS_BASE_URL } = process.env;
  const { MIX_REACT_BINDER_BASE_URL } = process.env;
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);
  const [binderEnabled, setBinderEnabled] = useState(false);
  const [reactPaymentsPortalEnabled, setReactPaymentsPortalEnabled] = useState(false);

  const splitAttributes = {
    memberId: customerInfo.memberId,
    customerId: customerInfo.customerId,
    lob: customerInfo.sessLobCode,
    companyCode: customerInfo.companyCode,
    benefitPackage: customerInfo.benefitPackage,
    membershipStatus:customerInfo.membershipStatus,
    accountStatus:customerInfo.accountStatus,
  }

  const splitHookClient = useClient(customerInfo.customerId === null ? 'Anonymous' : customerInfo.customerId)

  const paymentsEnabledTreatment = splitHookClient.getTreatmentWithConfig(PAYMENTS_ACL, splitAttributes)
  const binderEnabledTreatment = splitHookClient.getTreatmentWithConfig(BINDER_ACL, splitAttributes)
  const showReactPaymentsPortal = splitHookClient.getTreatmentWithConfig(SHOW_PAYMENTS_REACT_APP, splitAttributes)

  useEffect(() => {
    if(!splitHookClient || paymentsEnabledTreatment.treatment === "control" || binderEnabledTreatment.treatment === "control" || showReactPaymentsPortal.treatment === "control") return;
    setPaymentsEnabled(paymentsEnabledTreatment.treatment === "off" ? false : paymentsEnabledTreatment.treatment === "on" ? true : false)
    setBinderEnabled(binderEnabledTreatment.treatment === "off" ? false : binderEnabledTreatment.treatment === "on" ? true : false)
    setReactPaymentsPortalEnabled(showReactPaymentsPortal.treatment === "off" ? false : showReactPaymentsPortal.treatment === "on" ? true : false)
  }, [splitHookClient, paymentsEnabledTreatment, binderEnabledTreatment, showReactPaymentsPortal])

  const getLangURLPrefix = (lang) => {
    switch (lang) {
      case 'es':
        return 'https://es.';
      case 'zh':
        return 'https://zh.';
    }
    return 'https://';
  }

  const MakePremiumPaymentClick = () =>{
    handleSegmentClick("/payment","Make Premium Payment","Make Premium Payment","button", "bottom", customerInfoData ,"payment");
    if(paymentsEnabled === true && binderEnabled === true){
      history.push('/payments');
    }
    else if(paymentsEnabled === true){
      //console.log('redirect to payments');
      if(reactPaymentsPortalEnabled){
        history.push('/payments');
      }
      else{
        window.location.href = getLangURLPrefix(customerInfo.loginLanguage)+MIX_REACT_PAYMENTS_BASE_URL+'/sso?loginLang='+customerInfo.loginLanguage+'&selectedLang='+customerInfo.language;
      }
    }
    else{ 
      //console.log('redirect to binder');
      window.location.href = getLangURLPrefix(customerInfo.loginLanguage)+MIX_REACT_BINDER_BASE_URL+'/sso?loginLang='+customerInfo.loginLanguage+'&selectedLang='+customerInfo.language;
    }
  }

  return (
    showCoverageActivation &&
    <><GlobalStyle />
      <Card>
        <CloseIcon alt = "" src="/react/images/valid-close.svg" onClick={() => setShowCoverageActivation(false)} />
        <ActivateCoverage>
          Activate your coverage
        </ActivateCoverage>
        <PremiumPaymentTxt>
          If your Healthfirst plan has a monthly premium, make your first premium payment
          (also called a binder payment) to activate your plan. This will confirm your enrollment, and a benefits packet will be mailed to you. You will be notified when your benefits are active.
        </PremiumPaymentTxt>
        <Section onClick = {() => MakePremiumPaymentClick()}>
          <PaymentImage alt = "" src="/react/images/icn-payment.svg" />
          <MakePremiumPayment>
            Make Premium Payment
          </MakePremiumPayment>
        </Section>
      </Card>
    </>
  );
};

export default CoverageActivation;

const Card = styled.div`
  width:100%;
  margin: 0px 0px 37px 0px;
  padding: 16px 15px 16px 16px;
  border-radius: 4px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.23);
  background-color: #008bbf;
  word-break: break-word;
`;

const ActivateCoverage = styled.div`
  font-size: 20px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: normal;
  color: #ffffff;
`;

const PremiumPaymentTxt = styled.div`
  margin: 8px 0 12px;
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.57;
  letter-spacing: normal;
  color: #ffffff;
`;

const MakePremiumPayment = styled.div`
  margin: 4px 0 4px 0px;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #ffffff;
`;

const PaymentImage = styled.img`
  width: 24px;
  height: 24px;
  margin: 0 8px 0 0;
  object-fit: contain;
`;

const CloseIcon = styled.img`
  width: 15px;
  height: 15px;
  position: relative;
  float: right;
  &:hover {
    cursor: pointer;
  }
`;

const Section = styled.div`
  display:flex;
  &:hover {
    cursor: pointer;
  }
`;

