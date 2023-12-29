import React from "react";
import styled from "styled-components";
import { MyDocuments, SubTitle } from "./style";

const FormsAndDocumentsModel = ({onBack}) => {
  return (
    <Container>
      <Wrapper>
        <ButtonText onClick={() => onBack(false)}>Back</ButtonText>
      </Wrapper>
      <MyDocuments>Forms and Documents</MyDocuments>
      <SubTitle>Commonly Used Forms</SubTitle>
      <FormsWrapper>
        <DownloadImg src="/react/images/documents-pdf-icon.svg" />
        <DocumentType>
          Authorization to Release Protected Health Information (PHI)
        </DocumentType>
        <Text>
          Complete this form if you want to give someone (such as a family
          member, caregiver, or another company) access to your health or
          coverage information.
        </Text>
        <DownloadImg src="/react/images/download_pdf.svg" />
      </FormsWrapper>
      <SubTitle>General Forms</SubTitle>
      <FormsWrapper>
        <GeneralFormWrapper>
          <img src="/react/images/documents-pdf-icon.svg"></img>
          <GeneralFormText>
            Authorization to release protected health information (without
            substance abuse information)
          </GeneralFormText>
        </GeneralFormWrapper>
        <DownloadImg src="/react/images/download_pdf.svg" />
      </FormsWrapper>
    </Container>
  );
};

export default FormsAndDocumentsModel;

const Container = styled.div``;

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
`;

const Wrapper = styled.div`
  width: fit-content;
  display: flex;
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
  color: var(--Colors-Primary-Cerulean-500, #008bbf);
  font-family: "museo-sans", san-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px; /* 114.286% */
`;

const FormsWrapper = styled.div`
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
