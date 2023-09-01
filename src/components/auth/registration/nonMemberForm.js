import React, { useState ,useEffect} from "react";
import { emailIsValid , nameisValid,mobileNumberIsValid,patternSeparation} from "../../../utils/formValidation";
import {requestResetRegisterState} from '../../../store/actions'; 
import styled from "styled-components";
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
    Link,
    Header,
    Spinner,
    ProgressWrapper
} from "../styles";
import { useSelector, useDispatch } from "react-redux";
import {handleSegmentClick} from "../../../libs/segment"
import { requestRegister } from "../../../store/actions";
import { RecaptchaV2 ,RecaptchaV3} from "../recaptcha/recaptcha";
import { useToaster } from "../../../hooks/useToaster";
import useQuery from "../../../hooks/useQuery";
import { dobIsValid } from "../../../utils/formValidation";

const INCORRECT_DOB = 'Your Date of Birth is not correct. Please enter it again.';   
const FIRSTNAME_REQUIRED = 'First Name is Required'; 
const EMAILID_REQUIRED = 'Email is Required';  
const INVALID_MOBILE_NO = 'Mobile number should contain 10 Digits.';
const INVALID_EMAIL = '"Your email is not valid"';
const CONFIRM_EMAIL_REQUIRED = 'Confirm Email is Required. ';
const TERMS_OF_USE ='Please accept terms of use';
const CONFIRM_EMAIL_DOESNT_MATCH = 'Email and confirm email does not match'; 
const INVALID_NAME_FORMAT = 'Invalid Name Format';
const ERROR = "error"
const { MIX_REACT_REG_CONTACT_LINK } = process.env;

