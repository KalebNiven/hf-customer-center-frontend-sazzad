import React from 'react'
import styled from 'styled-components'

const FirstTimeScreen = ({ visible, handleStart, handleEndTour, firstName }) => {

    return (
        <FirstTimeScreenWrapper visible={visible}>
            <Overlay>
                <ModalWrapper>
                    <Image src="/react/images/health-data-2.svg" />
                    <Title>Welcome, <FirstName>{firstName}</FirstName></Title>
                    <Description>Healthfirst has been working hard to provide it’s members the best user experience. Take a tour to see what’s new.</Description>
                    <ButtonsWrapper>
                        <Button outlined={true} onClick={handleEndTour}>No Thanks</Button>
                        <Button onClick={handleStart}>Let's Go</Button>
                    </ButtonsWrapper>
                </ModalWrapper>
            </Overlay> 
        </FirstTimeScreenWrapper>
    )
}

export const FirstTimeScreenWrapper = styled.div`
    display: ${props => !props.visible && "none"};
`

export const ModalWrapper = styled.div`
    background: red;
    position: fixed;
    z-index: 1000;
    bottom: 0;
    right: 0;
    padding: 25px 16px;
    text-align: center;
    width: 360px;
    border-radius: 4px;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.23);
    background-color: #fff;
    margin: 24px;

    @media only screen  and (max-width: 480px) {
        width: auto;
        margin: 8px;
        position: static;
    }

    @media only screen  and (max-width: 878px) {
        margin: 8px;
        position: static;
    }
`;

export const Image = styled.img`
    margin: 0 auto;
    margin-bottom: 20px;
`;

export const Title = styled.h4`
    font-size: 20px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.6;
    letter-spacing: normal;
    color: #003863;
    margin-bottom: 15px;
`;

export const Description = styled.p`
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: normal;
    color: #474b55;
    margin-bottom: 50px;
`;

export const Overlay = styled.div`
    height: 100vh;
    position: fixed;
    z-index: 1001;
    left: 0;
    top: 0;
    width: 100%;
    background: rgba(0, 42, 74, 0.72);

    @media only screen  and (max-width: 878px) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
`;

export const ButtonsWrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    @media only screen  and (max-width: 480px) {
        flex-direction: column-reverse;
        justify-content: center;
    }
`

export const Button = styled.button`
    height: 40px;
    margin: 0 8px;
    padding: 8px 16px;
    border-radius: 4px;
    border: 1px solid #3e7128;
    background: ${props => props.outlined ? "#fff" : "#3e7128"};
    color: ${props => props.outlined ? "#3e7128" : "#fff"};
    text-transform: capitalize;
    cursor: pointer;
    font-weight: 600;

    @media only screen  and (max-width: 480px) {
        margin: 0 0 8px 0;
    }

    &:hover {
        background-color:  ${props => props.outlined ? "rgba(62, 113, 40, 0.05)" : "#517f3d" };
    }
`

export const FirstName = styled.span`
    text-transform: capitalize;
`

export default FirstTimeScreen