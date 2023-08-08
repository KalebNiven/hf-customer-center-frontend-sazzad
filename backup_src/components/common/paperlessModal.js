
import React, { useEffect, useState } from "react";
import styled from 'styled-components'; 
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../../AppContext'
import {
	ModalWrapper, ModalInnerWrapper
} from "../../styles/commonStyles";
import { useSelector } from "react-redux";
import { AnalyticsTrack } from "../../components/common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";

const PaperlessModal = () => { 
    const history = useHistory();
    const { openPaperLess, setOpenPaperLess } = useAppContext()
    const [isHovering, setIsHovering] = useState(false);
    const customerInfo = useSelector(state => state.customerInfo.data)
    const [visible, setVisible] = useState(true)
    const customerInfoData = useSelector(state => state.customerInfo)

    useEffect(() => {
        let key = "PaperLessModalData" + customerInfo.customerId
        let currentDate = new Date();
        let localStorageData = window.localStorage.getItem(key);
        let data = JSON.parse(localStorageData);


        if (data != null) {
            setVisible(false)

            let localStorageDate = new Date(data.date);
            if (data.customerId != customerInfo.customerId) {
                setVisible(true)

            } else {
                if (currentDate.getTime() >= localStorageDate.getTime()) {
                    setVisible(true)
                }
            }
        }

    }, []);


    const handleMouseOver = () => {
        setIsHovering(true);
    }

    const handleMouseOut = () => {
        setIsHovering(false);
    }


    const handleEnrollNow = () => {
        handleMaybeLater("enrolNow")
        handleSegmentBtn('Enroll Now')
        setOpenPaperLess(true)
        history.push({
            pathname: '/settings',
            state: { sideBarIndex: 0 }
        })
    }

    //come up with a logic where handleSegmentBtn('Maybe Later') can be called only once and not thrice
    const handleMaybeLater = (label) => {
        setVisible(false)
        let maybeLaterDate = new Date();
       if(label === "mayBeLater"){
        handleSegmentBtn('Maybe Later')
        }
        maybeLaterDate.setMonth(maybeLaterDate.getMonth() + 3)


        const paperLessModalData = {
            date: maybeLaterDate,
            customerId: customerInfo.customerId
        }

        let key = "PaperLessModalData" + paperLessModalData.customerId
        window.localStorage.setItem(key, JSON.stringify(paperLessModalData));
    };

    const handleSegmentBtn = (label) => { 

        // Segment Track
        AnalyticsTrack(
          label + " " + "Button clicked",
          customerInfoData,
          {
            "raw_text": label,
            "destination_url": "Paperless Widget",
            "description": label,
            "category": ANALYTICS_TRACK_CATEGORY.modal,
            "type": ANALYTICS_TRACK_TYPE.buttonClicked,
            "targetMemberId": customerInfoData?.data?.memberId,
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

    const handleSession = () => {
        sessionStorage.setItem('PaperLessSession', false)
    }

    return (
        <>
            {visible &&
                <FormModalWrapper>
                    {handleSession()}
                    <ModalInnerWrapperCustom>                   
                        {isHovering &&
                            <DocumentWrapper>
                                <HoverText>
                                    Supported Documents: <br />
                                    <HoverTextSpan>&#x2022; Explaination of Benefits (EOB) </HoverTextSpan>
                                </HoverText>


                            </DocumentWrapper>
                        }
                        <Image src="/react/images/icn-close.svg" onClick={handleMaybeLater}></Image>
                        <Header>
                            Enroll in Paperless
                        </Header>
                        <SubHeader>
                            Enroll to get your <CustomTextSpan onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} >documents</CustomTextSpan> online instead of by mail,
                            and save paper and time. Your documents will be sent to
                            your primary email address as they become paperless and available online.
                        </SubHeader>
                        <ButtonWrapper>
                            <LaterButton onClick={() => handleMaybeLater("mayBeLater")}>Maybe Later</LaterButton>
                            <StyledButtonCustom onClick={handleEnrollNow}>Enroll Now</StyledButtonCustom>
                        </ButtonWrapper>                    
                    </ModalInnerWrapperCustom>
                </FormModalWrapper>
            }
        </>
    );
}

export default PaperlessModal;

const FormModalWrapper = styled(ModalWrapper)`
    transition: opacity 300ms ease-in-out;
    background: rgba(0, 42, 74, 0.72);

`


const DocumentWrapper = styled.div`
position:absolute;
width: 250px;
height: 68px;
margin-left: 11.5%;
background: #003863;
border-radius: 4px;
`;



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
    width: 312px;
    height: 40px;
    margin: auto;
    margin-top: 40px;
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

const HoverTextSpan = styled.span`
margin-left: 2rem;
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
font-size: 24px;
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

export const LaterButton = styled.div`
width: 81px;
height: 16px;
cursor:pointer;
font-style: normal;
font-weight: 600;
font-size: 14px;
line-height: 16px;
fontFamily: "museo-sans";
margin: 40px 24px 36px 0px;
color: #008BBF;

@media only screen  and (max-width: 480px) {
    width: 81px;
    height: 16px;
   margin: auto;
   margin-top: 26px;
   margin-bottom: 30px;
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

const HoverText = styled.h1`
margin: 10px 0px 0px 10px;
fontFamily: "museo-sans";
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 20px;



color: #FFFFFF;
`;