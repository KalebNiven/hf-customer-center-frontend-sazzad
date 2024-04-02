import React,{useState} from "react";
import styled from "styled-components";
import FormsAndDocumentsModel from "./formsAndDocument";
import { FeatureTreatment } from "../../libs/featureFlags";
import { SHOW_DOC,SHOW_FORMS_AND_DOCS} from "../../constants/splits";
import { useSelector } from "react-redux";
import { SubTitle } from "./style";
import DocumentCenter from "../../components/documents";

const DocumentType = () => {
  const [enableFormsAndDocument, setEnableFormsAndDocument] = useState(false);
  const [selectedTab, setSelectedTab] = useState('');
  const customerInfo = useSelector((state) => state.customerInfo);

  const splitAttributes = {
    memberId: customerInfo.data.memberId,
    customerId: customerInfo.data.customerId,
    lob: customerInfo?.data?.sessLobCode, 
    companyCode: customerInfo?.data?.hohPlans?.map(plan => plan.CompanyNumber),
    benefitPackage: customerInfo?.data?.hohPlans?.map(plan => plan.BenefitPackage),
    membershipStatus: customerInfo.data.membershipStatus,
    accountStatus: customerInfo.data.accountStatus,
  };

  const handleTabClick = (page) => {
    setEnableFormsAndDocument(true);
    setSelectedTab(page);
  };

  return (
    <Container>
      {enableFormsAndDocument ? (
        <>
          {selectedTab === 'FormsAndDocs' ? (
            <FormsAndDocumentsModel onBack={(data) => setEnableFormsAndDocument(data)}/>
          ) : (
            <>
              <BackButtonWrapper onClick={() => setEnableFormsAndDocument(false)}>
                <ButtonWrapper>
                  <ButtonImg src="/react/images/back_arrow.svg" />
                  <ButtonText>Back</ButtonText>
                </ButtonWrapper>
              </BackButtonWrapper>
              <DocumentCenter />
            </>
          )}
        </>
      ) : (
        <>
        <SubTitle>Select a Document Type</SubTitle>
        <FeatureTreatment
                  key="forms_and_document_page_feature"
                  treatmentNames={SHOW_FORMS_AND_DOCS}
                  treatmentName= {SHOW_FORMS_AND_DOCS}
                  onLoad={() => {}}
                  onTimedout={() => {}}
                  attributes={splitAttributes}
                >
          <Wrapper onClick={() => handleTabClick('FormsAndDocs')}>
            <Icon src="/react/images/plan_document_img.svg" />
            <Text>Forms and Plan Documents</Text>
            <Icon src="/react/images/right_arrow.png"></Icon>
          </Wrapper>
          </FeatureTreatment>
          <FeatureTreatment
                  key="forms_and_document_page_feature"
                  treatmentNames={[SHOW_DOC]}
                  treatmentName= {SHOW_DOC}
                  onLoad={() => {}}
                  onTimedout={() => {}}
                  attributes={splitAttributes}
                >
          <Wrapper onClick={() => handleTabClick('PlanCommunications')}>
            <Icon src="/react/images/plan_communications.svg" />
            <Text>Plan Communications</Text>
            <Icon src="/react/images/right_arrow.png"></Icon>
          </Wrapper>
          </FeatureTreatment>
        </>
      )}
    </Container>
  );
};

export default DocumentType;

const Container = styled.div``;

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const Text = styled.div`
  color: #474b55;
  width: 260px;
  font-feature-settings: "clig" off, "liga" off;
  font-family: "museo-sans", san-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 150% */
`;

const Wrapper = styled.div`
  display: flex;
  padding: 16px;
  cursor: pointer;
  align-items: center;
  gap: 12px;
  order-radius: 4px;
  background: #fff;
  margin-bottom: 5px;

  /* Shadow_1 */
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
`;

const ButtonImg = styled.img``;

const ButtonWrapper = styled.div`
  display: flex;
`;
const BackButtonWrapper = styled.div`
  cursor: pointer;
  width: fit-content;
  padding: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  background: var(--Colors-Neutrals-White, #fff);
  /* Shadow_1 */
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
`;

const ButtonText = styled.div`
  padding: 3px;
  color: var(--Colors-Primary-Cerulean-500, #008bbf);
  font-family: "museo-sans", san-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px; /* 114.286% */
`;