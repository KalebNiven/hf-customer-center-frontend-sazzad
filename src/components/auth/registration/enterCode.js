import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
    FormGrid,
    InputWrapper,
    Input,
    FormButtonWrapper,
    StyledButton,
    SubHeader,
    BackIcon,
    BackText,
    Header,
    MemberCardsContainer,
    MemberCard,
    Span,
    ProgressWrapper,
    Spinner,
    VerifyButton
} from "../styles";
import VerifyModal from "./verifyModal";
import { useDispatch, useSelector } from "react-redux";
import { requestMFACode, requestMFAVerify } from "../../../store/actions";
const { MIX_REACT_SEND_CODE_DELAY } = process.env;
import { handleSegmentClick } from "../../../libs/segment";
import { useToaster } from "../../../hooks/useToaster";

const SEND_CODE_VIA_TEXT= 'send code via text';   
const SEND_CODE_VIA_EMAIL= 'send code via email';  
const SEND_CODE_AGAIN = 'send code again';
const VERIFY_ENTERED_CODE = 'verify entered code';
const VERIFY = 'verify';
const ERROR = "error"

const EnterCode = (props) => {
    const {addToast} = useToaster();
    const [blockSelection,setBlockSelection] = useState(false)
    const [submitClicked, setSubmitClicked] = useState(false);
    const [code, setCode] = useState();
    const [selection, setSelection] = useState(props.selectionMode);
    const [data, setData] = useState(props.info);
    const [isSendCodeClickEnable, setSendCodeClickEnable] = useState(false);
    const [variant, setVariant] = useState(false); 
    const mfaFactors = useSelector((state) => state.mfaFactors);
    const mfaVerify = useSelector((state) => state.mfaVerify); 
    const memberRegister = useSelector((state) => state.memberRegister);
    const [isVisible, setIsVisible] = useState(true);
    const [isContinue,setIsContinue] = useState(false);
    const [verifyVariant,setVerifyVariant] = useState("");

    const dispatch = useDispatch();

    const {memberInfo, unauthorizedToken} = props;
    // csrf will comes from selector
    const mfaUnverifiedToken =
        unauthorizedToken ? unauthorizedToken : memberRegister?.data?.mfaToken;

    useEffect(() => {
       

        if (!mfaVerify.loading  && isContinue) {
            if (mfaVerify.data !== null) {
                setSubmitClicked(true);
            }else{
               
            addToast({
                timeout:5000,
                notificationText:mfaVerify?.error?.data?.message,
                notificationType:ERROR
            })
        }
        }
    }, [mfaVerify]);

    useEffect(() => {
        enableAfterTimeOut();
        if (mfaFactors.data?.channels[0]?.displayInfo === undefined) {
            setData(mfaFactors.data?.channels[1]?.displayInfo);
            setIsVisible(false);
        }
    }, []);

    const enableAfterTimeOut = () => {
        setTimeout(() => {
            setSendCodeClickEnable(true);
            setVariant(true);
        }, MIX_REACT_SEND_CODE_DELAY);
    };

    const handleSubmitClick = (trigger) => {
       if(trigger){
        handleSegmentClick(null, VERIFY, VERIFY_ENTERED_CODE, "button", "bottom",  "", "registration");
        if (selection === "text") {
            let data = {
                code: code,
            };
            dispatch(requestMFAVerify(data, mfaUnverifiedToken, "email"));
        } else if (selection === "email") {
            let data = {
                code: code,
            };
            dispatch(requestMFAVerify(data, mfaUnverifiedToken, "sms"));
        }
        setIsContinue(true)
    }
    };
     
    const handleSelectionMode = () => {
        if (selection === "text") {
            handleSegmentClick(null,SEND_CODE_VIA_TEXT, SEND_CODE_VIA_TEXT, "link", "center",  "", "registration"); 
            setSelection("email");
            setData(mfaFactors.data?.channels[0].displayInfo);
            if(!blockSelection){
                let reqData = { val: "", type: "sms" };
                dispatch(requestMFACode(reqData, mfaUnverifiedToken));
                 setBlockSelection(true)
            }
        } else if (selection === "email") {
            setSelection("text");
            handleSegmentClick(null,SEND_CODE_VIA_EMAIL, SEND_CODE_VIA_EMAIL, "link", "center",   "", "registration"); 
            setData(mfaFactors.data?.channels[1].displayInfo);
            if(!blockSelection){
            let reqData = { val: "", type: "email" };
            dispatch(requestMFACode(reqData, mfaUnverifiedToken));
            setBlockSelection(true)
            }
        }
    };

    const handleResendCode = () => {
        if(variant === false) return;
        if (!isSendCodeClickEnable) return;
        
        else {
            handleSegmentClick(null, SEND_CODE_AGAIN, SEND_CODE_AGAIN, "link", "center",  "", "registration");
            setSendCodeClickEnable(false);
            setVariant(false);
            if (selection === "text") {
                let reqData = { val: "", type: "email" };
                dispatch(requestMFACode(reqData, mfaUnverifiedToken));
            } else if (selection === "email") {
                let reqData = { val: "", type: "sms" };
                dispatch(requestMFACode(reqData, mfaUnverifiedToken));
            }
            setCode("");
            enableAfterTimeOut();
        }
    };

    const handleBackClick = () => {
        props.submit(false);
    };


    return (
        <>
                    {submitClicked ? (
                        <VerifyModal memberInfo={props.memberInfo} />
                    ) : (
                        <MemberCard>
                            <CustomHeader>Enter Code</CustomHeader>
                            <CustomSubHeader>
                                Please provide the six digit verification code
                                we sent to &nbsp;
                                <b>{data}</b>
                            </CustomSubHeader>
                            <CustomFormGrid>
                                <InputWrapper>
                                    <Input
                                        type="number"
                                        maxLength={6}
                                        placeholder="Enter Code"
                                        value={code}
                                        autoFocus
                                        onChange={(e) => {
                                            console.log('length',e.target.value.length)
                                            if(e.target.value.toString().length <= 6){
                                                setCode(e.target.value);
                                                setVerifyVariant("")
                                                if(e.target.value.toString().length === 6){
                                                    setVerifyVariant("primary")
                                                }
                                            }
                                            
                                        }}
                                    />
                                </InputWrapper>
                            </CustomFormGrid>
                            <CustomText primary>
                                Didn’t get the code?{" "}
                                <Span
                                    variant={variant}
                                    onClick={() => handleResendCode()}
                                >
                                    Send code again
                                </Span>
                            </CustomText>
                            {props.preferTextSelection && isVisible && (
                                <CustomText>
                                    Prefer a {selection}?{" "}
                                    <Span
                                        variant={true}
                                        onClick={() => handleSelectionMode()}
                                    >
                                        Send code via {selection}
                                    </Span>
                                </CustomText>
                            )}
                            <CustomFormWrapper>
                                {!mfaVerify.loading  ?  (
                                    <VerifyButton
                                   
                                        variant = {verifyVariant}
                                        onClick={() => verifyVariant==="primary"? handleSubmitClick(true):handleSubmitClick(false)}
                                    >
                                        Verify
                                    </VerifyButton>
                                ) : (
                                    <ProgressWrapper>
                                        <Spinner width="20px" height="20px" />
                                    </ProgressWrapper>
                                )}
                            </CustomFormWrapper>
                        </MemberCard>
                    )}
        </>
    );
};

export default EnterCode;

const BackContainer = styled.div``;
const CustomHeader = styled(Header)`
    margin-top: 88px;
`;

const Container = styled.div`
    height: 100%;
`;

const CustomSubHeader = styled(SubHeader)`
    font-size: 16px;
    font-style: normal;
    font-weight: 100;
    margin-bottom: 16px;
    font-family: "museo-sans", san-serif !important;
    color: #474b55;
    line-height: 24px;
`;

const CustomText = styled(SubHeader)`
    margin-top: ${(props) => (props.primary ? "32px" : "24px")};
    font-weight: 100;
`;

const CustomFormWrapper = styled(FormButtonWrapper)`
    margin-top: 118px;
`;

const CustomSpan = styled(Span)``;

const CustomFormGrid = styled(FormGrid)`
    margin-top: 16px;
`;
