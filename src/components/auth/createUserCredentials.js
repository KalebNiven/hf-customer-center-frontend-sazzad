import React, { useEffect, useState } from "react";
import styled from "styled-components";
import RegistrationSuccess from "./RegistrationSuccess";

import {
    FormGrid,
    InputWrapper,
    InputHeader,
    Input,
    InputErrorMsg,
    FormButtonWrapper,
    StyledButton,
    Header,
    MemberIdInput,
    Tooltip,
    InfoIcon,
    ToolTipText,
    ProgressWrapper,
    Spinner
} from "./styles";
import { handleSegment } from "./handleSegment";
import { useDispatch, useSelector } from "react-redux";
import {
    requestCreateUserNamePassword,
    requestRegister,
} from "../../store/actions";
import { useAppContext } from "../../AppContext";
import Toaster from "../common/toaster";


const CreateUserCredentials = (props) => {
    const initialState = {
        UserName: {
            value: "",
            error: null,
        },
        Password: {
            value: "",
            error: null,
        },
        ConfirmPassword: {
            value: "",
            error: null,
        },
    };

    const customerInfo = useSelector((state) => state.customerInfo);
    const [memberInfo, setMemberInfo] = useState(initialState);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const accountInfo = { ...memberInfo };

    const [ memberRegisterDetails, setMemberRegisterDetails ] = useState(props.memberInfo);

    const dispatch = useDispatch();
    const memberRegister = useSelector((state) => state.memberRegister);
    const createUsernamePassword = useSelector(
        (state) => state.createUsernamePassword
    );

    useEffect(() => {
        setErrorMessage("")
        if(!createUsernamePassword.loading){
            
            if (createUsernamePassword?.data !== null) {
                setSubmitClicked(true);
            }
            setErrorMessage(createUsernamePassword?.error?.data?.reasonPhrase)
        }
    }, [createUsernamePassword]);

    const mfaVerify = useSelector((state) => state.mfaVerify);

    //mfaVerifiedToken will comes from selector
    const mfaVerifiedToken = mfaVerify.data?.mfaAuthorization;

    useEffect(() => {
        
        dispatch(requestRegister(memberRegisterDetails, mfaVerifiedToken));
    }, []);

    const handleAccountInfo = (key, label, value) => {
        accountInfo[key] = {
            value: value,
            error: label,
        };
        if (accountInfo[key].error) {
            setIsError(true);
        }
    };

    const handleSubmit = () => {
        for (const [key, value] of Object.entries(accountInfo)) {
            switch (key) {
                case "UserName":
                    if (value.value.length === 0) {
                        handleAccountInfo(
                            key,
                            "UserName should not be empty",
                            value.value
                        );
                    } else if (value.value.length > 0) {
                        if (!isNaN(value.value)) {
                            handleAccountInfo(
                                key,
                                "Invalid UserName",
                                value.value
                            );
                        } else {
                            handleAccountInfo(key, null, value.value);
                        }
                    }
                    break;

                case "Password":
                    if (value.value.length === 0) {
                        handleAccountInfo(
                            key,
                            "Password should not be empty",
                            value.value
                        );
                    } else if (value.value.length > 0) {
                        const passwordRegex = new RegExp(
                            "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^ws]).{8,}$"
                        );
                        if (
                            passwordRegex.test(value.value) &&
                            !value.value.includes(accountInfo["UserName"].value)
                        ) {
                            handleAccountInfo(key, null, value.value);
                        } else {
                            handleAccountInfo(
                                key,
                                "Invalid Password",
                                value.value
                            );
                        }
                    }
                    break;

                case "ConfirmPassword":
                    if (value.value.length === 0) {
                        handleAccountInfo(
                            key,
                            "ConfirmPassword should not be empty",
                            value.value
                        );
                    } else if (value.value.length > 0) {
                        if (accountInfo["Password"].value === value.value) {
                            handleAccountInfo(key, null, value.value);
                        } else {
                            handleAccountInfo(
                                key,
                                "Password and CofirmPassword not match",
                                value.value
                            );
                        }
                    }
                    break;
            }
        }
        if (
            accountInfo["UserName"].error === null &&
            accountInfo["Password"].error === null &&
            accountInfo["ConfirmPassword"].error === null
        ) {
            const data = {
                username: accountInfo.UserName.value,
                password: accountInfo.Password.value,
                confirmPassword: accountInfo.ConfirmPassword.value,
            };
            dispatch(requestCreateUserNamePassword(data, mfaVerifiedToken));
        } else {
            setMemberInfo(accountInfo);
            handleSegment("HBD", "createUserCredentials", customerInfo);
        }
    };

    const handleMemberInfo = (e, label) => {
        if (submitClicked) {
            setMemberInfo({
                ...memberInfo,
                [label]: {
                    value: e.target.value,
                    error: null,
                },
            });
            setSubmitClicked(false);
        } else {
            setMemberInfo({
                ...memberInfo,
                [label]: {
                    value: e.target.value,
                    error: null,
                },
            });
        }
    };

    return (
        <>
         {errorMessage !== "" && (
                            <Toaster
                                toasterTop={".35in"}
                                unmountMe={() => setRenderNotification(false)}
                                timeout={5000}
                                notificationText={errorMessage}
                                notificationType="error"
                            />
                        )}
            <MemberCardsContainer>
                {submitClicked ? (
                    <RegistrationSuccess />
                ) : (
                    <MemberCard>
                        {isHover && (
                            <CustomToolTip>
                                <CustomToolTipText>
                                    Must contain: <br />
                                    - At least 3 characters
                                    <br />
                                    - 1 upper case letter <br />
                                    - 1 lower case letter
                                    <br />
                                    - 1 number
                                    <br />
                                    - 1 special character
                                    <br />- Should NOT contain part of your
                                    username, first, or last name
                                </CustomToolTipText>
                            </CustomToolTip>
                        )}
                        <CustomHeader>Set Username and Password</CustomHeader>
                        <FormGrid>
                            <InputWrapper>
                                <InputHeader>UserName</InputHeader>
                                <MemberIdInput>
                                    <Image src="/img/account_normal.png"></Image>
                                    <CustomInput
                                        autoFocus
                                        type="text"
                                        placeholder="Enter a UserName"
                                        value={memberInfo["UserName"].value}
                                        onChange={(e) => {
                                            if (e.target.value.length > 0) {
                                                handleMemberInfo(e, "UserName");
                                            } else {
                                                setMemberInfo({
                                                    ...memberInfo,
                                                    UserName: {
                                                        value: e.target.value,
                                                        error: null,
                                                    },
                                                });
                                            }
                                        }}
                                        error={memberInfo["UserName"].error}
                                    />
                                    {memberInfo["UserName"].error && (
                                        <InputErrorMsg>
                                            {memberInfo["UserName"].error}
                                        </InputErrorMsg>
                                    )}
                                </MemberIdInput>
                            </InputWrapper>
                            <InputWrapper>
                                <InputHeader>Password</InputHeader>
                                <MemberIdInput>
                                    <Image src="/react/images/lock-icon-grey.svg"></Image>
                                    <CustomInput
                                        type="password"
                                        placeholder="Enter a Password"
                                        value={memberInfo["Password"].value}
                                        onChange={(e) => {
                                            if (e.target.value.length > 0) {
                                                handleMemberInfo(e, "Password");
                                            } else {
                                                setMemberInfo({
                                                    ...memberInfo,
                                                    Password: {
                                                        value: e.target.value,
                                                        error: null,
                                                    },
                                                });
                                            }
                                        }}
                                        error={memberInfo["Password"].error}
                                    />
                                    {memberInfo["Password"].error && (
                                        <InputErrorMsg>
                                            {memberInfo["Password"].error}
                                        </InputErrorMsg>
                                    )}
                                    <InfoIcon
                                        src="react/images/ico-info.png"
                                        onMouseLeave={() => setIsHover(false)}
                                        onMouseOver={() => setIsHover(true)}
                                    ></InfoIcon>
                                </MemberIdInput>
                            </InputWrapper>
                            <InputWrapper>
                                <InputHeader>Confirm Password</InputHeader>
                                <MemberIdInput>
                                    <Image src="/react/images/lock-icon-grey.svg"></Image>
                                    <CustomInput
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={
                                            memberInfo["ConfirmPassword"].value
                                        }
                                        onChange={(e) => {
                                            if (e.target.value.length > 0) {
                                                handleMemberInfo(
                                                    e,
                                                    "ConfirmPassword"
                                                );
                                            } else {
                                                setMemberInfo({
                                                    ...memberInfo,
                                                    ConfirmPassword: {
                                                        value: e.target.value,
                                                        error: null,
                                                    },
                                                });
                                            }
                                        }}
                                        error={
                                            memberInfo["ConfirmPassword"].error
                                        }
                                    />
                                    {memberInfo["ConfirmPassword"].error && (
                                        <InputErrorMsg>
                                            {
                                                memberInfo["ConfirmPassword"]
                                                    .error
                                            }
                                        </InputErrorMsg>
                                    )}
                                </MemberIdInput>
                            </InputWrapper>
                        </FormGrid>
                        <CustomFormWrapper>
                            {!createUsernamePassword.loading ? (
                                <StyledButton
                                    variant="primary"
                                    onClick={() => handleSubmit()}
                                >
                                    Finish Registration
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
        </>
    );
};

export default CreateUserCredentials;

const Container = styled.div`
    height: 100px;
`;

const CustomInput = styled(Input)`
    padding: 8px 16px 8px 40px;
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

const MemberCard = styled.div`
    overflow: hidden;
    padding: 16px 16px 12px 16px;
    border-radius: 4px;
   // border: solid 2px #d8d8d8;
    background: #ffffff;
`;

const LogoImg = styled.img`
  height: 47px;
  margin: auto;
  margin-top: 15px;
  margin-bottom: 47px;
}
`;

const CustomToolTip = styled(Tooltip)`
    width: 166px;
    height: 177px;
    margin-top: 30px;
    margin-left: 120px;
    z-index: 1;
`;

const CustomToolTipText = styled(ToolTipText)`
    align-items: start;
    text-align: start;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: #ffffff;
    height: 159px;
    padding: 8px 9px 10px 8px;
`;

const MemberCardsContainer = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    width: 320px;
    left: 0px;
    top: 0px;
    border-radius: 4px;
    margin: auto;
    margin-bottom: 59px;
    margin-top: 15px;
    font-family: "museo-sans" !important;
`;

const CustomFormWrapper = styled(FormButtonWrapper)`
    margin-top: 126px;
`;

const CustomHeader = styled(Header)`
    margin: 32px 16px 24px 16px;
`;

const Image = styled.img`
    position: absolute;
    margin-top: 9px;
    margin-left: 11px;
`;
