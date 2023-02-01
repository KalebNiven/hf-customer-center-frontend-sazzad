import React, { useState } from "react";
import moment from "moment";
import {
    FormGrid,
    InputWrapper,
    InputHeader,
    Input,
    InputErrorMsg,
    FormButtonWrapper,
    StyledButton,
    AdditionalInfo,
    CenterInfo,
    ItalicFont,
    CheckBox,
    TermsInfo,
    TermsLink,
    CheckBoxWrapper,
    SubHeader,
    BackIcon,
    BackText,
    Link,
    Header,
    MemberCardsContainer,
    MemberCard
} from "./styles";
import { useSelector } from "react-redux";
import { handleSegment } from "./handleSegment";
import { useAppContext } from '../../AppContext'

const nonMemberForm = ({ onBack, handleRegistrationWithId , isProceedTocrediantials }) => {

    const initialState = {
        firstName: {
            value: "",
            error: null,
        },
        dateofBirth: {
            value: "",
            error: null,
        },
        mobile: {
            value: "",
            error: null,
        },
        email: {
            value: "",
            error: null,
        },
        cEmail: {
            value: "",
            error: null,
        },
        checked: {
            value: false,
            error: null,
        },
    };

    //for test purpose
    const { userEmail,setUserEmail } = useAppContext();
    const { userMobileNumber,setMobileNumber} = useAppContext();


    const [membershipInfo, setMembershipInfo] = useState(initialState);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [isError,setIsError] = useState(false);
    const accountInfo = { ...membershipInfo };
    const customerInfo = useSelector((state) => state.customerInfo);
    const [isProceed,setIsProceed] = useState(false);

    const handleAccountInfo = (key, label, value) => {
        accountInfo[key] = {
            value: value,
            error: label,
        };
        if(accountInfo[key].error){
            setIsError(true);
        }
    };

    const handleClick = () => {
        for (const [key, value] of Object.entries(accountInfo)) {

            switch (key) {
                
                case "firstName":
                    if (value.value.length === 0) {
                        handleAccountInfo( key, "First Name is Required",value.value);
                    }
                break;

                case "dateofBirth":
                    if (!moment(value.value, "MM/DD/YYYY").isValid()) {
                        handleAccountInfo( key,"Your Date of Birth is not correct. Please enter it again.",value.value);
                    }
                    // } else if (
                    //     moment().diff(moment(value.value, "MM/DD/YYYY"), "years") <
                    //     18
                    // ) {
                    //     handleAccountInfo( key,"Sorry! You must be 18 years of age or older to create an account",value.value );
                        
                    // }
                break;
                
                case "mobile": 
                    if (value.value.length ==10)  {
                        value.value.replace("-", "").length < 10 ||
                        value.value.replace("-", "").length > 11
                    } 
                    else if (value.value.length > 0 && (value.value.length !==12)) {
                        handleAccountInfo(
                            key,
                            "Mobile number should contain 10 Digits",
                            value.value
                        );
                    }
                    break; 

                case "email":
                    if (value.value.length === 0) {
                        handleAccountInfo( key,"Email is Required.",value.value );
                    } else if (
                        !value.value.match(/^([\w]+[@][a-zA-z]+[.][\w]+)$/g)
                    ) {
                        handleAccountInfo( key,"Your email is not valid",value.value );
                    }

                break;

                case "cEmail":
                    if (value.value.length === 0) {
                        handleAccountInfo( key, "Confirm Email is Required.",value.value );
                    } else if (accountInfo["email"].value !== value.value) {
                        handleAccountInfo( key, "Email and confirm email does not match",value.value );
                    }
                break;

                case "checked":
                    if (!value.value) {
                        handleAccountInfo( key, "Please accept terms of use",value.value );
                    } 
                break;
                
            }

        if (isError && accountInfo["firstName"].error == null && accountInfo["dateofBirth"].error == null && accountInfo["mobile"].error == null  && accountInfo["cEmail"].error == null && accountInfo["checked"].error == null) {
            setIsProceed(true)
            handleSegment("HDB","nonMemberFrom",customerInfo)
            setUserEmail(accountInfo["cEmail"].value)
            setMobileNumber(accountInfo["mobile"].value)
            isProceedTocrediantials(true)
        } else {
            setMembershipInfo(accountInfo);
            setSubmitClicked(true);
        }
    }
    };

    return (
        <>
       
            <BackIcon src="/react/images/ico-back.svg" onClick={onBack}></BackIcon>
            <BackText onClick={onBack}>Back</BackText>

            <Header>Register Your Accounts</Header>
            <SubHeader>
                Please enter the same information you provided during
                enrollment.
            </SubHeader>
            <FormGrid>
                <AdditionalInfo>
                    <CenterInfo>
                        Are you currently an active Healthfirst member?
                        <Link role="button" onClick={handleRegistrationWithId}>
                            Register with your Member ID
                        </Link>
                    </CenterInfo>
                </AdditionalInfo>
                <InputWrapper>
                    <InputHeader>First Name</InputHeader>
                    <Input
                        type="text"
                        placeholder="Enter First Name"
                        value={membershipInfo["firstName"].value}
                        onChange={(e) => {
                            if (e.target.value.length > 0) {
                                const nameRegex = new RegExp("^[a-z ,.'-]+$");
                                if (!nameRegex.test(e.target.value)) {
                                    setMembershipInfo({
                                        ...membershipInfo,
                                        firstName: {
                                            value: e.target.value,
                                            error: "Invalid Name Format",
                                        },
                                    });
                                    // return "Invalid Name Format";
                                } else {
                                    if (submitClicked) {
                                        setMembershipInfo({
                                            ...membershipInfo,
                                            firstName: {
                                                value: e.target.value,
                                                error: null,
                                            }
                                        });
                                        setSubmitClicked(false);
                                    } else {
                                        setMembershipInfo({
                                            ...membershipInfo,
                                            firstName: {
                                                value: e.target.value,
                                                error: null,
                                            },
                                        });
                                    }
                                }
                            } else {
                                setMembershipInfo({
                                    ...membershipInfo,
                                    firstName: {
                                        value: e.target.value,
                                        error: null,
                                    },
                                });
                            }
                        }}
                        error={membershipInfo["firstName"].error}
                        autoFocus
                    />
                    {membershipInfo["firstName"].error && (
                        <InputErrorMsg>
                            {membershipInfo["firstName"].error}
                        </InputErrorMsg>
                    )}
                </InputWrapper>
                <InputWrapper>          
                    <InputHeader>Date of Birth </InputHeader>
                    <Input
                        type="text"
                        placeholder="MM/DD"
                        value={membershipInfo["dateofBirth"].value}
                        onChange={(e) => {
                            if (
                                e.target.value.length >
                                membershipInfo["dateofBirth"].value.length
                            ) {
                                let input = e.target.value;
                                input = input.replace(/\D/g, "");
                                input = input.substring(0, 10);
                                let size = input.length;
                                if (size < 2) {
                                    input = input;
                                } else if (size < 4) {
                                    input =
                                        input.substring(0, 2) +
                                        "/" +
                                        input.substring(2, input.length);
                                } else {
                                    input =
                                        input.substring(0, 2) +
                                        "/" +
                                        input.substring(2, 4) 
                                }
                                if (submitClicked) {
                                    setMembershipInfo({
                                        ...membershipInfo,
                                        dateofBirth: {
                                            value: input,
                                            error: null,
                                        }
                                    });
                                    setSubmitClicked(false);
                                } else {
                                    setMembershipInfo({
                                        ...membershipInfo,
                                        dateofBirth: {
                                            value: input,
                                            error: null,
                                        },
                                    });
                                }
                            } else {
                                if (submitClicked) {
                                    setMembershipInfo({
                                        ...membershipInfo,
                                        dateofBirth: {
                                            value: e.target.value,
                                            error: null,
                                        }
                                    });
                                    setSubmitClicked(false);
                                } else {
                                    setMembershipInfo({
                                        ...membershipInfo,
                                        dateofBirth: {
                                            value: e.target.value,
                                            error: null,
                                        },
                                    });
                                }
                            }
                        }}
                        error={membershipInfo["dateofBirth"].error}
                    />
                    {membershipInfo["dateofBirth"].error && (
                        <InputErrorMsg>
                            {membershipInfo["dateofBirth"].error}
                        </InputErrorMsg>
                    )}
                </InputWrapper>
                <AdditionalInfo>
                    <ItalicFont>
                        You will need to verify your information via email or
                        text message.
                    </ItalicFont>
                </AdditionalInfo>
                <InputWrapper>
                    <InputHeader>Mobile Phone Number</InputHeader>
                    <Input
                        type="text"
                        placeholder="000-000-0000"
                        value={membershipInfo["mobile"].value}
                        maxLength={12}
                        onChange={(e) => {
                            if (e.target.value.length > 0) {
                                if (!e.target.value.match(/^[0-9 ,-]+$/)) {
                                    setMembershipInfo({
                                        ...membershipInfo,
                                        mobile: {
                                            value: e.target.value,
                                            error: "Enter valid number",
                                        },
                                    });
                                } else {
                                    let input = e.target.value;
                                    if (input.length === 3) {
                                        setMembershipInfo({
                                            ...membershipInfo,
                                            mobile: {
                                                value: input.replace(
                                                    /^(\d{3})$/,
                                                    "$1-"
                                                ),
                                                error: null,
                                            },
                                        });
                                    } else if (input.length === 7) {
                                        setMembershipInfo({
                                            ...membershipInfo,
                                            mobile: {
                                                value: input.replace(
                                                    /^((\d{3})-(\d{3}))$/,
                                                    "$1-"
                                                ),
                                                error: null,
                                            },
                                        });
                                    } else {
                                        if (submitClicked) {
                                            setMembershipInfo({
                                                ...membershipInfo,
                                                mobile: {
                                                    value: e.target.value,
                                                    error: null,
                                                }
                                            });
                                            setSubmitClicked(false);
                                        } else {
                                            setMembershipInfo({
                                                ...membershipInfo,
                                                mobile: {
                                                    value: e.target.value,
                                                    error: null,
                                                },
                                            });
                                        }
                                    }
                                }
                            } else {
                                setMembershipInfo({
                                    ...membershipInfo,
                                    mobile: {
                                        value: e.target.value,
                                        error: null,
                                    },
                                });
                            }
                        }}
                        error={membershipInfo["mobile"].error}
                    />
                    {membershipInfo["mobile"].error && (
                        <InputErrorMsg>
                            {membershipInfo["mobile"].error}
                        </InputErrorMsg>
                    )}
                </InputWrapper>
                <InputWrapper>
                    <InputHeader>Email Address</InputHeader>
                    <Input
                        type="text"
                        placeholder="you@domain.com"
                        value={membershipInfo["email"].value}
                        onChange={(e) => {
                            if (submitClicked) {
                                setMembershipInfo({
                                    ...membershipInfo,
                                    email: {
                                        value: e.target.value,
                                        error: null,
                                    }
                                });
                                setSubmitClicked(false);
                            } else {
                                setMembershipInfo({
                                    ...membershipInfo,
                                    email: {
                                        value: e.target.value,
                                        error: null,
                                    },
                                });
                            }
                        }}
                        error={membershipInfo["email"].error}
                    />
                    {membershipInfo["email"].error && (
                        <InputErrorMsg>
                            {membershipInfo["email"].error}
                        </InputErrorMsg>
                    )}
                </InputWrapper>
                <InputWrapper>
                    <InputHeader>Confirm Email Address</InputHeader>
                    <Input
                        type="text"
                        placeholder="you@domain.com"
                        value={membershipInfo["cEmail"].value}
                        onChange={(e) => {
                            if (submitClicked) {
                                setMembershipInfo({
                                    ...membershipInfo,
                                    cEmail: {
                                        value: e.target.value,
                                        error: null,
                                    }
                                });
                                setSubmitClicked(false);
                            } else {
                                setMembershipInfo({
                                    ...membershipInfo,
                                    cEmail: {
                                        value: e.target.value,
                                        error: null,
                                    },
                                });
                            }
                        }}
                        error={membershipInfo["cEmail"].error}
                    />
                    {membershipInfo["cEmail"].error && (
                        <InputErrorMsg>
                            {membershipInfo["cEmail"].error}
                        </InputErrorMsg>
                    )}
                </InputWrapper>
                <CheckBoxWrapper>
                    <CheckBox
                        type="checkbox"
                        name="selectCheckbox"
                        id="selectCheckbox"
                        value={membershipInfo["checked"].value}
                        onChange={(e) => {
                            if (submitClicked) {
                                setMembershipInfo({
                                    ...membershipInfo,
                                    checked: {
                                        value: e.target.value,
                                        error: null,
                                    },
                                });
                                setSubmitClicked(false);
                            } else {
                                setMembershipInfo({
                                    ...membershipInfo,
                                    checked: {
                                        value: e.target.value,
                                        error: null,
                                    },
                                });
                            }
                        }}
                        error={membershipInfo["checked"].error}
                    />
                    <TermsInfo>
                        I acknowledge the{" "}
                        <TermsLink href="">Terms of Use</TermsLink>
                    </TermsInfo>
                </CheckBoxWrapper>
                {membershipInfo["checked"].error && (
                    <InputErrorMsg>
                        {membershipInfo["checked"].error}
                    </InputErrorMsg>
                )}
            </FormGrid>
            <FormButtonWrapper>
                <StyledButton variant="primary" onClick={() => handleClick()}>
                    Continue
                </StyledButton>
            </FormButtonWrapper>
        </>
    );
};
export default nonMemberForm;
