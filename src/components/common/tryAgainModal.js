import React, { useState, useEffect, componentDidMount } from "react";
import styled from 'styled-components'
import { ModalWrapper, ModalInnerWrapper, ModalContent, Text, CloseIcon,
    Button, ButtonWrapper } from "../../styles/commonStyles";

const TryAgainModal = (props) => {

    const { tryAgainButtonClick, backButtonClick } = props;

    const handleTryAgain = (data) => {
        tryAgainButtonClick();
    }

    const handleBack = (data) => {
        backButtonClick();
    }

    return (
        <div>
            <WarningImg src = "img/ico-alert.svg" />
            <Header>
                Something went wrong.
            </Header>
            <SubHeader>
            We were unable to process this request. Please try again.
            </SubHeader>
            <FormButtonWrapper>
                <FormButton green={false} onClick={handleBack}>
                    Back
                </FormButton>
                <FormButton green={true} onClick={handleTryAgain}>
                    Try Again
                </FormButton>
            </FormButtonWrapper>
        </div>
    );
};

export default TryAgainModal

const FormModalWrapper = styled(ModalWrapper)`
    transition: opacity 300ms ease-in-out;
    opacity: ${props => props.visible ? "1" : "0" };
`

const FormModalContent = styled(ModalContent)`
    transition: opacity 300ms ease-in-out;
`
const WarningImg = styled.img`
    display: block;
    margin-top: 2rem;
    margin-left: auto;
    margin-right: auto;
`
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
`
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
`
const FormButtonWrapper = styled(ButtonWrapper)`
  margin-top: 2rem; 
  margin-bottom: 0rem;
  text-align: center;
`;
const FormButton = styled(Button)`
  float: none!important;
`;