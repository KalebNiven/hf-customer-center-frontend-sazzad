import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LanguageSelection from "./components/auth/login/languageSelection";
import FooterMenu from "./components/auth/login/footerMenu";
import styled, { keyframes } from "styled-components";
import PreferredContactInfo from "./preferredContactInfo";
import { requestPreferenceCenterInfo } from "./store/actions";

const PreferredContactInfoPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const preferenceCenterInfo = useSelector(
    (state) => state.preferenceCenterInfo
  );
  const [step, setStep] = useState(null);

  // autofill username if exist
  useEffect(() => {
    dispatch(requestPreferenceCenterInfo());
  }, []);

  useEffect(() => {
    if (
      preferenceCenterInfo.loading == false &&
      preferenceCenterInfo.data !== null
    ) {
      if (preferenceCenterInfo.error !== "") {
        history.push("/home");
      }
      if (preferenceCenterInfo?.data?.email?.is_different) {
        setStep("Email");
      } else if (preferenceCenterInfo?.data?.phones?.is_different) {
        setStep("Phone");
      } else {
        history.push("/home");
      }
    }
  }, preferenceCenterInfo?.data);

  // Redirect to home if user already authenticated
  //if (authState?.isAuthenticated) history.push('/home')

  const handleHealthFirstLogoClick = () => {
    history.push("/login");
  };

  return (
    <Wrapper>
      <LanguageSelectionWrapper>
        <LanguageSelection />
      </LanguageSelectionWrapper>
      <Container>
        <LogoWrapper>
          <Logo
            onClick={handleHealthFirstLogoClick}
            src="/react/images/logo-white.svg"
          />
        </LogoWrapper>
        <PreferredContactInfoContainer>
          {!(null === step) ? <PreferredContactInfo type={step} /> : null}
        </PreferredContactInfoContainer>
        <Footer>
          <FooterMenuWrapper>
            <FooterMenu />
          </FooterMenuWrapper>
        </Footer>
      </Container>
    </Wrapper>
  );
};

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("/react/images/auth-background.png");
  background-position: center;
  background-repeat: repeat;
  background-size: contain;
`;

export const LanguageSelectionWrapper = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
`;

export const Logo = styled.img``;

export const PreferredContactInfoContainer = styled.div`
  margin-top: 42px;
`;

export const FooterMenuWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const Spinner = styled.div`
  text-align: center;
  margin: auto;
  border: 0.2em solid #e6e6e6;
  border-top: 0.2em solid #4b6f32;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation-name: ${keyframes`from {transform: rotate(0deg);} to {transform: rotate(360deg);}`};
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;

export default PreferredContactInfoPage;
