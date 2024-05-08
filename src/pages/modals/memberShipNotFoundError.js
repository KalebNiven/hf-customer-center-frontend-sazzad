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
  const handleContactInfo = () =>
    (window.location.href = MIX_REACT_REG_CONTACT_LINK);
  return (
    <FormModalWrapper>
      <ModalInnerWrapperCustom>
        <WarningImg src={missingMemberShipImg} />
        <Header>Membership Not Found</Header>
        <SubHeader>
          We were unable to identify your membership. If you think this is a
          mistake, please <a href={MIX_REACT_REG_CONTACT_LINK}>contact</a>{" "}
          Member Services.
        </SubHeader>
        <FormButtonWrapper>
          <StyledButton outlined={true} onClick={handleLogoutClick}>
            Log Out
          </StyledButton>
          <StyledButton onClick={handleContactInfo}>Contact Us</StyledButton>
        </FormButtonWrapper>
      </ModalInnerWrapperCustom>
    </FormModalWrapper>
  );
};

export default MembershipNotfoundError;

const StyledButton = styled.button`
  height: 40px;
  width: 126px;
  margin: 17px 12px 24px 0px;
  //padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #3e7128;
  background: ${(props) => (props.outlined ? "#fff" : "#3e7128")};
  color: ${(props) => (props.outlined ? "#3e7128" : "#fff")};
  text-transform: capitalize;
  cursor: pointer;
  font-weight: 400;
  font-size: 18px;

  @media only screen and (max-width: 480px) {
    width: 312px;
    height: 40px;
    margin: auto;
    margin-top: 10px;
  }

  &:hover {
    background-color: ${(props) =>
      props.outlined ? "rgba(62, 113, 40, 0.05)" : "#517f3d"};
  }
`;

export const LogoutButton = styled.div`
  width: 81px;
  height: 16px;
  cursor: pointer;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  fontfamily: "museo-sans";
  margin: 40px 24px 36px 0px;
  color: #008bbf;
  background-color: #ffffff;
  border: solid 1px #3e7128;

  @media only screen and (max-width: 480px) {
    width: 81px;
    height: 16px;
    margin: auto;
    margin-top: 26px;
    margin-bottom: 30px;
  }
`;

const FormModalWrapper = styled(ModalWrapper)`
  transition: opacity 300ms ease-in-out;
  background: #f4f4f4;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
`;
const ModalInnerWrapperCustom = styled(ModalInnerWrapper)`
  background: white;
  max-width: 480px;
  height: 324px;
  overflow: hidden;
  border-radius: 4px;

  @media only screen and (max-width: 480px) {
    width: 344px;
    height: 426px;
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
  font-size: 24px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: normal;
  text-align: center;
  color: #003863;
`;
const SubHeader = styled.h3`
  margin: 12px 24px 16px;
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 18px;
  letter-spacing: normal;
  text-align: center;
  color: #474b55;
`;
const FormButton = styled(Button)`
  float: none !important;
`;
const FormButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  @media only screen and (max-width: 480px) {
    flex-direction: column-reverse;
    justify-content: center;
  }
`;
