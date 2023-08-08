import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const SurveySuccess = () => {
    return (
        <Wrapper>
            <CheckmarkIcon alt = "" src="/react/images/icons-solid-checkmark-circle.svg" />
            <Heading>Annual Health Assessment Completed!</Heading>
            <Content>Based on your responses to the survey, we've provided links below to help you with your health goals. If you have any questions, please call the Member Services phone number on your Member ID card.</Content>
            <Button href="/my-health">Continue</Button>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding-top: 28px;
    padding-bottom: 20px;
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

export default SurveySuccess
