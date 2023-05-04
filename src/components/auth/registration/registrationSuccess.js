import React, { useState ,useEffect} from "react";
import styled from "styled-components";
import {
    Header,
    MemberCardsContainer,
    MemberCard,
} from "../styles";

const RegistrationSuccess = () =>{

    useEffect(() => {
        setTimeout(() => window.location.href = "/login", 3000);
    }, []);


    return (
        <MemberCardsContainer>
            <MemberCard>
            <Image src="/react/images/icons-solid-checkmark-circle.svg"></Image>
                <Text>Your username and password have been created!</Text>
            </MemberCard>
        </MemberCardsContainer>

    );
}

export default RegistrationSuccess;

const Image = styled.img`
width:83.33px;
height:83.33px;
margin: 152.33px 118.33px 40.33px 103.33px
`;

const Text = styled(Header)`
margin-bottom:226px;
`;