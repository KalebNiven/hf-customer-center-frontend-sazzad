import React from "react";
import { MainCard, DocName } from "../styles";
import styled from "styled-components";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const FormsAndDocumentBlock = () => {
  const history = useHistory();
  return (
    <MainCard>
      <DocCard>
        <DocName documents>Looking for Forms & Documents?</DocName>
        <DocContext>We’ve moved Forms & Documents to another page. </DocContext>
        <Wrapper
          onClick={() =>
            history.push("/forms-and-documents")
          }
        >
          <Img src="/react/images/document_img.svg"></Img>
          <Text>View Form and Documents</Text>
        </Wrapper>
      </DocCard>
    </MainCard>
  );
};

export default FormsAndDocumentBlock;

const DocCard = styled.div`
  padding: 14px;
  margin-left: 18px;
`;

const DocContext = styled.div`
  color: var(--Colors-Primary-Slate-500, #474b55);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  margin-top: 5px;
`;

const Wrapper = styled.div`
  display: flex;
  margin-top: 24px;
  cursor: pointer;
`;

const Text = styled.div`
  margin-left: 3px;
  color: var(--Colors-Primary-Cerulean-500, #008bbf);
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px; /* 114.286% */
`;

const Img = styled.img``;
