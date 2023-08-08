import React, { useEffect, useState } from "react";
import moment from "moment";
import styled from "styled-components";
import {requestResetRegisterState } from '../../../store/actions'; 
import { emailIsValid ,nameisValid , mobileNumberIsValid} from "../../../utils/formValidation";
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
} from "../styles";
import { useSelector, useDispatch } from "react-redux";
import { handleSegmentClick } from "../../../libs/segment";
import { requestRegister } from "../../../store/actions";
import { RecaptchaV2 ,RecaptchaV3} from "../recaptcha/recaptcha";
import { useToaster } from "../../../hooks/useToaster";

const MINIMUM_18YEARS_ERROR = 'Sorry! You must be 18 years of age or older to create an account';
const INCORRECT_DOB = 'Your Date of Birth is not correct. Please enter it again.';
const ZIPCODE_MINIMUM_CHARACTERS = 'Zipcode should contains 5 Digits';
const ZIPCODE_REQUIRED = 'Zipcode is Required';
const LASTNAME_REQUIRED = 'Last Name is Required';
const FIRSTNAME_REQUIRED = 'First Name is Required';
const MEMBERID_REQUIRED = 'Member ID is Required'; 
const EMAILID_REQUIRED = 'Email is Required'; 
const INVALID_MEMBERID =  'Your Member ID does not meet our minimum requirements.'
const INVALID_MOBILE_NO = 'Mobile number should contain 10 Digits.';
const INVALID_EMAIL = '"Your email is not valid"';
const CONFIRM_EMAIL_REQUIRED = 'Confirm Email is Required. ';
const TERMS_OF_USE ='Please accept terms of use';
const CONFIRM_EMAIL_DOESNT_MATCH = 'Email and confirm email does not match';
const ZIPCODE_ERROR = 'Zipcode must be a number';
const MOBILE_ERROR = 'Mobile phone must be number';
const INVALID_NAME_FORMAT = 'Invalid Name Format';
const ERROR = "error"
const { MIX_REACT_REG_CONTACT_LINK } = process.env;

