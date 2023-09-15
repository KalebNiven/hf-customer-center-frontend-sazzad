import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, ErrorContainer, ErrorWrapper, ErrorCard, ErrorCardTitle, ErrorCardText, Icon, ControllersWrapper, ControllersButton } from './styles'
import useLogError from '../../hooks/useLogError';

// @@ Note: You can use this global error page to display errors like "necessary API failed to load and we can't proceed";
// @@ Parameters: error Object { message, ... }
const UnrecoverableErrorCommon = ({ error }) => {
    const showDebug = process.env.NODE_ENV !== 'production';
    const history = useHistory();
    const { logError } = useLogError();

    const handleHomeClick = () => {
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
                        <ErrorCardTitle>{showDebug ? 'Error Debug Message:' : 'Something went wrong.'}</ErrorCardTitle>
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

export default UnrecoverableErrorCommon;