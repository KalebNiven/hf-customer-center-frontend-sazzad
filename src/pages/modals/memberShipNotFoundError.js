import React, { useEffect } from "react";
import styled from "styled-components";
import {
  ModalWrapper,
  ModalInnerWrapper,
  ModalContent,
  Text,
  CloseIcon,
  Button,
  ButtonWrapper,
} from "../../styles/commonStyles";
import missingMemberShipImg from "../../images/missing-membership.png";
import { useLogout } from "../../hooks/useLogout";
import { useHistory } from "react-router-dom";

const MembershipNotfoundError = () => {
  const { MIX_REACT_REG_CONTACT_LINK } = process.env;
  const history = useHistory();
  const logout = useLogout();
  const handleLogoutClick = () => logout();
  const handleContactInfo = () => window.location.href= MIX_REACT_REG_CONTACT_LINK;
  return (
    <FormModalWrapper>
        <ModalInnerWrapperCustom>  
      <WarningImg src={missingMemberShipImg} />
      <Header>Membership Not Found</Header>
      <SubHeader>
        We were unable to identify your membership. If you think this is a
        mistake, please <a href={MIX_REACT_REG_CONTACT_LINK}>contact</a> Member
        Services.
      </SubHeader>
      <FormButtonWrapper>
        <FormButton green={false} onClick={handleLogoutClick}>Logout</FormButton>
        <FormButton green={true} onClick={handleContactInfo}>Contact Us</FormButton>
      </FormButtonWrapper>
      </ModalInnerWrapperCustom>  
    </FormModalWrapper>
  );
};


export default MembershipNotfoundError;

const FormModalWrapper = styled(ModalWrapper)`
    transition: opacity 300ms ease-in-out;
    background: rgba(0, 42, 74, 0.72);

`
const ModalInnerWrapperCustom = styled(ModalInnerWrapper)`
background: white;
max-width: 480px;
height: 324px;
overflow: hidden;
border-radius: 4px;

@media only screen  and (max-width: 480px) {
    width: 344px;
    height: 380px;
}

`;

const FormModalContent = styled(ModalContent)`
  transition: opacity 300ms ease-in-out;
`;
const WarningImg = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
`;
const Header = styled.h1`
  margin: 16px 24px 12px;
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: normal;
  text-align: center;
  color: #003863;
`;
const SubHeader = styled.h3`
  margin: 12px 24px 16px;
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: #474b55;
`;
const FormButtonWrapper = styled(ButtonWrapper)`
  margin-top: 2rem;
  margin-bottom: 0rem;
  text-align: center;
`;
const FormButton = styled(Button)`
  float: none !important;
`;
