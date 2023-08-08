import React from 'react'
import styled from 'styled-components'
import ExternalSiteLink from '../../common/externalSiteLink'

const EndTourScreen = ({ goBack, handleEndTour }) => {
    return (
        <EndTourScreenWrapper>
            <Overlay>
                <ModalWrapper>
                    <Image src="/react/images/mobile-app-2.svg" />
                    <Title>Access Healthfirst Anywhere</Title>
                    <Description>Use our Healthfirst NY Mobile App to find care that's in your network, locate essential services nearby, view your digital member ID, and more.</Description>
                    <Downloads>
                        <ExternalSiteLink link="https://apps.apple.com/us/app/healthfirst-ny/id1464792066" target="_blank" label = "apps.apple.com" segmentTrack="External Service Launched" segmentProps="{{ json_encode(['service_name' => 'AppStore', 'raw_text' => 'Download App', 'destination_url' => 'https://apps.apple.com/us/app/healthfirst-ny/id1464792066' ]) }}">
                            <DownloadImg isFirst src="/react/images/download-on-the-app-store-badge.svg" />
                        </ExternalSiteLink>
                        <ExternalSiteLink link="https://play.google.com/store/apps/details?id=org.healthfirst.android.member" label = "play.google.com"  target="_blank" segmentTrack="External Service Launched" segmentProps="{{ json_encode(['service_name' => 'Google Play', 'raw_text' => 'Download App', 'destination_url' => 'https://play.google.com/store/apps/details?id=org.healthfirst.android.member' ]) }}">
                            <DownloadImg src="/react/images/download-google-play-badge.svg" />
                        </ExternalSiteLink>
                    </Downloads>
                    <ButtonsWrapper>
                        <Button outlined={true} onClick={goBack} isFirst>Back</Button>
                        <Button onClick={handleEndTour}>End Tour</Button>
                    </ButtonsWrapper>
                </ModalWrapper>
            </Overlay> 
        </EndTourScreenWrapper>
    )
}

export const EndTourScreenWrapper = styled.div`
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
    /* margin: 0 8px; */
    padding: 8px 16px;
    border-radius: 4px;
    border: 1px solid #3e7128;
    background: ${props => props.outlined ? "#fff" : "#3e7128"};
    color: ${props => props.outlined ? "#3e7128" : "#fff"};
    text-transform: capitalize;
    cursor: pointer;
    font-weight: 600;
    width: ${props => props.isFirst ? "110px" : "120px"};
    margin-right: ${props => props.isFirst && "20px"};

    @media only screen  and (max-width: 480px) {
        margin: 0 0 8px 0;
        width: auto;
    }

    &:hover {
        background-color:  ${props => props.outlined ? "rgba(62, 113, 40, 0.05)" : "#517f3d" };
    }
`

export const DownloadImg = styled.img`
    width: 120px;
    /* margin: 7px; */
    pointer-events: none;
    margin-right: ${props => props.isFirst && "10px"};
`

export const Downloads = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 30px 0;
`;

export default EndTourScreen