import React,{useState} from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import FormsAndDocumentsModel from "./formsAndDocument";

const DocumentType = () => {
  const history = useHistory();
  const [enableFormsAndDocument, setEnableFormsAndDocument] = useState(false);

  return (
    <Container>
      {enableFormsAndDocument ? (
        <>
        <FormsAndDocumentsModel onBack={(data) => setEnableFormsAndDocument(data)}/>
        </>
      ) : (
        <>
          <Wrapper onClick={() => setEnableFormsAndDocument(true)}>
            <Icon src="/react/images/plan_document_img.svg" />
            <Text>Forms and Plan Documents</Text>
            <Icon src="/react/images/right_arrow.png"></Icon>
          </Wrapper>
          <Wrapper onClick={() => history.push("/document-center")}>
            <Icon src="/react/images/plan_document_img.svg" />
            <Text>Plan Communications</Text>
            <Icon src="/react/images/right_arrow.png"></Icon>
          </Wrapper>
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
  width: 224px;
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
