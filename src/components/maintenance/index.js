import React from "react";
import { Container } from "react-bootstrap";
import { useHistory } from "react-router-dom"
import styled from "styled-components";
import { FooterMenuWrapper, LanguageSelectionWrapper, Logo, LogoWrapper, Wrapper } from "../auth/login"
import FooterMenu from "../auth/login/footerMenu";
import LanguageSelection from "../auth/login/languageSelection"

const Maintenance = () => {
    const {history} = useHistory();
    const handleHealthFirstLogoClick = () =>{
        history.push('/login')
    }
    return(
        <Wrapper>
            <LanguageSelectionWrapper>
                <LanguageSelection />
            </LanguageSelectionWrapper>
            <Container>
                <LogoWrapper>
                    <Logo onClick={handleHealthFirstLogoClick} src="/react/images/logo-white.svg" />
                </LogoWrapper>
                <Content>
                    <UnionIcon src = "/react/images/icn-union.svg"></UnionIcon>
                    <ContentHeader>Down for Maintenance</ContentHeader>
                    <ContentMessage>Our site is currently under system maintenance. Please try back later to sign into your Healthfirst Member Portal account.</ContentMessage>
                </Content>
                <FooterMenuWrapper>
                    <FooterMenu />
                </FooterMenuWrapper>
            </Container>
        </Wrapper>
    )
}

const Content = styled.div`
    background: #FFFFFF;
    filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.23));
    border-radius: 8px;
    padding: 0px 16px 16px 16px;
    margin: 120px auto 0 auto;
    max-width: 480px;
    display: flex;
    // justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    padding: 0 24px 24px 24px;
    margin-bottom: 200px;
    @media only screen  and (max-width: 820px) {
        margin-bottom: 418px;
    }
    @media only screen  and (max-width: 480px) {
        margin-bottom: 36px;
        margin-top: 100px;
        padding-bottom: 96px;
    }
`
const UnionIcon = styled.img`
    height: 67px;
    width: 67px;
    margin: 30px 0 23px 0;
`;
const ContentHeader = styled.div`
    font-weight: 600;
    font-size: 24px;
    color: #003863;
    margin-bottom: 8px;
`;

const ContentMessage = styled.div`
    color: #474B55;
    font-size: 16px;
    line-height: 24px;
`;
export default Maintenance;