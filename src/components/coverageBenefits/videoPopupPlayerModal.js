import React from "react";
import styled from "styled-components";
import { CloseIcon, ModalInnerWrapper, ModalWrapper } from "../../styles/commonStyles";

const VideoPopupPlayer = (props) => {
    return (
        <VideoModalWrapper>
            <VideoModalInnerWrapper>
                <VideoModalContent>
                    <VideoPlayerCloseButton src={'react/images/icn-close-white.svg'} onClick={props.toggleVideo} />
                    <VideoContainer>
                        <iframe src={props.embedLink} allowFullScreen/>
                    </VideoContainer>
                </VideoModalContent>
            </VideoModalInnerWrapper>
        </VideoModalWrapper>
    );
}

export default VideoPopupPlayer;
 
const VideoModalWrapper = styled(ModalWrapper)`
    
`;

const VideoModalInnerWrapper = styled(ModalInnerWrapper)`
    max-width: none;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const VideoModalContent = styled.div`
    display: flex;
    flex-direction: column;
`;

const VideoContainer = styled.div`
    position: relative;
    display: block;
    width: 45rem;
    overflow: hidden;

    @media only screen  and (max-width: 650px) {
        width: 25.5rem;
    }
    @media only screen  and (max-width: 280px) {
        width: 18rem;
    }
    &:before{
        display: block;
        content: "";
        padding-top: 56.25%;
        //16:9 * 100% aspect ratio
    }
    > iframe{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 0;
    }
`;

const VideoPlayerCloseButton = styled(CloseIcon)`
    align-self: end; 
    margin-bottom: 1rem;
    height: 1.25rem;
    width: 1.25rem;
`;