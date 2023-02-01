import React, { useEffect, useState } from "react";
import { select } from "redux-saga/effects";
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
    Link,
    Header,
    MemberCardsContainer,
    MemberCard,
    Span,
    ProgressWrapper,
    Spinner
} from "./styles";
import VerifyModal from "./verifyModal";
import { useDispatch, useSelector } from "react-redux";
import { requestMFACode, requestMFAVerify } from "../../store/actions";
import Toaster from "../common/toaster";

const EnterCode = (props) => {
    const [submitClicked, setSubmitClicked] = useState(false);
    const [code, setCode] = useState();
    const [selection, setSelection] = useState(props.selectionMode);
    const [data, setData] = useState(props.info);
    const [mfaStatus, setMfaStatus] = useState();
    const [
        verificationCodeInputError,
        setVerificationCodeInputError,
    ] = useState("");
    const [isSendCodeClickEnable, setSendCodeClickEnable] = useState(false);
    const [variant, setVariant] = useState("");

    const mfaFactors = useSelector((state) => state.mfaFactors);
    const mfaVerify = useSelector((state) => state.mfaVerify);
    const memberRegister = useSelector((state) => state.memberRegister);

    const dispatch = useDispatch();

    // csrf will comes from selector
    const mfaUnverifiedToken = memberRegister?.error?.data?.data?.errorData?.mfaToken;

    useEffect(() => {
        setVerificationCodeInputError("");

        if (!mfaVerify.loading) {
            if (mfaVerify.data !== null) {
                setSubmitClicked(true);
            }
            setVerificationCodeInputError(mfaVerify?.error?.data?.message);
        }
    }, [mfaVerify]);

    useEffect(() => {
       
        setTimeout(() => enableAfterTimeOut(), 3000);
    }, []);

    const enableAfterTimeOut = () => {
        
        setSendCodeClickEnable(true);
        setVariant("primary");
    };

    const handleSubmitClick = () => {
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
    };

    const handleBackClick = () => {
        props.submit(false);
    };

    const handleSelectionMode = () => {
        if (selection === "text") {
            setSelection("email");
            setData(mfaFactors.data?.channels[0].displayInfo);
        } else if (selection === "email") {
            setSelection("text");
            setData(mfaFactors.data?.channels[1].displayInfo);
        }
    };

    const handleResendCode = () => {
        if (isSendCodeClickEnable) {
            if (selection === "text") {
                let reqData = { val: "", type: "email" };
                dispatch(requestMFACode(reqData, mfaUnverifiedToken));
            } else if (selection === "email") {
                let reqData = { val: "", type: "sms" };
                dispatch(requestMFACode(reqData, mfaUnverifiedToken));
            }
            setCode("");
        }
    };

    return (
                <>
                    <Container>
                        {verificationCodeInputError !== "" && (
                            <Toaster
                                toasterTop={".35in"}
                                unmountMe={() => setRenderNotification(false)}
                                timeout={5000}
                                notificationText={verificationCodeInputError}
                                notificationType="error"
                            />
                        )}
                        <MemberCardsContainer>
                            {submitClicked ? (
                                <VerifyModal memberInfo={props.memberInfo}/>
                            ) : (
                                <MemberCard>
                                    <BackIcon
                                        src="/react/images/ico-back.svg"
                                        onClick={() => handleBackClick()}
                                    ></BackIcon>
                                    <BackText>Back</BackText>
                                    <CustomHeader>Enter Code</CustomHeader>
                                    <CustomSubHeader>
                                        Please provide the six digit
                                        verification code we sent to &nbsp;
                                        {data}
                                    </CustomSubHeader>
                                    <CustomFormGrid>
                                        <InputWrapper>
                                            <Input
                                                type="text"
                                                maxLength={6}
                                                placeholder="Enter Code"
                                                value={code}
                                                autoFocus
                                                onChange={(e) => {
                                                    const numberRegex = new RegExp(
                                                        "^[0-9]*$"
                                                    );
                                                    if (
                                                        numberRegex.test(
                                                            e.target.value
                                                        )
                                                    ) {
                                                        setCode(e.target.value);
                                                    } else {
                                                        setCode("");
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
                                    {props.preferTextSelection &&
                                    <CustomText>
                                        Prefer a {selection}?{" "}
                                        <Span
                                            variant="primary"
                                            onClick={() =>
                                                handleSelectionMode()
                                            }
                                        >
                                            Send code via {selection}
                                        </Span>
                                       
                                    </CustomText>
}
                                    <CustomFormWrapper>
                                    {!mfaVerify.loading ? (
                                        <StyledButton
                                            variant="primary"
                                            onClick={() => handleSubmitClick()}
                                        >
                                            Verify
                                        </StyledButton>
                                         ) : (
                                            <ProgressWrapper>
                                                 <Spinner width="20px" height="20px" /> 
                                            </ProgressWrapper>
                                        )}
                                    </CustomFormWrapper>
                                </MemberCard>
                            )}
                        </MemberCardsContainer>
                    </Container>
                </>
    );
};

export default EnterCode;

const CustomHeader = styled(Header)`
    margin-top: 104px;
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
    margin-top: ${(props) => (props.primary ? "48px" : "24px")};
    font-weight: 100;
`;

const CustomFormWrapper = styled(FormButtonWrapper)`
    margin-top: 118px;
`;

const CustomSpan = styled(Span)``;

const CustomFormGrid = styled(FormGrid)`
    margin-top: 16px;
`;
