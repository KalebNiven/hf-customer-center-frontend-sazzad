import React, { useState, useEffect, componentDidMount } from "react";
import styled from 'styled-components'
import { ModalWrapper, ModalInnerWrapper, ModalContent, Text, CloseIcon,
    Button, ButtonWrapper } from "../../styles/commonStyles";

const SuccessModalV2 = (props) => {

    const { closeButtonClick, modalHeaderText } = props;

    const handleClose = (data) => {
      closeButtonClick();
    }

    return (
        <div>
            <br />
            <br />
            <br />
            <br />
            <SuccessImg src = "react/images/icons-solid-checkmark-circle.svg" />
            <Header>
              {modalHeaderText}
            </Header>
            <br />
            <br />
            <br />
            <FormButtonWrapper>
                <FormButton green={true} onClick={handleClose}>
                    Continue
                </FormButton>
            </FormButtonWrapper>
        </div>
    );
};

export default SuccessModalV2

const FormModalWrapper = styled(ModalWrapper)`
    transition: opacity 300ms ease-in-out;
    opacity: ${props => props.visible ? "1" : "0" };
`

const FormModalContent = styled(ModalContent)`
    transition: opacity 300ms ease-in-out;
`
const SuccessImg = styled.img`
    display: block;
    margin-top: 2rem;
    margin-left: auto;
    margin-right: auto;
`
const Header = styled.h1`
    margin: 16px 0px 12px;
    font-size: 18px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: center;
    color: #003863;
    @media only screen and (max-width: 768px) {
        margin: 16px 0px 12px;
    }
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
    @media only screen and (max-width: 768px) {
        margin: 16px 0px 12px;
    }
`
const FormButtonWrapper = styled(ButtonWrapper)`
  margin-top: 2rem; 
  margin-bottom: 0rem;
  text-align: center;
`;
const FormButton = styled(Button)`
  float: none!important;
  margin-left: 0;
  width: 90%;
`;