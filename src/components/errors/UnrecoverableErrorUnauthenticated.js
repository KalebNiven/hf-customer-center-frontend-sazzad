import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, ErrorContainer, ErrorWrapper, ErrorCard, ErrorCardTitle, ErrorCardText, Icon, ControllersWrapper, ControllersButton } from './styles'
import useLogError from '../../hooks/useLogError';

// @@ Note: You should not intentionally use this component as it's used only for ErrorBoundaries and nowhere else;
// @@ Parameters: Parameters are coming from "react-error-boundary" lib via ErrorBoundary component;
const UnrecoverableErrorUnauthenticated = ({ error, resetErrorBoundary }) => {
    const showDebug = process.env.NODE_ENV !== 'production';
    const history = useHistory();
    const { logError } = useLogError();

    const handleHomeClick = () => {
        resetErrorBoundary();
        history.push('/');
    }
    
    // Log Error
    useEffect(() => {
        (async () => {
            try {
                await logError(error);
            } catch (err) {
                console.error('Error caught: ', err.message);
            }
        })()
    }, [])
    
    return(
        <Container>
            <ErrorWrapper>
                <ErrorContainer>
                    <ErrorCard>
                        <Icon src="/react/images/alert-icon.svg" />
                        <ErrorCardTitle>{showDebug ? 'Unrecoverable Error Debug Message:' : 'Something went wrong.'}</ErrorCardTitle>
                        <ErrorCardText>{showDebug ? error.message : 'The page failed to load. Please try again.'}</ErrorCardText>
                        <ControllersWrapper>
                            <ControllersButton onClick={handleHomeClick}>Go Home</ControllersButton>
                        </ControllersWrapper>
                    </ErrorCard>
                </ErrorContainer>
            </ErrorWrapper>
        </Container>
    )
}

export default UnrecoverableErrorUnauthenticated;