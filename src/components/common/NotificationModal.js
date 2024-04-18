
import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { ModalWrapper, ModalInnerWrapper } from "../../styles/commonStyles";
import { useSelector } from "react-redux";
import { AnalyticsTrack } from "./segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";

const NotificationModal = () => { 
    const customerInfoDataObj = useSelector(state => state.customerInfo);
    const [visible, setVisible] = useState(false);
    
    useEffect(() => {
        sessionStorage.getItem('isNotificationModalClosed') === null && setVisible(true);
    }, []);

    const closeModal = (label) => {
        setVisible(false);
        handleSegmentBtn(label);
        window.sessionStorage.setItem('isNotificationModalClosed', true);
    };

    const handleSegmentBtn = (label) => { 
        // Segment Track
        AnalyticsTrack(
          `Notification Modal ${label} Button clicked`,
          customerInfoDataObj,
          {
            "raw_text": label,
            "destination_url": "/home",
            "description": label,
            "category": ANALYTICS_TRACK_CATEGORY.modal,
            "type": ANALYTICS_TRACK_TYPE.buttonClicked,
            "targetMemberId": customerInfoDataObj?.data?.memberId,
            "location": {
              "desktop": {
                "width": 960,
                "value": "center"
              },
              "tablet": {
                "width": 768,
                "value": "center"
              },
              "mobile": {
                "width": 0,
                "value": "center"
              }
            }
          }
        );
    }

    return (
        <>
            {visible &&
                <FormModalWrapper>
                    <ModalInnerWrapperCustom>                   
                        <Image src="/react/images/icn-close.svg" onClick={() => closeModal('Close')}></Image>
                        <Header>
                            Important Message
                        </Header>
                        <SubHeader>
                            <b>Claims</b>, <b>Authorizations</b> and <b>Explanation of Benefits</b> are unavailable at this time. Please contact member services using the number on the back of your member ID card for assistance.
                        </SubHeader>
                        <ButtonWrapper>
                            <StyledButtonCustom onClick={() => closeModal('Continue')}>Continue</StyledButtonCustom>
                        </ButtonWrapper>                    
                    </ModalInnerWrapperCustom>
                </FormModalWrapper>
            }
        </>
    );
}

export default NotificationModal;

const FormModalWrapper = styled(ModalWrapper)`
    transition: opacity 300ms ease-in-out;
    background: rgba(0, 42, 74, 0.72);
`

const StyledButtonCustom = styled.button`
height: 40px;
width: 126px;
margin: 28px 24px 24px 0px;
padding: 8px 16px;
border-radius: 4px;
border: 1px solid #3e7128;
background: ${props => props.outlined ? "#fff" : "#3e7128"};
color: ${props => props.outlined ? "#3e7128" : "#fff"};
text-transform: capitalize;
cursor: pointer;
font-weight: 600;

@media only screen  and (max-width: 480px) {
    height: 40px;
    margin: auto;
    margin-top: 32px;
}

&:hover {
    background-color:  ${props => props.outlined ? "rgba(62, 113, 40, 0.05)" : "#517f3d"};
}`;


const Image = styled.img`
width: 14.73px;
height: 14.73px;
margin-right: 28.22px;
position: relative;
cursor:pointer;
float: right;

@media only screen and (max-width: 480px){
    
    width: 17px;
    height: 19px;
    margin-right: 20.22px;
}
`;

export const CustomTextSpan = styled.span`
cursor:pointer;
color:#008BBF;
`;

const ModalInnerWrapperCustom = styled(ModalInnerWrapper)`
background: white;
max-width: 440px;
height: 268px;
overflow: hidden;
border-radius: 4px;

@media only screen  and (max-width: 480px) {
    width: 344px;
    height: 336px;
}
`;

export const Header = styled.div`
height: 32px;
width: 392px;
margin: 24px 24px 12px 24px;
fontFamily: "museo-sans";
left: 24px;
top: 44px;
border-radius: nullpx;
font-size: 20px;
font-weight: 600;
line-height: 32px;
letter-spacing: 0px;
text-align: left;
color: #003863;

@media only screen  and (max-width: 480px) {
    width: 312px;
    height: 28px;
    margin: 28px 16px 4px 16px;
}

`;

export const ButtonWrapper = styled.div`
display: flex;
    justify-content: end;
    flex-wrap: wrap;
    margin-bottom:3px;;

    @media only screen  and (max-width: 480px) {
        flex-direction: column-reverse;
        justify-content: center;
    }
`;

export const SubHeader = styled.div`
width:392px;
height: 80px;
margin: 0px 24px 0px 24px;
fontFamily: "museo-sans";
font-size: 14px;
font-weight: 400;
font-stretch: normal;
font-style: normal;
line-height: 1.43;
text-align: left;
color:#474B55;

@media only screen  and (max-width: 480px) {
   
width: 312px;
height: 100px;
margin: 10px 16px 0px 16px;
}
` ;
