import React, { useEffect } from "react";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router-dom";
const { MIX_APP_DOMAIN } = process.env;
import LoadingOverlay from "./loadingOverlay";

const NotFound404 = ({ isAuthenticated }) => {
  const history = useHistory();
  const location = useLocation();

  const saveRequestedURL = (location) => {
    let pathname = location.pathname;
    if (pathname === "/sessionExpired") {
      // Lets make this better... tomorrow
      return null;
    }
    const queryParams = location.search.split("&");
    queryParams.forEach((d, i) => {
      if (i === 0) {
        pathname = `${pathname}${d}`;
      } else {
        pathname = `${pathname}&${d}`;
      }
    });

    const searchParam = new URLSearchParams(window.location.search);
    if (searchParam.get("redirectUrl") == null) {
      sessionStorage.setItem("from", MIX_APP_DOMAIN + pathname);
    }
  };

  useEffect(() => {
    checkAuthenticated();
  });

  const checkAuthenticated = () => {
    // Unauthenticated user handling
    if (isAuthenticated === false) {
      saveRequestedURL(location);
      history.push("/login");
      return <LoadingOverlay />;
    }
  };

  return (
    <Container>
      <ErrorWrapper>
        <ErrorContainer>
          <ErrorCard>
            <Icon src="/react/images/alert-icon.svg" />
            <ErrorCardTitle>Something went wrong.</ErrorCardTitle>
            <ErrorCardText>
              The page failed to load. Please try again.
            </ErrorCardText>
            {/* <ErrorCodeText>Error Code: <span className="bold">###</span></ErrorCodeText> */}
            <ControllersWrapper>
              <ControllersButton onClick={() => history.goBack()}>
                Go Back
              </ControllersButton>
              <ControllersButton onClick={() => history.push("/home")}>
                Go Home
              </ControllersButton>
            </ControllersWrapper>
          </ErrorCard>
        </ErrorContainer>
      </ErrorWrapper>
    </Container>
  );
};

export const Loading = styled.div`
  color: red;
  font-size: 4rem;
`;

const Container = styled.div`
  display: flex;
  height: 100%;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const ErrorContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 1px;
  padding: 16px;
  padding-right: 31px;
  padding-left: 31px;
  display: table;
  margin-top: auto;
  margin-bottom: auto;
  height: 336px;
  padding: 40px 24px;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  background-color: #ffffff;
`;

const ErrorWrapper = styled.div`
  display: table-cell;
  text-align: center;
`;

const ErrorCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (min-width: 768px) {
    width: 480px;
  }
  max-width: 480px;
`;

const ErrorCardTitle = styled.h6`
  font-size: 20px;
  font-weight: 500;
  line-height: 1.6;
  color: #003863;
  margin-bottom: 1rem;
`;

const ErrorCardText = styled.p`
  font-weight: 500;
  color: #474b55;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 16px;
  margin-bottom: 0.25rem;
`;

const ErrorCodeText = styled.p`
  margin-bottom: 1.5rem !important;
  color: #474b55;
  font-size: 12px;
  letter-spacing: 0;
  line-height: 16px;
`;

const Icon = styled.img`
  width: 80px;
  height: 80px;
`;

const ControllersWrapper = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 30px;
`;

const ControllersButton = styled.span`
  height: 40px;
  padding: 8px 16px;
  border-radius: 4px;
  border: solid 1px #3e7128;
  background-color: #fff;
  color: #3e7128;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  text-align: center;
  cursor: pointer;
`;

export default NotFound404;
