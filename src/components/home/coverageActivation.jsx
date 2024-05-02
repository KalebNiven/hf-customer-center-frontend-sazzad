import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useHomeContext } from './homeContext';
import { handleSegmentClick } from "../../libs/segment";

const CoverageActivation = () => {
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const history = useHistory();
  const { showCoverageActivation, setShowCoverageActivation } = useHomeContext();

  const MakePremiumPaymentClick = () =>{
    handleSegmentClick("/payment","Make Premium Payment","Make Premium Payment","button", "bottom", customerInfo.data ,"payment");
   history.push('payments');
  }

  if(!showCoverageActivation) return null;

  return (
      <Card>
        <CloseIcon alt="close" src="/react/images/valid-close.svg" aria-label="Close" onClick={() => setShowCoverageActivation(false)} />
        <ActivateCoverage>
          Activate your coverage
        </ActivateCoverage>
        <PremiumPaymentTxt>
          If your Healthfirst plan has a monthly premium, make your first premium payment
          (also called a binder payment) to activate your plan. This will confirm your enrollment, and a benefits packet will be mailed to you. You will be notified when your benefits are active.
        </PremiumPaymentTxt>
        <Section onClick = {MakePremiumPaymentClick}>
          <PaymentImage alt = "" src="/react/images/icn-payment.svg" />
          <MakePremiumPayment>
            Make Premium Payment
          </MakePremiumPayment>
        </Section>
      </Card>
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
