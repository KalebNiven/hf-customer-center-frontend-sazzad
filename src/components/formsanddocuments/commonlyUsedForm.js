import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Language } from "../common/styles";
import useOnClickOutside from "../documents/useOnClickOutside";

const CommonlyUsedForm = (props) => {
  const ref = useRef();

  const [rowID, setRowId] = useState();
  useOnClickOutside(ref, (event) => {
    //if(event.toElement.contains())
    if (event.target.contains(ref.current)) {
      setRowId();
    }
  });
  return (
    <>
      {props.data.map((item) => (
        <Container>
          <DocImage src="/react/images/documents-pdf-icon.svg" />
          <Title>{item.Name}</Title>
          <Content>
            Complete this form if you want to give someone (such as a family
            member, caregiver, or another company) access to your health or
            coverage information.
          </Content>
          <Image
            onClick={() => setRowId(item.id)}
            src="/react/images/download_pdf.svg"
          />
          <Wrapper isOpen={item.id === rowID} last={false}>
            <Language
              onClick={() => {
                window.open(item.assetUrl.en);
              }}
            >
              English
            </Language>

            <Language onClick={() => window.open(item.assetUrl.es)}>
              Spanish
            </Language>

            <Language ref={ref} onClick={() => window.open(item.assetUrl.zh)}>
              Chinese
            </Language>
          </Wrapper>
        </Container>
      ))}
    </>
  );
};

export default CommonlyUsedForm;

const DocImage = styled.img``;

const Wrapper = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  border-radius: 4px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.23);
  background-color: #ffffff;
  list-style-type: none;
  padding: 4px 0;
  z-index: 1;
  width: 132px;
  bottom: ${(props) => (props.last ? "100%" : "")};
`;

const Container = styled.div`
  margin-right: 3rem;
  max-width: 54%;
  padding: 24px;
  border-radius: 6px;
  background: var(--Colors-Neutrals-White, #fff);

  /* lvl-1 */
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
`;

const Image = styled.img`
  margin-left: -1.3rem;
  cursor: pointer;
`;

const Title = styled.div`
  height: 3rem;
  font-weight: 600;
  font-size: 16px;
  line-height: 21px;
  color: #003863;
  margin-bottom: 20px;
  margin-top: 5px;
  padding: 0;
  font-style: normal;
`;
const Content = styled.div`
  color: #474b55;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
`;
