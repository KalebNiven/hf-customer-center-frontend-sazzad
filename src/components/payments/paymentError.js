import React from "react";
import styled from "styled-components";
import GlobalStyle from "../../styles/GlobalStyle";
import { useHistory } from "react-router-dom";

const PaymentError = () => {
	const history = useHistory();

	return (
		<> 
      <GlobalStyle />
			<Card >
				<AlertIcon src="react/images/alert-icon.svg" />
				<Header>Sorry, something went wrong.</Header>
				<Description>Please	refresh the page and try again.</Description>
				<Refresh onClick={() => history.go(0)} >Refresh Page</Refresh>
			</Card>
		</>
	)
}

export default PaymentError;

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

const AlertIcon = styled.img`
  width: 50px;
  height: 50px;
  flex-grow: 0;
  margin: 0px auto 18px;
  object-fit: contain;
`;

const Header = styled.div`
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

const Refresh = styled.div`
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  border-radius: 4px;
  border: solid 0px;
  width: 150px;
  margin: auto;
  padding: 8px 16px;
  background-color: #3e7128;
  color: #ffffff;
  &:hover{
  cursor:pointer;
  }
`;
