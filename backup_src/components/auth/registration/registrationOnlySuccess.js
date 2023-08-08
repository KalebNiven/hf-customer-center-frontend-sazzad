import React, { useState ,useEffect} from "react";
import styled from "styled-components";
import {
    MemberCardsContainer,
    MemberCard,
} from "../styles";

const RegistrationOnlySuccess = () =>{

    return (
        <MemberCardsContainer>
            <Card>
            <Image src="/react/images/icons-solid-checkmark-circle.svg"></Image>
                <Header>Your username and password have been created!</Header>
                <Text>Please close this page to continue.</Text>
            </Card>
        </MemberCardsContainer>

    );
}

export default RegistrationOnlySuccess;

const Image = styled.img`
width:83.33px;
height:83.33px;
margin: 152.33px 118.33px 40.33px 103.33px
`;

const Card = styled(MemberCard)`
margin-top: -40px;
`;

const Text = styled.div`
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #474B55;
    margin-bottom:162px;
`;

 const Header = styled.div`
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    text-align: center;
    color: #003f6b;
    margin-bottom: 12px;
`;