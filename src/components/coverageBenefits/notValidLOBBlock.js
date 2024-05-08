import React from "react";
import styled from "styled-components";
import { SHOW_FORMS_AND_DOCS } from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";
import { useSelector } from "react-redux";
import { MainHeader } from "./styles";
import DependentBlock from "./dependentBlock";

const NotValidLOBBlock = ({ memberSelection, setMemberSelection }) => {
  const customerInfo = useSelector((state) => state.customerInfo);
  const splitAttributes = {
    lob: customerInfo.data.sessLobCode,
    companyCode: customerInfo.data.companyCode,
    benefitPackage: customerInfo.data.benefitPackage,
    membershipStatus: customerInfo.data.membershipStatus,
    accountStatus: customerInfo.data.accountStatus,
  };

  return (
    <Wrapper>
      <MainHeader noTopMargin>Coverage & Benefits</MainHeader>
      <DependentBlock
        memberSelection={memberSelection}
        setMemberSelection={setMemberSelection}
      />
      <MainCard>
        <InnerCard>
          <CardHeader>
            <CardTitle>
              <Icon alt="" src="/react/images/icn-benefits.svg" />
              <BlueHeader>Benefits</BlueHeader>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <BodyText>
              A detailed overview of all your coverage and benefits.
            </BodyText>
            <FeatureTreatment
              treatmentName={SHOW_FORMS_AND_DOCS}
              onLoad={() => {}}
              onTimedout={() => {}}
              attributes={splitAttributes}
            >
              <DownloadBtn href="#">
                <BtnIcon right src="/react/images/icn-download-blue.svg" />
                <BtnText>Download Summary of Benefits</BtnText>
              </DownloadBtn>
            </FeatureTreatment>
          </CardBody>
        </InnerCard>
      </MainCard>
    </Wrapper>
  );
};

const MainCard = styled.div`
  padding: 10px 0px;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  background-color: #ffffff;
  margin: 23px 15px 0 0;
  @media only screen and (max-width: 1024px) {
    margin: 30px 0 0 0;
    width: 100%;
  }
`;

const InnerCard = styled.div`
  padding: 20px;
  overflow-wrap: break-word;
`;

const BlueHeader = styled.div`
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #003863;
  margin: ${(props) =>
    props.margin ? `24px 0px 0px 10px` : `0px 0px 0px 10px`};
`;

const Icon = styled.img`
  margin-top: ${(props) => (props.margin ? `24px` : ``)};
  margin-right: ${(props) => (props.right ? `10px` : ``)};
`;

const BtnIcon = styled.img`
  width: 12px;
  height: 12px;
  margin-right: ${(props) => (props.right ? `7px` : ``)};
  align-self: center;
`;

const BtnText = styled.span`
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #008bbf;

  @media only screen and (max-width: 480px) {
    width: 75%;
  }
`;

const CardHeader = styled.div``;

const CardTitle = styled.div`
  display: flex;
`;

const BodyText = styled.p`
  margin: 4px 0 16px 6px;
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
`;

const CardBody = styled.div`
  margin-left: 30px;
`;

const DownloadBtn = styled.a`
  display: flex;
  margin-left: 5px;
  margin-top: 20px;
  cursor: pointer;

  &:hover {
    text-decoration: none;
  }
`;

const Wrapper = styled.div`
  margin-bottom: 50px;
`;

export default NotValidLOBBlock;
