import React, { useEffect } from "react";
import styled from "styled-components";
import { Header, MemberCardsContainer, MemberCard } from "../styles";
import { Button, ButtonWrapper } from "../../../styles/commonStyles";
import { useLogout } from "../../../hooks/useLogout";

const FormSuccessMedicareCard = ({ handleCloseCallback }) => {
  const logoutApi = useLogout();

  const handleDoneBtn = () => {
    // handleCloseCallback();
    logoutApi();
    setTimeout(() => {
      history.push("/login");
    }, 3000);
  };

  useEffect(() => {
    setTimeout(() => {
      logoutApi();
    }, 5000);
  }, []);

  return (
    <MemberCardsContainer>
      <MemberCard>
        <Image src="/react/images/clock.svg" color="green"></Image>
        <Text>
          Your membership has been attached, but we still need to verify your
          account.
        </Text>
        <SubText>
          Your username and password have been created, but you still need to
          verify your account before you can log in. Call Member Services or we
          can contact you within 72 hours to activate your account
        </SubText>
        <FormButtonWrapper>
          <FormButton green={false} onClick={handleDoneBtn}>
            Done
          </FormButton>
        </FormButtonWrapper>
      </MemberCard>
    </MemberCardsContainer>
  );
};

export default FormSuccessMedicareCard;

const Image = styled.img`
  height: 100.33px;
  margin: 60px 118.33px 30px 95.33px;
`;

const Text = styled(Header)``;

const SubText = styled(Header)`
  font-weight: 100;
  margin-bottom: 4rem;
`;

const FormButtonWrapper = styled(ButtonWrapper)`
  margin-top: 2rem;
  margin-bottom: 0rem;
  text-align: center;
`;
const FormButton = styled(Button)`
  float: none !important;
  margin-left: 0;
  width: 100%;
  font-weight: 500;
  margin-bottom: 0.2rem;
  cursor: pointer;
`;
