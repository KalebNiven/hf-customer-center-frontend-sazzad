import styled from "styled-components";
import React from "react";
import GlobalStyle from "../../styles/GlobalStyle";
import { useSelector } from "react-redux";
import { useHomeContext } from './homeContext';
import { FeatureTreatment } from "../../libs/featureFlags";
import { SHOW_PAYMENTS } from "../../constants/splits";

const MakePayment = () => {

  
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const { showPayment, setShowPayment } = useHomeContext();

  const splitAttributes = {
    lob: customerInfo.sessLobCode,
    companyCode: customerInfo.companyCode,
    benefitPackage: customerInfo.benefitPackage,
    membershipStatus:customerInfo.membershipStatus,
    accountStatus:customerInfo.accountStatus,
  }

  return (
    showPayment && 
    <FeatureTreatment
      treatmentName={SHOW_PAYMENTS}
      onLoad={() => { }}
      onTimedout={() => { }}
      attributes={splitAttributes}
    >
    <GlobalStyle />
      <Card>
        <CloseIcon src="react/images/valid-close.svg" onClick={() => setShowPayment(false)} />
        <NeedPayment>
          Need to Make a Payment?
        </NeedPayment>
        <PlanEnrolled>
          If you’ve recently enrolled in <b>Leaf & Leaf Premier Plans, Essential Plans,
            or Child Health Plus—and have a premium obligation</b>, make your first premium payment to start your coverage.
        </PlanEnrolled>
        <Section onClick = {() => {window.location.href =  customerInfo.paymentsUrl }}>
          <PaymentImage src="react/images/icn-payment.svg" />
          <MakePremiumPayment>
            Make Premium Payment
          </MakePremiumPayment></Section>

      </Card>
    </FeatureTreatment>
  );
};

export default MakePayment;

const Card = styled.div`
  width:100%;
  margin-bottom: 40px;
  padding: 16px 15px 16px 16px;
  border-radius: 4px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.23);
  background-color: #008bbf;
  word-break: break-word;
`;

const NeedPayment = styled.div`
  font-size: 20px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: normal;
  color: #ffffff;
`;

const PlanEnrolled = styled.div`
  margin: 4px 0 12px;
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
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
  &:hover{
    color:#2A6A9E;
    text-decoration:underline;
    cursor:pointer;
  }
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