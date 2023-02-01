import React, { useEffect } from 'react'
import styled from 'styled-components';
import Spinner from './spinner'

const LoadingOverlay = ({ isLoading }) => {
    useEffect(() => {
        if(isLoading){
            document.querySelector("body").style.overflow = "hidden";
            window.scrollTo(0, 0);
        } else {
            document.querySelector("body").style.overflow = null;
        }
    }, [isLoading])

    return (
        <Container>
            <SpinnerWrapper>
                <Spinner />
            </SpinnerWrapper>
        </Container>
    )
}

export const Container = styled.div`
  position: absolute;
  z-index: 999;
  background: rgba(0, 42, 74, 0.72);
  width: 100%;
  height: 100vh;
`;

export const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export default LoadingOverlay