const memberForm = ({ onBack, handleContinue, isProceedTocrediantials ,memberInfomation, }) => {
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
    const {addToast} = useToaster();
    const memberRegister = useSelector((state) => state.memberRegister);
    const [memberRegisterDetails, setMemberRegisterDetails] = useState();
    const [membershipInfo, setMembershipInfo] = useState(initialState);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const accountInfo = { ...membershipInfo };
    const [isProceed, setIsProceed] = useState(false);
    const [gRecaptchaResponse, setGRecaptchaResponse] = useState();
    const [gRecaptchaResponseV2, setGRecaptchaResponseV2] = useState();
    const [grVersion, setGrVersion] = useState('V3');
    const [isContinue,setIsContinue] = useState(false);
    const [formSubmissions, setFormSubmissions] = useState(0);
    const [variant,setVariant] = useState("")
    const [ischecked,setIsChecked] = useState();
    const [firstNameCheck,setFirstNameCheck] = useState();
    const [lastNameCheck,setLastNameCheck] = useState();
    const [maxlength,setMaxLength] = useState();
    const [onBackKeyPressed,setBackKeyPressed]  = useState(false);

    useEffect(()=>{
        dispatch(requestResetRegisterState()); // All Redux
    },[])

    useEffect(() => {

        if(!memberRegister.loading && isContinue){
            setFormSubmissions(formSubmissions + 1);
            if (memberRegister?.data?.mfaToken != null ) {
                isProceedTocrediantials(true);
            }else if(memberRegister?.error?.message == "Failed recaptcha check"){
                setGrVersion("V2")
            } 
            if(memberRegister?.error?.message !== "Failed recaptcha check"){
                window.scrollTo(0,0);
            addToast({
                timeout:5000,
                notificationText:memberRegister?.error?.message,
                notificationLink: MIX_REACT_REG_CONTACT_LINK,
                notificationLinkText: 'call member services',
                notificationType:ERROR,
                toasterTop:"6%"
            })  
        }
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

    const checkValues = (checkBoxStatus) =>{
        if (
            accountInfo["memberId"].value.length >1 &&
            accountInfo["email"].value.length >1 &&
            accountInfo["zipcode"].value.length >1&&
            accountInfo["dateofBirth"].value.length >1 &&
            firstNameCheck && lastNameCheck &&
            accountInfo["cEmail"].value.length >1  &&
            ( (!accountInfo["checked"].value && checkBoxStatus) ||
            (accountInfo["checked"].value  && checkBoxStatus == undefined) || checkBoxStatus )
            
        ){
            setVariant("primary")
        }else{
            setVariant("")
        }
    }

    const handleClick = (trigger) => {
        if(trigger){
            checkValues();
        for (const [key, value] of Object.entries(accountInfo)) {
            switch (key) {
                case "memberId":
                    if (value.value.length === 0) {
                        {
                            handleAccountInfo(
                                key,
                                MEMBERID_REQUIRED,
                                value.value
                            );
                        }
                    } else if (value.value.length < 8) {
                        handleAccountInfo(
                            key,
                            INVALID_MEMBERID,
                            value.value
                        );
                    }
                    break;

                case "firstName":
                    if (value.value.length === 0) {
                        handleAccountInfo(
                            key,
                            FIRSTNAME_REQUIRED,
                            value.value
                        );
                    }
                    break;

                case "lastName":
                    if (value.value.length === 0) {
                        handleAccountInfo(
                            key,
                            LASTNAME_REQUIRED,
                            value.value
                        );
                    }
                    break;

                case "zipcode":
                    if (value.value.length === 0) {
                        handleAccountInfo(
                            key,
                            ZIPCODE_REQUIRED,
                            value.value
                        );
                    } else if (value.value.length < 5) {
                        handleAccountInfo(
                            key,
                            ZIPCODE_MINIMUM_CHARACTERS,
                            value.value
                        );
                    }
                    break;

                case "dateofBirth":
                    if (!moment(value.value, "MM/DD/YYYY").isValid()) {
                        handleAccountInfo(
                            key,
                            INCORRECT_DOB,
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
                            MINIMUM_18YEARS_ERROR,
                            value.value
                        );
                    }
                    break;

                case "mobile": 
                    if (value.value.length > 0 && (value.value.replace(/\s+/g,"").length!==12)) {
                        handleAccountInfo(
                            key,
                            INVALID_MOBILE_NO,
                            value.value
                        );
                    }
                    break; 
                case "email":
                    if (value.value.length === 0) {
                        handleAccountInfo(
                            key,
                            EMAILID_REQUIRED,
                            value.value
                        );
                    } else if (!emailIsValid(value.value)) {
                        handleAccountInfo(
                            key,
                            INVALID_EMAIL,
                            value.value
                        );
                    }
                    break;
                case "cEmail":
                    if (value.value.length === 0) {
                        handleAccountInfo(
                            key,
                            CONFIRM_EMAIL_REQUIRED,
                            value.value
                        );
                    } else if (accountInfo["email"].value !== value.value) {
                        handleAccountInfo(
                            key,
                            CONFIRM_EMAIL_DOESNT_MATCH,
                            value.value
                        );
                    }
                    break;

                case "checked":
                    if (!value.value) {
                        handleAccountInfo(
                            key,
                            TERMS_OF_USE,
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
            const data = {
                memberType: "existing",
                memberId: accountInfo.memberId.value,
                firstName: accountInfo.firstName.value,
                lastName: accountInfo.lastName.value,
                DOBFULL: accountInfo.dateofBirth.value,
                zipCode: accountInfo.zipcode.value,
                email: accountInfo.email.value,
                email_confirmation: accountInfo.cEmail.value,
                mobile: accountInfo.mobile.value,
                agreement: true,
            };
            
            if(grVersion ==="V3"){
                data["g-recaptcha-response"] = gRecaptchaResponse
            }else{
                data["g-recaptcha-response-v2"] = gRecaptchaResponseV2
            }
        
            dispatch(requestRegister(data, ""));
            setIsProceed(true);
            handleSegmentClick(null,"Continue", "Member Form Submission", "button",  "bottom", "", "registration");
            setMemberRegisterDetails(data);
            memberInfomation(data);
            setIsContinue(true);
        } else {
            setMembershipInfo(accountInfo);
            setSubmitClicked(true);

        }
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
                <RecaptchaV3 setV3Response={setGRecaptchaResponse} formSubmitted={formSubmissions}/>
                
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
                    <Header>Register Your Account</Header>
                    <SubHeader>
                        Please enter the same information you provided during
                        enrollment.
                    </SubHeader>

                    <FormGrid>
                        <InputWrapper>
                            <InputHeader for="memberid">Member ID</InputHeader>
                            <MemberIdInput>
                                <Input
                                    type="text"
                                    name="memberid"
                                    placeholder="00000000"
                                    autocomplete='custom-memberid'
                                    onClick={() => checkValues()}
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
                                    src="/react/images/ico-info.png"
                                    onMouseLeave={() => setIsHover(false)}
                                    onMouseOver={() => setIsHover(true)}
                                ></InfoIcon>
                            </MemberIdInput>
                        </InputWrapper>
                        <AdditionalInfo>
                            <CenterInfo>
                                Do you need to make your first payment to
                                activate your coverage? &nbsp;
                                <Link role="button" onClick={handleContinue}>
                                    Continue Here
                                </Link>
                            </CenterInfo>
                        </AdditionalInfo>
                        <InputWrapper>
                            <InputHeader htmlFor="firstName" name="firstName">First Name</InputHeader>
                            <Input
                            
                                type="text"
                                name="firstName"
                                data-type="firstName"
                                autocomplete="given-name"
                                placeholder="Enter First Name"
                                onClick={() => checkValues()}
                                value={membershipInfo["firstName"].value}
                                onChange={(e) => {
                                    setFirstNameCheck(false)
                                    checkValues(false)
                                    if (e.target.value.length > 0) {
                                        setFirstNameCheck(true)
                                        checkValues(true)
                                        if (nameisValid(e.target.value)) {
                                            setMembershipInfo({
                                                ...membershipInfo,
                                                firstName: {
                                                    value: e.target.value,
                                                    error: INVALID_NAME_FORMAT,
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
                            <InputHeader for="lastName">Last Name</InputHeader>
                            <Input
                                type="text"
                                name="lastName"
                                autocomplete="family-name"
                                placeholder="Enter Last Name"
                                value={membershipInfo["lastName"].value}
                                onClick={() => checkValues()}
                                onChange={(e) => { 
                                    setLastNameCheck(false);
                                    checkValues(false)
                                    if (e.target.value.length > 0) {  
                                        setLastNameCheck(true); 
                                        checkValues(true)
                                        if (nameisValid(e.target.value)) {
                                            setMembershipInfo({
                                                ...membershipInfo,
                                                lastName: {
                                                    value: e.target.value,
                                                    error: INVALID_NAME_FORMAT,
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
                            <InputHeader for="dob">Date of Birth</InputHeader>
                            <Input
                                type="text"
                                name="dob"
                                id="dob"
                                placeholder="MM/DD/YYYY"
                                autocomplete='bday'
                                onClick={() => checkValues()}
                                value={membershipInfo["dateofBirth"].value}
                                onChange={(e) => {
                                    checkValues()
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
                            <InputHeader for="zipcode">Zip Code</InputHeader>
                            <Input
                                type="text"
                                placeholder="00000"
                                name="zipcode"
                                autoComplete='postal-code'
                                value={membershipInfo["zipcode"].value}
                                onClick={() => checkValues()}
                                maxLength={5}
                                onChange={(e) => {
                                    checkValues()
                                    if (!e.target.value.match(/^\d+$/)) {
                                        setMembershipInfo({
                                            ...membershipInfo,
                                            zipcode: {
                                                value: e.target.value,
                                                error: ZIPCODE_ERROR,
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
                            <InputHeader for="mobile">Mobile Phone Number</InputHeader>
                            <Input
                                type="text"
                                placeholder="000-000-0000"
                                name="mobile"
                                id="mobile"
                                autoComplete='tel'
                               value={membershipInfo["mobile"].value}
                                
                                maxLength={maxlength}
                                onSelect = {(e) =>{
                                    setMaxLength(16)
                                    let input = e.target.value.replace(/\s+/g,'');
                                    setMembershipInfo({
                                        ...membershipInfo,
                                        mobile: {
                                            value: e.target.value.replace(/\D/g,'').replace(/^(\d{3})(\d{3})(\d{4})$/,'$1-$2-$3'),
                                            error: null,
                                        },
                                    });

                                }}
                                onChange={(e) => {
                                    setMaxLength(12)
                                   let input = e.target.value.replace(/\s+/g,'');
                                    if (input.length > 0 && input.length<=12) {
                                        if (
                                            !mobileNumberIsValid(input)
                                        ) {
                                            setMembershipInfo({
                                                ...membershipInfo,
                                                mobile: {
                                                    value: input,
                                                    error: MOBILE_ERROR,
                                                },
                                            });
                                        } else {
                                            
                                            if (input.length === 3 && input.length<=12) {
                                    
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
                                            } else if (input.length === 7 && input.length<=12) {
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
                                    } else  if(input.length<=12){
                                        setMembershipInfo({
                                            ...membershipInfo,
                                            mobile: {
                                                value: input,
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
                                name="email"
                                autocomplete='email'
                                onClick={() => checkValues()}
                                placeholder="you@domain.com"
                                value={membershipInfo["email"].value}
                                onChange={(e) => {
                                    checkValues()
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
                                onClick={() => checkValues()}
                                value={membershipInfo["cEmail"].value}
                                onChange={(e) => {
                                    checkValues()
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
                                onClick={ ()  => checkValues()}
                                value={membershipInfo["checked"].value}
                                onChange={(e) => {
                                    checkValues(e.target.checked)
                                    handleMemberInfo(e, "checked");
                                }}
                                error={membershipInfo["checked"].error}
                            />
                            <TermsInfo>
                                I acknowledge the{" "}
                                <TermsLink href="https://healthfirst.org/terms-of-use" target="_blank" onClick={() =>  segment("/terms-of-use", "Terms of Use", "Terms of Use", "link","bottom", "", "registration")}>Terms of Use</TermsLink>
                            </TermsInfo>
                        </CheckBoxWrapper>
                        {membershipInfo["checked"].error && (
                            <InputErrorMsg>
                                {membershipInfo["checked"].error}
                            </InputErrorMsg>
                        )}
                    </FormGrid>
                    {grVersion === 'V2' && <RecaptchaV2 setV2Response={setGRecaptchaResponseV2} formSubmitted={formSubmissions}/>}
                    <FormButtonWrapper>
                    {!memberRegister.loading ? (
                        <ContinueButton
                        variant={variant}
                        onClick={() => variant==="primary"? handleClick(true):handleClick(false)}
                        >
                            Continue
                        </ContinueButton>
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


const ContinueButton = styled(StyledButton)`
color:#ffffff;
background-color: ${({ variant }) =>variant === "primary" ? "#3e7128" : "#D3D3D3"};
        &:hover {
            background-color: ${({ variant }) =>variant === "primary" ? "#3e7128" : "#D3D3D3"};
        }

`;

