import React from "react";
import styled from "styled-components";

const CommonlyUsedForm = () => {
  return (
    <Container>
      <Title>Authorization to Release Protected Health Information (PHI)</Title>
      <Content>
        Complete this form if you want to give someone (such as a family member,
        caregiver, or another company) access to your health or coverage
        information.
      </Content>
      <Image src="/react/images/download_pdf.svg" />
    </Container>
  );
};

export default CommonlyUsedForm;

const Container = styled.div`
  max-width: 54%;
  padding: 24px;
  border-radius: 6px;
  background: var(--Colors-Neutrals-White, #fff);

  /* lvl-1 */
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
`;

const Image = styled.img`
  margin-left: -1.3rem;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #003863;
  margin-bottom: 20px;
  margin-top: 40px;
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
