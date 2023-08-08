import styled from "styled-components";
import React, { useEffect, useState } from "react";
import GlobalStyle from "../../styles/GlobalStyle";
import { useSelector } from "react-redux";
import { useHomeContext } from './homeContext';
import { useHistory } from "react-router-dom";
import { useClient } from "@splitsoftware/splitio-react";
import { PAYMENTS_ACL } from "../../constants/splits";

const HelpfulTips = () => {

  const history = useHistory();
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const splitHookClient = useClient(customerInfo?.customerId);
  const { showhelpfulTips, setShowHelpfulTips } = useHomeContext();
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);

  const splitAttributes = {
    memberId: customerInfo?.memberId,
    lob: customerInfo?.sessLobCode,
    membershipStatus: customerInfo?.membershipStatus,
    benefitPackage: customerInfo?.benefitPackage,
    accountStatus: customerInfo?.accountStatus,
    companyCode: customerInfo?.companyCode
  };

  useEffect(() => {
    if(!splitHookClient) return;
      const paymentsEnabledTreatment = splitHookClient.getTreatmentWithConfig(PAYMENTS_ACL, splitAttributes)
      if(paymentsEnabledTreatment.treatment === "on"){
        setPaymentsEnabled(true);
      }
  }, [splitHookClient])

  return (
    (showhelpfulTips && paymentsEnabled
        // customerInfo.accessMatrix.payments
        ) &&
    <><GlobalStyle />
      <Card>
        <CloseIcon alt = "" src="/react/images/valid-close.svg" onClick={() => setShowHelpfulTips(false)} />
        <HelpFullTips>
          Helpful Tips
        </HelpFullTips>
        <HelpFullTipsDesc>
          Never miss your monthly payments by setting up AutoPay
        </HelpFullTipsDesc>
          <MakeAutomaticPayment onClick = {() => {history.push('/payments')}}>
            Set Up Automatic Payments
          </MakeAutomaticPayment>

      </Card>
    </>
  );
};

export default HelpfulTips;

const Card = styled.div`
  margin-bottom: 40px;
  padding: 16px 15px 16px 16px;
  border-radius: 4px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.23);
  background-color: #003863;
  word-break: break-word;
  @media only screen and (max-width: 480px) {
    // margin-right: 0px;
    padding-left: 5px;
    padding-bottom: 20px;
  }
`;

const HelpFullTips = styled.div`
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: normal;
  color: #ffffff;
  text-align: left;
`;

const HelpFullTipsDesc = styled.div`
  margin: 4px 0 12px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.57;
  letter-spacing: normal;
  color: #ffffff;
  text-align: left;
`;

const MakeAutomaticPayment = styled.div`
  margin: 4px 0 4px 0px;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.57;
  letter-spacing: normal;
  color: #ffffff;
  text-align: left;
  text-decoration:underline;
  cursor:pointer;
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
