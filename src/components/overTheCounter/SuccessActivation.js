import React from 'react'
import styled from 'styled-components';

const SuccessActivation = () => {
    return (
        <Wrapper>
            <Card>
                <CheckmarkIcon alt = "" src="/react/images/icons-solid-checkmark-circle.svg" />
                <Heading>Your Card Has Been Activated Successfully</Heading>
                <Content>You will now be able to access your balance.</Content>
                <Button href="/">Back to Home</Button>
            </Card>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    /* margin-top: 144px; */
`;

const Card = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding-top: 28px;
    padding-bottom: 20px;
    background: #fff;
    width: 360px;
    border-radius: 4px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
    padding: 40px 24px 24px 24px;

    @media only screen and (max-width: 767px) {
        width: 100%;
    }
`

const Heading = styled.h2`
    margin: 24px 0 8px 0;
    font-size: 18px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: center;
    color: #003863;
`

const Content = styled.p`
    margin: 8px 0 24px;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: normal;
    text-align: center;
    color: #474b55;
`

const Button = styled.a`
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background-color: #3e7128;
    font-size: 18px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: -0.08px;
    text-align: center;
    cursor: pointer;
    flex-basis: 30%;
    align-self: center;
    color: #ffffff;

    &:hover {
        color: #ffffff;
        text-decoration: none;
    }
`

const CheckmarkIcon = styled.img`
    height: 100px;
    width: 100px;
    align-self: center;
`

export default SuccessActivation