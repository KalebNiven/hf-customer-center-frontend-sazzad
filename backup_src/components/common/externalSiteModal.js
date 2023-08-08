import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../AppContext'
import styled from 'styled-components'
import { AnalyticsTrack } from "../common/segment/analytics";
import { ANALYTICS_TRACK_TYPE } from "../../constants/segment";
import { requestSelectPlan } from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import {  ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import Spinner from './spinner'

const ExternalSiteModal = () => {
    const { externalSiteModal, resetExternalModal } = useAppContext()
    const customerInfo = useSelector((state) => state.customerInfo);
    const homeDetails = useSelector((state) => state.homeDetails);
    const [membership, setMembership] = useState({})
    const [externalWindow, setExternalWindow] = useState();

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            // reset modal content on component unmount
            resetExternalModal()
        }
    }, [])

    // SSO Links Handling 
    useEffect(() => {
        if(!membership?.membershipKey) return;
        if(homeDetails.externalLinkLoading) {
            return setMembership({ ...membership, loading: true });
        } else {
            setMembership({ ...membership, loading: false });
            if(homeDetails.externalLinkError === undefined) {
                externalWindow.location = membership.link;
                resetExternalModal();
            }
        }
    }, [membership.membershipKey, homeDetails.externalLinkError, homeDetails.externalLinkLoading])

    const handleClose = () => {
        resetExternalModal()
    }

    const handleContinue = (e, link,membershipKey,label) => {
        // Segment Track
        AnalyticsTrack(
            externalSiteModal.segmentTitle || "External Site Clicked", 
            customerInfo,
            {
                "raw_text": e.target.textContent, 
                "destination_url": link, 
                "description": externalSiteModal.label,
                "category": ANALYTICS_TRACK_CATEGORY.home, 
                "type": ANALYTICS_TRACK_TYPE.linkClicked, 
                "targetMemberId": externalSiteModal.segmentTargetMemberId || customerInfo.data.memberId,
                "location": {
                    "desktop":{
                        "width": 1024,
                        "value": "center"
                    },
                    "tablet":{
                        "width": 768,
                        "value": "center"
                    },
                    "mobile":{
                        "width": 0,
                        "value": "center"
                    }
                }
            }
        );
        
        const isSSOLink = membershipKey !== null && membershipKey !== undefined;
        if(isSSOLink){ // handle SSO Links
            setMembership({ membershipKey, link })
            dispatch(requestSelectPlan(membershipKey));
            setExternalWindow(window.open("", "_blank"));
        } else { // handle regular links
            window.open(link);
            resetExternalModal()
        }
    }

    return (
        <>
            { externalSiteModal.isVisible &&
            <Wrappper>
                { membership?.loading ? <Spinner /> :
                <Dialog>
                    <DialogHeader>
                        <CloseIconWrapper>
                            <CloseIcon src="/react/images/icn-close.svg" onClick={handleClose} />
                        </CloseIconWrapper>
                        <Title>You are now navigating away from Healthfirst</Title>
                    </DialogHeader>
                    <DialogBody>
                        <Description>
                            Links to non-Healthfirst websites are provided for your convenience only. Healthfirst is not responsible or liable for the content, accuracy, or privacy practices of linked sites, or of products or services described on these sites.
                        </Description>
                    </DialogBody>
                    <DialogFooter>
                        <ButtonsWrapper>
                            <Button margin="0 16px" type = "cancel" outlined onClick={handleClose}>Cancel</Button>
                            <Button onClick={(e) => handleContinue(e, externalSiteModal.link, externalSiteModal.membershipKey,externalSiteModal.label)}>Continue</Button>
                        </ButtonsWrapper>
                    </DialogFooter>
                </Dialog> }
            </Wrappper> }
        </>
    )
}

export const Wrappper = styled.div`
    background-color: rgba(0, 42, 74, 0.72);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1050;
    transition: opacity .15s linear;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const Dialog = styled.div`
    padding: 24px;
    flex-direction: column;
    pointer-events: auto;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0,0,0,.2);
    border-radius: 0.3rem;
    outline: 0;
    width: 440px;
    margin: 0 16px;
`;

export const DialogHeader = styled.div`
`;

export const DialogBody = styled.div`
`;

export const DialogFooter = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

export const Title = styled.h5`
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: 400;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #003863;
`;

export const Description = styled.div`
    font-size: 16px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: #474b55;
    margin-bottom: 40px;
`;

export const Button = styled.button`
    height: 40px;
    margin: ${props => props.margin && props.margin};
    padding: 8px 16px;
    border-radius: 4px;
    border: 1px solid #3e7128;
    background: ${props => props.outlined ? "#fff" : "#3e7128"};
    color: ${props => props.outlined ? "#3e7128" : "#fff"};
    text-transform: capitalize;
    cursor: pointer;
    font-size:18px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight:  ${props => props.type === "cancel" ? "400" : "600"} ;

    @media only screen  and (max-width: 480px) {
        margin: 0 0 8px 0;

        &:first-child {
            margin: 0;
        }
    }

    &:hover {
        background-color:  ${props => props.outlined ? "rgba(62, 113, 40, 0.05)" : "#517f3d" };
    }
`

export const ButtonsWrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    @media only screen  and (max-width: 480px) {
        flex-direction: column-reverse;
        justify-content: center;
        flex: 1;
    }
`

export const CloseIconWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 5px 0;
`;

export const CloseIcon = styled.img`
    cursor: pointer;
    height: 16px;
    width: 16px;
`;

export default ExternalSiteModal
