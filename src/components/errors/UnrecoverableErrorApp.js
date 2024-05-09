import React from "react";
import {
  Container,
  ErrorContainer,
  ErrorWrapper,
  ErrorCard,
  ErrorCardTitle,
  ErrorCardText,
  Icon,
  ControllersWrapper,
  ControllersButton,
} from "./styles";

// @@ Note: You should not intentionally use this component as it's used only for ErrorBoundaries and nowhere else;
// @@ Parameters: Parameters are coming from "react-error-boundary" lib via ErrorBoundary component;
const UnrecoverableErrorApp = ({ error, resetErrorBoundary }) => {
  const showDebug = process.env.NODE_ENV !== "production";

  const handleReloadClick = () => {
    resetErrorBoundary();
  };

  return (
    <Container>
      <ErrorWrapper>
        <ErrorContainer>
          <ErrorCard>
            <Icon src="/react/images/alert-icon.svg" />
            <ErrorCardTitle>
              {showDebug ? "Error Debug Message:" : "Something went wrong."}
            </ErrorCardTitle>
            <ErrorCardText>
              {showDebug
                ? error.message
                : "The page failed to load. Please try again."}
            </ErrorCardText>
            <ControllersWrapper>
              <ControllersButton onClick={handleReloadClick}>
                Reload
              </ControllersButton>
            </ControllersWrapper>
          </ErrorCard>
        </ErrorContainer>
      </ErrorWrapper>
    </Container>
  );
};

export default UnrecoverableErrorApp;