const WM_HEADER = "Online Registration";
const WM_SUB_HEADER = "Welcome to the Healthfirst Medicare registration portal.";
const WM_CENTER_INFO = "To start your Medicare Advantage plan enrollment application, enter the information below.";
const nonMemberForm = ({
    onBack,
    handleRegistrationWithId,
    isProceedTocrediantials,
}) => {
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

    let checkBoxStatus ;
    const dispatch = useDispatch();
    const nonMemberRegister = useSelector((state) => state.memberRegister);
    const [membershipInfo, setMembershipInfo] = useState(initialState);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [isError, setIsError] = useState(false);
    const accountInfo = { ...membershipInfo };
    const [isProceed, setIsProceed] = useState(false);
    const [maxlength,setMaxLength] = useState();
    const [gRecaptchaResponse, setGRecaptchaResponse] = useState();
    const [gRecaptchaResponseV2, setGRecaptchaResponseV2] = useState();
    const [grVersion, setGrVersion] = useState('V3');
    const [onBackKeyPressed,setBackKeyPressed]  = useState(false);
    const [isContinue,setIsContinue] = useState(false);
    const {addToast} = useToaster();
    const wmvalue = useQuery().get("wm")
    const [formSubmissions, setFormSubmissions] = useState(0);
    const [varient,setVarient] = useState("")
    const [ischecked,setIsChecked] = useState();
   

    const handleAccountInfo = (key, label, value) => {
        accountInfo[key] = {
            value: value,
            error: label,
        };
        if (accountInfo[key].error) {
            setIsError(true);
        }
    };

    useEffect(()=>{
        dispatch(requestResetRegisterState());
    },[])

    useEffect(() => {
        if(!nonMemberRegister.loading && isContinue){
            setFormSubmissions(formSubmissions + 1);
            if (nonMemberRegister?.data?.mfaToken != null) {
                isProceedTocrediantials(true);
            }else if(nonMemberRegister?.error?.message == "Failed recaptcha check"){
                setGrVersion("V2")
            }
            if(nonMemberRegister?.error?.message !== "Failed recaptcha check"){
                window.scrollTo(0,0);
            addToast({
                timeout:5000,
                notificationText:nonMemberRegister?.error?.message,
                notificationLink: MIX_REACT_REG_CONTACT_LINK,
                notificationLinkText: 'call member services',
                notificationType:ERROR,
                toasterTop:"6%"
            })
        }
        }
    }, [nonMemberRegister]);

    const checkValues = (checkBoxStatus) =>{
        if (
            accountInfo["firstName"].value.length >1 &&
            accountInfo["dateofBirth"].value.length >1 &&
            accountInfo["cEmail"].value.length >1 &&
            accountInfo["email"].value.length >1  &&
           ( (!accountInfo["checked"].value && checkBoxStatus) ||
            (accountInfo["checked"].value  && checkBoxStatus == undefined) )
            
        ){
            setVarient("primary")
        }else{
            setVarient("")
        }
    }

    const handleClick = (trigger) => {
        if(trigger){
            checkValues();
        for (const [key, value] of Object.entries(accountInfo)) {
            switch (key) {
                case "firstName":
                    if (value.value.length === 0) {
                        handleAccountInfo( key, FIRSTNAME_REQUIRED ,value.value);
                    }
                    break;

                case "dateofBirth":
                    if (!dobIsValid(value.value)) {
                        handleAccountInfo( key,INCORRECT_DOB,value.value);
                    }
                break;

                case "mobile":
                    
                 if((value.value.replace(/-/g, '') === '' || value.value.replace(/-/g, '').length < 10 ) && value.value.length > 0){
                        handleAccountInfo(
                            key,
                            INVALID_MOBILE_NO,
                            value.value
                        );
                    }
                    break;

                case "email":
                    if (value.value.length === 0) {
                        handleAccountInfo( key,EMAILID_REQUIRED ,value.value );
                    } else if (!emailIsValid(value.value)) {
                        handleAccountInfo( key,INVALID_EMAIL,value.value );
                    }
                    break;

                case "cEmail":
                    if (value.value.length === 0) {
                        handleAccountInfo( key, CONFIRM_EMAIL_REQUIRED,value.value );
                    } else if (accountInfo["email"].value !== value.value) {
                        handleAccountInfo( key, CONFIRM_EMAIL_DOESNT_MATCH,value.value );
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
                accountInfo["firstName"].error === null &&
                accountInfo["dateofBirth"].error === null &&
                accountInfo["mobile"].error === null &&
                accountInfo["cEmail"].error === null &&
                accountInfo["checked"].error === null
            ) {
             
                const data = {
                    memberType: "NEW",
                    firstName: accountInfo.firstName.value,
                    DOB: accountInfo.dateofBirth.value,
                    mobile: accountInfo.mobile.value,
                    email: accountInfo.cEmail.value,
                    agreement: true,
                    wm : wmvalue? true : false 
                };

                if(grVersion ==="V3"){
                    data["g-recaptcha-response"] = gRecaptchaResponse
                }else{
                    data["g-recaptcha-response-v2"] = gRecaptchaResponseV2
                }

                setIsProceed(true);
                dispatch(requestRegister(data, ""));
                handleSegmentClick(null, "Continue", "Non Member Form Submission", "button", "bottom", "", 
                "registration");
                setIsContinue(true); 
            } else {
                setMembershipInfo(accountInfo);
                setSubmitClicked(true);
            }
        }
    };

    const handleMobileTextPaste = (e) =>{
        setMembershipInfo({
            ...membershipInfo,
            mobile: {
                value: patternSeparation(e,'###-###-####'),
                error: null,
            },
        });
    } 

    const handleKeyDown = (e) =>{
        if(e === 'Backspace'){
            setBackKeyPressed(true)
        }else{
            setBackKeyPressed(false)
        }
    }


    return (
        <> 
         <RecaptchaV3 setV3Response={setGRecaptchaResponse} formSubmitted={formSubmissions}/>
            <NonMemberFormHeader>{!wmvalue ? <>Register Your Account</> : WM_HEADER}</NonMemberFormHeader>
            <SubHeader>
                {!wmvalue ? "Please enter the same information you provided during enrollment." : WM_SUB_HEADER}
            </SubHeader>
            <FormGrid>
                <AdditionalInfo>
                    <CenterInfo>
                        Are you currently an active Healthfirst member? &nbsp;
                        <Link role="button" onClick={handleRegistrationWithId}>
                            Register with your Member ID
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
                        onSelect={(e) =>{
                            checkValues()
                        }}
                        onChange={(e) => {
                            checkValues();
                            if (e.target.value.length > 0) {
                                if (nameisValid(e.target.value)) {
                                    setMembershipInfo({
                                        ...membershipInfo,
                                        firstName: {
                                            value: e.target.value,
                                            error: INVALID_NAME_FORMAT,
                                        },
                                    });
                                } else {
                                    if (submitClicked) {
                                        setMembershipInfo({
                                            ...membershipInfo,
                                            firstName: {
                                                value: e.target.value,
                                                error: null,
                                            },
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
                    <InputHeader htmlFor="dob" name="dob">Date of Birth </InputHeader>
                    <Input
                        type="text"
                        name="dob"
                        data-type="dob"
                        autocomplete='bday'
                        placeholder="MM/DD"
                        onClick={() => checkValues()}
                        value={membershipInfo["dateofBirth"].value}
                        onSelect={(e) =>{
                            checkValues()
                        }}
                        onChange={(e) => {
                            checkValues();
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
                                        input.substring(2, 4);
                                }
                                if (submitClicked) {
                                    setMembershipInfo({
                                        ...membershipInfo,
                                        dateofBirth: {
                                            value: input,
                                            error: null,
                                        },
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
                <AdditionalInfo>
                    <ItalicFont>
                        You will need to verify your information via email or
                        text message.
                    </ItalicFont>
                </AdditionalInfo>
                <InputWrapper>
                    <InputHeader htmlFor="mobile">Mobile Phone Number</InputHeader>
                    <Input
                        type="text"
                        name="mobile"
                        id="mobile"
                        autoComplete='tel'
                        placeholder="000-000-0000"
                        onClick={() => checkValues()}
                        value={membershipInfo["mobile"].value}
                        onKeyDown={(e) => handleKeyDown(e.key)}
                        onPaste={ (e) => handleMobileTextPaste(e.clipboardData.getData('text/plain'))}
                        maxLength={maxlength}
                        onSelect = {(e) =>{
                            checkValues();
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
                            checkValues();
                            let input = e.target.value.replace(/\s+/g,'');
                            if (e.target.value.length > 0  && !isNaN(e.target.value)  || e.target.value.includes('-') && input.length<=12 ) {
                                if (!mobileNumberIsValid(e.target.value)) {
                                    setMembershipInfo({
                                        ...membershipInfo,
                                        mobile: {
                                            value: e.target.value,
                                            error: "Enter valid number",
                                        },
                                    });
                                } else {
                                   
                                    if (input.length === 3 && input.length<=12 && input.length<=12) {
                                        if(!onBackKeyPressed){
                                        setMembershipInfo({
                                            ...membershipInfo,
                                            mobile: {
                                                value: input.replace(
                                                    /^(\d{3})$/,
                                                    "  $1-  "
                                                ),
                                                error: null,
                                            },
                                        });
                                    }else{
                                        setMembershipInfo({
                                            ...membershipInfo,
                                            mobile: {
                                                value: input.replace(
                                                    "-",
                                                    " "
                                                ),
                                                error: null,
                                            },
                                        });
                                    }
                                    } else if (input.length === 7 && input.length<=12) {
                                       
                                        if(!onBackKeyPressed){
                                        setMembershipInfo({
                                            ...membershipInfo,
                                            mobile: {
                                                value: 
                                                input.replace(
                                                    /^((\d{3})-(\d{3}))$/,
                                                    " $1-"
                                                )
                                                ,
                                                error: null,
                                            },
                                        });
                                    }else{
                                        setMembershipInfo({
                                            ...membershipInfo,
                                            mobile: {
                                                value: 
                                                input.replace(
                                                    /^(\d{3})$/,
                                                    " $1-  "
                                                )
                                                ,
                                                error: null,
                                            },
                                        });
                                    }
                                    }
                                     else if(input.length<=12) {
                                        if (submitClicked) {
                                            setMembershipInfo({
                                                ...membershipInfo,
                                                mobile: {
                                                    value: e.target.value,
                                                    error: null,
                                                },
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
                            } else if(!isNaN(e.target.value)|| e.target.value.includes('-') && input.length<=12 ) {
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
                        name="email"
                        autocomplete='email'
                        placeholder="you@domain.com"
                        onClick={() => checkValues()}
                        value={membershipInfo["email"].value}
                        onSelect={(e) =>{
                            checkValues()
                        }}
                        onChange={(e) => {
                            checkValues();
                            if (submitClicked) {
                                setMembershipInfo({
                                    ...membershipInfo,
                                    email: {
                                        value: e.target.value,
                                        error: null,
                                    },
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
                        onClick={() => checkValues()}
                        value={membershipInfo["cEmail"].value}
                        onSelect={(e) =>{
                            checkValues()
                        }}
                        onChange={(e) => {
                            checkValues();
                           
                            if (submitClicked) {
                                setMembershipInfo({
                                    ...membershipInfo,
                                    cEmail: {
                                        value: e.target.value,
                                        error: null,
                                    },
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
                        onClick={ () => setIsChecked(!(membershipInfo["checked"].value))}
                        value={membershipInfo["checked"].value}
                        onSelect={(e) =>{
                            checkValues()
                        }}
                        onChange={(e) => {
                            
                           // setIsChecked(e.target.checked);
                            checkValues(e.target.checked)
                         
                            if (submitClicked) {
                                
                                setMembershipInfo({
                                    ...membershipInfo,
                                    checked: {
                                        value: e.target.checked,
                                        error: null,
                                    },
                                });
                                setSubmitClicked(false);
                            } else {
                                
                                setMembershipInfo({
                                    ...membershipInfo,
                                    checked: {
                                        value: e.target.checked,
                                        error: null,
                                    },
                                });
                            }
                        }}
                        error={membershipInfo["checked"].error}
                    />
                    <TermsInfo>
                        I acknowledge the{" "}
                        <TermsLink onClick={() =>  handleSegmentClick("/terms-of-use", TERMS_OF_USE, TERMS_OF_USE, "link", "bottom", "", "registration")} href="https://healthfirst.org/terms-of-use" target="_blank">Terms of Use</TermsLink>
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
            {!nonMemberRegister.loading ? (
                <ContinueButton  variant={varient}
                onClick={() => varient==="primary"? handleClick(true):handleClick(false)}
                >
                    Continue
                </ContinueButton>): (
                                    <ProgressWrapper>
                                        <Spinner width="20px" height="20px" />
                                    </ProgressWrapper>
                                )
                                }
            </FormButtonWrapper>
        </>
    );
};
export default nonMemberForm;

const NonMemberFormHeader = styled(Header)`
    margin-top:12px;
`;

const ContinueButton = styled(StyledButton)`
color:#ffffff;
background-color: ${({ variant }) =>variant === "primary" ? "#3e7128" : "#D3D3D3"};
        &:hover {
            background-color: ${({ variant }) =>variant === "primary" ? "#3e7128" : "#D3D3D3"};
        }

`;