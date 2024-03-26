import React, {useEffect} from "react";
import styled from "styled-components";
import {
    Header,
    MemberCardsContainer,
    MemberCard,
} from "../styles";
import { Button, ButtonWrapper } from "../../../styles/commonStyles";

const FormSuccessMedicaidCard = ({handleCloseCallback}) =>{

    const handleDoneBtn = () => {
        handleCloseCallback();
    }

    return (
        <MemberCardsContainer>
            <MemberCard>
            <Image src="/react/images/clock.svg" color="green"></Image>
                <Text>Your membership has been attached, but we still need to verify your account.</Text>
                <SubText>Thank you for attaching your membership. You will be contacted within 72 hours to verify and activate your account before you can log in.</SubText>
                <FormButtonWrapper>
                <FormButton green={false} onClick={handleDoneBtn}>
                    Done
                </FormButton>
            </FormButtonWrapper>
            </MemberCard>
        </MemberCardsContainer>

    );
}

export default FormSuccessMedicaidCard;

const Image = styled.img`
height:100.33px;
margin: 60px 118.33px 30px 95.33px
`;

const Text = styled(Header)`

`;

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
  float: none!important;
  margin-left: 0;
  width: 100%;
  font-weight: 500;
  margin-bottom: .2rem;
  cursor: pointer;
`;