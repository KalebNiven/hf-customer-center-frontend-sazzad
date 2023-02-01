import React, { useEffect, useState } from "react";
import styled from "styled-components";
import EnterCode from "./enterCode";
import {
    MemberCardsContainer,
    MemberCard,
    Header,
    FormButtonWrapper,
    StyledButton,
    ProgressWrapper,
    Spinner,
} from "./styles";
import { useAppContext } from "../../AppContext";
import { useDispatch, useSelector } from "react-redux";
import { requestMFAFactors, requestMFACode } from "../../store/actions";

const VerifyAccount = (memberInfomation) => {
    const [submitClicked, setSubmitClicked] = useState(false);
    const [selection, setSelection] = useState("email");
    const [sendCodeTo, setSendCodeTo] = useState("");
    const [preferedSelectedItem, setPreferedSelectedItem] = useState("");
    const [hasTextOption, setHasTextOption] = useState(true);
    const dispatch = useDispatch();
    const mfaFactors = useSelector((state) => state.mfaFactors);
    const memberRegister = useSelector((state) => state.memberRegister);
    const [isTextSelection,setIsTextSelection] = useState(false);

    const [userEmail, setUserEmail] = useState("");
    const [userMobileNumber, setMobileNumber] = useState("");

    // csrf will comes from selector
    const mfaUnverifiedToken = memberRegister?.error?.data?.data?.errorData?.mfaToken;

    useEffect(() => {
        dispatch( 
            requestMFAFactors(mfaUnverifiedToken)
        );
    }, []);

    useEffect(() => {
        if (!mfaFactors?.loading) {
            if (mfaFactors.data?.channels[0].displayInfo !== undefined || mfaFactors.data?.channels[1].displayInfo !== undefined ) {
                setUserEmail(mfaFactors.data?.channels[1]?.displayInfo);
                setMobileNumber(mfaFactors.data?.channels[0]?.displayInfo);
            }
           
        }
    }, [mfaFactors]);

    //for test purpose
    const handleSubmitClick = () => {
        setSubmitClicked(true);
        
        if(userMobileNumber !== undefined){
        setIsTextSelection(true)
        }
        if (selection === "text") {
            let reqData = { val: userMobileNumber, type: "sms" };
            dispatch(requestMFACode(reqData, mfaUnverifiedToken));
            setSendCodeTo(userMobileNumber);
            setPreferedSelectedItem("email");
        } else if (selection === "email") {
            setSendCodeTo(userEmail);
            let reqData = { val: userMobileNumber, type: "email" };
            dispatch(requestMFACode(reqData, mfaUnverifiedToken));
            setPreferedSelectedItem("text");
        }
    };

    const handleRadio = (value) => {
        setSelection(value);
    };

    return (
        <>
            <BackgroundDiv>
                <LanguageDiv>
                    <LanguageLink href="">EN</LanguageLink> |{" "}
                    <LanguageLink href="">ES</LanguageLink> |{" "}
                    <LanguageLink href="">中文</LanguageLink>
                </LanguageDiv>
                <LogoImg src="/react/images/simple_white.svg" />
                <CustomMemberCardContainer>
                    {submitClicked ? (
                        <EnterCode
                            submit={setSubmitClicked}
                            info={sendCodeTo}
                            selectionMode={preferedSelectedItem}
                            memberInfo={memberInfomation}
                            preferTextSelection={isTextSelection}
                        />
                    ) : (
                        <MemberCard>
                            <CustomHeader>Verify Your Account</CustomHeader>

                            <RadioButtonContainer
                                onClick={() => handleRadio("email")}
                                active={selection === "email"}
                            >
                                <RadioImg
                                    src={
                                        selection === "email"
                                            ? "react/images/icn-radio-active.svg"
                                            : "react/images/icn-radio-inactive.svg"
                                    }
                                />
                                <CustomText>
                                    Email<Span> me a code at </Span>
                                    <Span>{userEmail}</Span>
                                </CustomText>
                            </RadioButtonContainer>
                            {userMobileNumber !== undefined && (
                                
                                <RadioButtonContainer
                                    onClick={() => handleRadio("text")}
                                    active={selection === "text"}
                                >
                                    <RadioImg
                                        src={
                                            selection === "text"
                                                ? "react/images/icn-radio-active.svg"
                                                : "react/images/icn-radio-inactive.svg"
                                        }
                                    />
                                    <CustomText>
                                        Text
                                        <Span>
                                            {" "}
                                            me a code at {userMobileNumber}{" "}
                                        </Span>
                                        <Span>
                                            Message and data rates may apply.
                                        </Span>
                                    </CustomText>
                                </RadioButtonContainer>
                            )}
                            <CustomFormButtonWrapper>
                                {!mfaFactors.loading ? (
                                    <StyledButton
                                        variant="primary"
                                        onClick={() => handleSubmitClick()}
                                    >
                                        Send Code
                                    </StyledButton>
                                ) : (
                                    <ProgressWrapper>
                                        <Spinner width="20px" height="20px" />
                                    </ProgressWrapper>
                                )}
                            </CustomFormButtonWrapper>
                        </MemberCard>
                    )}
                </CustomMemberCardContainer>
            </BackgroundDiv>
        </>
    );
};

export default VerifyAccount;

const CustomMemberCardContainer = styled(MemberCardsContainer)`
    height: 526px;
`;

const BackgroundDiv = styled.div`
    height: 900px;
    background-image: url(/react/images/background-image.png);
`;

const CustomHeader = styled(Header)`
    margin-top: 75px;
    margin-bottom: 40px;
`;

const LogoImg = styled.img`
  height: 47px;
  margin: auto;
  margin-top: 15px;
  margin-bottom: 47px;
}
`;
const CustomText = styled.div`
    font-weight: 400;
    font-size: 18px;
    line-height: 24px;
    text-align: center;
    color: #003f6b;
    margin-bottom: 12px;
    margin-top: -4px;
    text-align: start;
`;

const RadioImg = styled.img`
    align-self: flex-start;
    margin-top: 4px;
`;

const CustomFormButtonWrapper = styled(FormButtonWrapper)`
    margin-top: 166px;
`;

const Span = styled.span`
    width: 232px;
    height: 80px;
    font-family: "museo-sans", sans-serif !important;
    font-weight: 100;
    color: #474b55;
    font-size: 14px;
    line-height: 20px;
    align-items: flex-start;
    gap: 8px;
`;

const RadioButtonContainer = styled.div`
    display: flex;
    gap: 12px;
    height: 64px;
    width: 288px;
    border: 1px solid #d8d8d8;
    background: #ffffff;
    padding: 12px 12px 12px 14px;
    border-radius: 6px;
    margin-bottom: 8px;
    &:last-child {
        margin-bottom: 0px;
    }
    border: ${(props) => props.active && "2px solid #003863"};
`;

const LanguageDiv = styled.div`
    text-align: right;
    font-size: 16px;
    font-weight: 700;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.13;
    letter-spacing: normal;
    color: white;
    margin-top: 22px;
    margin-right: 25px;
`;

const LanguageLink = styled.a`
    color: #ffffff;
    &:hover {
        color: #ffffff;
    }
    &:active {
        color: rgb(170, 170, 170) !important;
    }
`;
