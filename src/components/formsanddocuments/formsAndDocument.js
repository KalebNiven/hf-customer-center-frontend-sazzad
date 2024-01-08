import React, { useEffect } from "react";
import styled from "styled-components";
import { MyDocuments, SubTitle } from "./style";
import { useDispatch, useSelector } from "react-redux";
import { requestCCFormsDocs } from "../../store/actions";

const FormsAndDocumentsModel = ({ onBack }) => {
  const dispatch = useDispatch();
  const ccForms = useSelector((state) => state.ccFormsDoc);
  const customerInfo = useSelector((state) => state.customerInfo);

  // useEffect(() => {
  //   const data = {
  //     memberId: customerInfo.data.memberId,
  //     benefitPackage: customerInfo.data.benefitPackage,
  //     companyCode: customerInfo.data.companyCode,
  //     lob: customerInfo.data.sessLobCode,
  //     groupNumber: customerInfo.data.groupNumber,
  //     year: 2024
  //   };
  //   dispatch(requestCCFormsDocs(data));
  // }, []);

  return (
    <Container>
      {ccForms?.ccFormsDocDetails?.data != null ? (
        <>
          <Wrapper>
            <ButtonWrapper>
              <ButtonImg src="/react/images/back_arrow.svg" />
              <ButtonText onClick={() => onBack(false)}>Back</ButtonText>
            </ButtonWrapper>
          </Wrapper>
          <MyDocuments>Forms and Documents</MyDocuments>
          <SubTitle>Commonly Used Forms</SubTitle>
          {ccForms?.ccFormsDocDetails?.data[0].cc_commonly_used_forms.map(
            (item) => (
              <FormsWrapper>
                <CommonImg src="/react/images/documents-pdf-icon.svg" />
                <DocumentType>{item.Name}</DocumentType>
                <Text>
                  Complete this form if you want to give someone (such as a
                  family member, caregiver, or another company) access to your
                  health or coverage information.
                </Text>
                <DownloadImg src="/react/images/download_pdf.svg" />
              </FormsWrapper>
            )
          )}

          <SubTitle>General Forms</SubTitle>
          {ccForms?.ccFormsDocDetails?.data[0].cc_general_forms.map(
            (item) => (
           <DocsList data={item} />
          )
          )}
          <SubTitle>Plan Documents</SubTitle>
          {ccForms?.ccFormsDocDetails?.data[0].cc_plan_documents.map(
            (item) => (
           <DocsList data={item} />
          )
          )}
          <SubTitle>Additional Resources</SubTitle>
          {ccForms?.ccFormsDocDetails?.data[0].cc_additional_resources.map(
            (item) => (
           <DocsList data={item} />
          )
          )}
        </>
      ) : null}
    </Container>
  );
};

const DocsList = (props) => {
  return (
    <FormsWrapper>
      <GeneralFormWrapper>
        <FormImg src="/react/images/documents-pdf-icon.svg"></FormImg>
        <GeneralFormText>
          {props.data.Name}
        </GeneralFormText>
      </GeneralFormWrapper>
      <DownloadImg src="/react/images/download_pdf.svg" />
    </FormsWrapper>
  );
};

export default FormsAndDocumentsModel;

const Container = styled.div``;

const ButtonImg = styled.img``;

const FormImg = styled.img`
  margin-top: -41px;
`;

const GeneralFormText = styled.div`
  margin-left: 10px;
  color: var(--Colors-Primary-Slate-500, #474b55);
  font-feature-settings: "clig" off, "liga" off;
  font-family: "museo-sans", san-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 150% */
  text-transform: capitalize;
`;

const GeneralFormWrapper = styled.div`
  display: flex;
`;

const DownloadImg = styled.img`
  margin-top: 5px;
  margin-left: -16px;
`;

const CommonImg = styled.img`
  margin-top: 5px;
`;

const ButtonWrapper = styled.div`
  display: flex;
`;
const Wrapper = styled.div`
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

const FormsWrapper = styled.div`
  margin-bottom: 3rem;
  padding: 16px;
  background: var(--Colors-Neutrals-White, #fff);

  /* lvl-1 */
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
`;

const DocumentType = styled.div`
  margin-top: 5px;
  color: var(--Colors-Primary-Blue-500, #003863);
  font-feature-settings: "clig" off, "liga" off;

  /* Web/H3/h3.bold */
  font-family: "museo-sans", san-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 150% */
`;

const Text = styled.div`
  margin-top: 5px;
  color: #474b55;
  font-family: "museo-sans", san-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
`;
