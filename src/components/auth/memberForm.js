import React, { useEffect, useState } from "react";
import moment from "moment";
import {
    FormGrid,
    InputWrapper,
    InputHeader,
    MemberIdInput,
    Input,
    InputErrorMsg,
    InfoIcon,
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
    Tooltip,
    ToolTipText,
    ProgressWrapper,
    Spinner
} from "./styles";
import { useSelector, useDispatch } from "react-redux";
import { handleSegment } from "./handleSegment";
import { requestRegister } from "../../store/actions";
import Toaster from "../common/toaster";

const memberForm = ({ onBack, handleContinue, isProceedTocrediantials ,memberInfomation }) => {
    const initialState = {
        memberId: {
            value: "",
            error: null,
        },
        firstName: {
            value: "",
            error: null,
        },
        lastName: {
            value: "",
            error: null,
        },
        dateofBirth: {
            value: "",
            error: null,
        },
        zipcode: {
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

 
    const dispatch = useDispatch();
    const memberRegister = useSelector((state) => state.memberRegister);
    const [memberRegisterDetails, setMemberRegisterDetails] = useState();
    const [membershipInfo, setMembershipInfo] = useState(initialState);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const accountInfo = { ...membershipInfo };
    const customerInfo = useSelector((state) => state.customerInfo);
    const [isProceed, setIsProceed] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");

    useEffect(() => {
        setErrorMessage("")
        if(!memberRegister.loading){
            if (memberRegister?.error?.data?.data?.errorData?.mfaToken != null) {
                isProceedTocrediantials(true);
            }
            setErrorMessage(memberRegister?.error?.data?.reasonPhrase)
        }
    }, [memberRegister]);

    const handleAccountInfo = (key, label, value) => {
        accountInfo[key] = {
            value: value,
            error: label,
        };
        if (accountInfo[key].error) {
            setIsError(true);
        }
    };

    const handleClick = () => {
        for (const [key, value] of Object.entries(accountInfo)) {
            switch (key) {
                case "memberId":
                    if (value.value.length === 0) {
                        {
                            handleAccountInfo(
                                key,
                                "Member ID is Required",
                                value.value
                            );
                        }
                    } else if (value.value.length < 8) {
                        handleAccountInfo(
                            key,
                            "Your Member ID does not meet our minimum requirements.",
                            value.value
                        );
                    }
                    break;

                case "firstName":
                    if (value.value.length === 0) {
                        handleAccountInfo(
                            key,
                            "First Name is Required",
                            value.value
                        );
                    }
                    break;

                case "lastName":
                    if (value.value.length === 0) {
                        handleAccountInfo(
                            key,
                            "Last Name is Required",
                            value.value
                        );
                    }
                    break;

                case "zipcode":
                    if (value.value.length === 0) {
                        handleAccountInfo(
                            key,
                            "Zipcode is Required",
                            value.value
                        );
                    } else if (value.value.length < 5) {
                        handleAccountInfo(
                            key,
                            "Zipcode should contains 5 Digits",
                            value.value
                        );
                    }
                    break;

                case "dateofBirth":
                    if (!moment(value.value, "MM/DD/YYYY").isValid()) {
                        handleAccountInfo(
                            key,
                            "Your Date of Birth is not correct. Please enter it again.",
                            value.value
                        );
                    } else if (
                        moment().diff(
                            moment(value.value, "MM/DD/YYYY"),
                            "years"
                        ) < 18
                    ) {
                        handleAccountInfo(
                            key,
                            "Sorry! You must be 18 years of age or older to create an account",
                            value.value
                        );
                    }
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
                        handleAccountInfo(
                            key,
                            "Email is Required.",
                            value.value
                        );
                    } else if (
                        !value.value.match(
                            /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g
                        )
                    ) {
                        handleAccountInfo(
                            key,
                            "Your email is not valid",
                            value.value
                        );
                    }

                    break;

                case "cEmail":
                    if (value.value.length === 0) {
                        handleAccountInfo(
                            key,
                            "Confirm Email is Required.",
                            value.value
                        );
                    } else if (accountInfo["email"].value !== value.value) {
                        handleAccountInfo(
                            key,
                            "Email and confirm email does not match",
                            value.value
                        );
                    }
                    break;

                case "checked":
                    if (!value.value) {
                        handleAccountInfo(
                            key,
                            "Please accept terms of use",
                            value.value
                        );
                    }
                    break;
            }
        }
        if (
            accountInfo["memberId"].error === null &&
            accountInfo["email"].error === null &&
            accountInfo["firstName"].error === null &&
            accountInfo["lastName"].error === null &&
            accountInfo["zipcode"].error === null &&
            accountInfo["mobile"].error === null &&
            accountInfo["dateofBirth"].error === null &&
            accountInfo["cEmail"].error === null &&
            accountInfo["checked"].error === null
        ) {
           
            window.localStorage.setItem("authFlag",JSON.stringify("false"));
            const data = {
                memberType: "existing",
                memberId: accountInfo.memberId.value,
                firstName: accountInfo.firstName.value,
                lastName: accountInfo.lastName.value,
                DOBFULL: accountInfo.dateofBirth.value,
                zipCode: accountInfo.zipcode.value,
                email: accountInfo.cEmail.value,
                mobile: accountInfo.mobile.value,
                agreement: true,
            };
            dispatch(requestRegister(data, ""));
            setIsProceed(true);
            handleSegment("HDB", "memberform", customerInfo); 
            setMemberRegisterDetails(data);
            memberInfomation(data);
        } else {
            
            setMembershipInfo(accountInfo);
            setSubmitClicked(true);

        }
    }
    
    // We are validating the values entered in the fields before we click on Submit- Eg: DateOfBirth & LastName
    const handleMemberInfo = (e, label) => {
        if (label === "dateofBirth") {
            if (submitClicked) {
                setMembershipInfo({
                    ...membershipInfo,
                    [label]: {
                        value: e,
                        error: null,
                    },
                });
                setSubmitClicked(false);
            } else {
                setMembershipInfo({
                    ...membershipInfo,
                    [label]: {
                        value: e,
                        error: null,
                    },
                });
            }
        } else {
            if (submitClicked) {
                setMembershipInfo({
                    ...membershipInfo,
                    [label]: {
                        value: e.target.value,
                        error: null,
                    },
                });
                setSubmitClicked(false);
            } else {
                setMembershipInfo({
                    ...membershipInfo,
                    [label]: {
                        value: e.target.value,
                        error: null,
                    },
                });
            }
        }
    };

    return (      
                <>
                
                 {errorMessage != "" && (
                            <Toaster
                                toasterTop={".35in"}
                                unmountMe={() => setRenderNotification(false)}
                                timeout={5000}
                                notificationText={errorMessage}
                                notificationType="error"
                            />
                        )}
                    <BackIcon
                        src="/react/images/ico-back.svg"
                        onClick={onBack}
                    ></BackIcon>
                    <BackText onClick={onBack}>Back</BackText>
                    {isHover && (
                        <Tooltip>
                            <ToolTipText>
                                This can be found on your Healthfirst Member ID
                                card.
                            </ToolTipText>
                        </Tooltip>
                    )}
                    <Header>Register Your Accounts</Header>
                    <SubHeader>
                        Please enter the same information you provided during
                        enrollment.
                    </SubHeader>

                    <FormGrid>
                        <InputWrapper>
                            <InputHeader>Member ID</InputHeader>
                            <MemberIdInput>
                                <Input
                                    type="text"
                                    placeholder="00000000"
                                    value={membershipInfo["memberId"].value}
                                    onChange={(e) => {
                                        handleMemberInfo(e, "memberId");
                                    }}
                                    error={membershipInfo["memberId"].error}
                                    autoFocus
                                />
                                {membershipInfo["memberId"].error && (
                                    <InputErrorMsg>
                                        {membershipInfo["memberId"].error}
                                    </InputErrorMsg>
                                )}
                                <InfoIcon
                                    src="react/images/ico-info.png"
                                    onMouseLeave={() => setIsHover(false)}
                                    onMouseOver={() => setIsHover(true)}
                                ></InfoIcon>
                            </MemberIdInput>
                        </InputWrapper>
                        <AdditionalInfo>
                            <CenterInfo>
                                Do you need to make your first payment to
                                activate your coverage?
                                <Link role="button" onClick={handleContinue}>
                                    Continue Here
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
                                        const nameRegex = new RegExp(
                                            "^[a-zA-Z]+$"
                                        );
                                        if (!nameRegex.test(e.target.value)) {
                                            setMembershipInfo({
                                                ...membershipInfo,
                                                firstName: {
                                                    value: e.target.value,
                                                    error:
                                                        "Invalid Name Format",
                                                },
                                            });
                                        } else {
                                            handleMemberInfo(e, "firstName");
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
                            />
                            {membershipInfo["firstName"].error && (
                                <InputErrorMsg>
                                    {membershipInfo["firstName"].error}
                                </InputErrorMsg>
                            )}
                        </InputWrapper>
                        <InputWrapper>
                            <InputHeader>Last Name</InputHeader>
                            <Input
                                type="text"
                                placeholder="Enter Last Name"
                                value={membershipInfo["lastName"].value}
                                onChange={(e) => {
                                    if (e.target.value.length > 0) {
                                        const nameRegex = new RegExp(
                                            "[A-Za-z]"
                                        );
                                        if (!nameRegex.test(e.target.value)) {
                                            setMembershipInfo({
                                                ...membershipInfo,
                                                lastName: {
                                                    value: e.target.value,
                                                    error:
                                                        "Invalid Name Format",
                                                },
                                            });
                                        } else {
                                            handleMemberInfo(e, "lastName");
                                        }
                                    } else {
                                        setMembershipInfo({
                                            ...membershipInfo,
                                            lastName: {
                                                value: e.target.value,
                                                error: null,
                                            },
                                        });
                                    }
                                }}
                                error={membershipInfo["lastName"].error}
                            />
                            {membershipInfo["lastName"].error && (
                                <InputErrorMsg>
                                    {membershipInfo["lastName"].error}
                                </InputErrorMsg>
                            )}
                        </InputWrapper>
                        <InputWrapper>
                            <InputHeader>Date of Birth</InputHeader>
                            <Input
                                type="text"
                                placeholder="MM/DD/YYYY"
                                value={membershipInfo["dateofBirth"].value}
                                onChange={(e) => {
                                    if (
                                        e.target.value.length >
                                        membershipInfo["dateofBirth"].value
                                            .length
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
                                                input.substring(
                                                    2,
                                                    input.length
                                                );
                                        } else {
                                            input =
                                                input.substring(0, 2) +
                                                "/" +
                                                input.substring(2, 4) +
                                                "/" +
                                                input.substring(4, 8);
                                        }
                                        handleMemberInfo(input, "dateofBirth");
                                    } else {
                                        if (submitClicked) {
                                            setMembershipInfo({
                                                ...membershipInfo,
                                                dateofBirth: {
                                                    value: e.target.value,
                                                    error: null,
                                                },
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
                        <InputWrapper>
                            <InputHeader>Zip Code</InputHeader>
                            <Input
                                type="text"
                                placeholder="00000"
                                value={membershipInfo["zipcode"].value}
                                maxLength={5}
                                onChange={(e) => {
                                    if (!e.target.value.match(/^\d+$/)) {
                                        setMembershipInfo({
                                            ...membershipInfo,
                                            zipcode: {
                                                value: e.target.value,
                                                error:
                                                    "Zipcode must be a number",
                                            },
                                        });
                                    } else {
                                        handleMemberInfo(e, "zipcode");
                                    }
                                }}
                                error={membershipInfo["zipcode"].error}
                            />
                            {membershipInfo["zipcode"].error && (
                                <InputErrorMsg>
                                    {membershipInfo["zipcode"].error}
                                </InputErrorMsg>
                            )}
                        </InputWrapper>
                        <AdditionalInfo>
                            <ItalicFont>
                                You will need to verify your information via
                                email or text message.
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
                                        if (
                                            !e.target.value.match(/^[0-9 ,-]+$/)
                                        ) {
                                            setMembershipInfo({
                                                ...membershipInfo,
                                                mobile: {
                                                    value: e.target.value,
                                                    error:
                                                        "Mobile phone must be number",
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
                                                handleMemberInfo(e, "mobile");
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
                                    handleMemberInfo(e, "email");
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
                                    handleMemberInfo(e, "cEmail");
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
                                    handleMemberInfo(e, "checked");
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
                    {!memberRegister.loading ? (
                        <StyledButton
                            variant="primary"
                            onClick={() => handleClick()}
                        >
                            Continue
                        </StyledButton>
                         ) : (
                            <ProgressWrapper>
                             <Spinner width="20px" height="20px" /> 
                            </ProgressWrapper>
                        )}
                    </FormButtonWrapper>
                </>
    );
};
export default memberForm;







