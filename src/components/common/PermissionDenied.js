import React from 'react';
import styled from "styled-components";
import { useHistory } from 'react-router-dom';

const PermissionDenied = () => {
    const history = useHistory();
    const goHome = () => history.push('/home');
    return(
        <Wrapper> 
            <Card>
                <LockIcon src="/react/images/icn-lock.svg"/>
                <Heading>Permission Denied</Heading>
                <Description>
                    Based on your current plan's benefits, you do not have access to this content.If you think this is a mistake, please, <Contact href="https://healthfirst.org/contact" target="_blank">contact</Contact> Member Services.
                </Description>
                <GoHome onClick = {() => goHome()}>Go Home</GoHome>
            </Card>
      </Wrapper>
    )
}

export default PermissionDenied;

const Wrapper = styled.div`
  height: 100%;
`;

const Card = styled.div`
  margin: 174px auto 164px;
  border-radius: 4px;
  width:480px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  padding: 40px 24px 40px 24px;
  @media only screen and (max-width: 960px) {
    margin: 150px auto;
  };
  @media only screen and (max-width: 667px) {
    margin: 86px auto;
    width: 328px;
  };
`;

const LockIcon = styled.img`
  width: 50px;
  height: 50px;
  flex-grow: 0;
  margin: 0px auto 18px;
  object-fit: contain;
`;

const Heading = styled.div`
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 32px;
    text-align: center;
    color: #003863;
`;

const Description = styled.div`
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    color: #474B55;
    margin-top:8px;
    margin-bottom:32px;
`;

const GoHome = styled.div`
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.14;
    letter-spacing: normal;
    border-radius: 4px;
    border: solid 0px;
    width: 113px;
    margin: auto;
    padding: 8px 16px;
    background-color: #3e7128;
    color: #ffffff;
    &:hover{
    cursor:pointer;
    }
`;

const Contact = styled.a`
    font-weight: 600;
    color:#008BBF;
    &:hover{
      text-decoration: underline;
        cursor:pointer;
      }
`;