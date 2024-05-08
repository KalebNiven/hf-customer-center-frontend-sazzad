import React, { useEffect } from "react";
import styled from "styled-components";
import { Header, MemberCardsContainer, MemberCard } from "../styles";

const FormSuccessCard = ({ message, delayedCallback }) => {
  useEffect(() => {
    if (delayedCallback)
      setTimeout(() => {
        delayedCallback();
      }, 3000);
  }, []);

  return (
    <MemberCardsContainer>
      <MemberCard>
        <Image src="/react/images/icons-solid-checkmark-circle.svg"></Image>
        <Text>{message}</Text>
      </MemberCard>
    </MemberCardsContainer>
  );
};

export default FormSuccessCard;

const Image = styled.img`
  width: 83.33px;
  height: 83.33px;
  margin: 152.33px 118.33px 40.33px 103.33px;
`;

const Text = styled(Header)`
  margin-bottom: 226px;
`;
