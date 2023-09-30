import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { requestForgotUsername } from "../../../store/actions";
import { dobIsValid, emailIsValid } from "../../../utils/formValidation";
import { Container, ErrorMessage, Footer, FooterMenuWrapper, Form, InputText, InputTextIcon, InputTextWrapper, InputWrapper, LabelText, LabelWrapper, LanguageSelectionWrapper, Logo, LogoWrapper, SubmitButton, Wrapper } from "../login";
import FooterMenu from "../login/footerMenu";
import LanguageSelection from "../login/languageSelection";
import { ProgressWrapper, Spinner } from "../styles";
import VerifyAccount from "./verifyAccount";
import {RecaptchaV3, RecaptchaV2 }from "../../auth/recaptcha/recaptcha";
import {useToaster} from "../../../hooks/useToaster";
import { handleSegmentClick } from "../../../libs/segment";
import { RESET_FORGOT_USERNAME, RESET_MFA_CODE, RESET_MFA_VERIFY } from "../../../store/actions/actionTypes";

const DOB_ERROR = 'Your Date of Birth is not correct. Please enter it again.';
const EMAIL_ERROR = 'Invalid email address.';
const USER_NOT_FOUND_ERROR = 'Sorry, we do not recognize the email and/or date of birth you have entered. Please try again. If you need assistance, please call member services.';
const USER_MUTIPLE_MATCHES_ERROR = 'Multiple matches with the same email and date of birth. Please try again. If you need assistance, please call member services.';
const FORGOT_USERNAME_STEP = 'forgotUsername';
const VERIFY_STEP = 'Verify';
const DISPLAY_USERNAME_STEP = 'displayUsername';


const ForgotUsernamePage = () => {

    const history = useHistory();
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [emailError, setEmailError] = useState('');
    const [dateOfBirthError, setDateOfBirthError] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [step, setStep] = useState(FORGOT_USERNAME_STEP);
    const [mfaUnverifiedToken, setmfaUnverifiedToken] = useState();
    const [gRecaptchaResponse, setGRecaptchaResponse] = useState();
    const [gRecaptchaResponseV2, setGRecaptchaResponseV2] = useState();
    const [grVersion, setGrVersion] = useState('V3');
    const [username, setUsername] = useState('');
    const forgotUsername = useSelector((state) => state.forgotUsername);
    const {addToast} = useToaster();
    const [formSubmissions, setFormSubmissions] = useState(0);
    //mfaVerifiedToken will comes from selector
    const mfaVerify = useSelector((state) => state.mfaVerify);
    let mfaVerifiedToken = mfaVerify.data?.mfaAuthorization;

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch({type: RESET_FORGOT_USERNAME});
            dispatch({type: RESET_MFA_VERIFY});
            dispatch({type: RESET_MFA_CODE});
            setStep(FORGOT_USERNAME_STEP);
        }
    }, []);

    useEffect(() => {
        setIsValid( email.length > 0 && dateOfBirth.length === 5 );
    }, [email, dateOfBirth]);
    
    useEffect(() => {
        if(mfaVerifiedToken){
            setStep(DISPLAY_USERNAME_STEP);
            authorizedSubmit(mfaVerifiedToken);
        }
        else{
            setStep(FORGOT_USERNAME_STEP);
        }
    }, [mfaVerifiedToken]);

    useEffect(() => {
        if(forgotUsername.loading) return;

        if(step === FORGOT_USERNAME_STEP){
            setFormSubmissions(formSubmissions + 1);
            if(forgotUsername.error?.data?.message?.includes('recaptcha')){
                setGrVersion('V2');
            }
            else{
                switch(forgotUsername?.data?.data?.errorCode){
                    case 1004: 
                        setmfaUnverifiedToken(forgotUsername.data?.data?.errorData?.mfaToken);
                        setStep(VERIFY_STEP);
                        return;
                    case 1010:
                        setEmailError(EMAIL_ERROR);
                        return;
                    case 1011: 
                        addToast({
                            toasterTop:'.35',
                            timeout:5000,
                            notificationText:USER_NOT_FOUND_ERROR,
                            notificationType:'error',
                            notificationLink: 'https://healthfirst.org/contact',
                            notificationLinkText: 'call member services'
                        })
                        return;
                    case 1012: 
                        addToast({
                            toasterTop:'.35',
                            timeout:5000,
                            notificationText:USER_MUTIPLE_MATCHES_ERROR,
                            notificationType:'error',
                            notificationLink: 'https://healthfirst.org/contact',
                            notificationLinkText: 'call member services'
                        });
                        return;
                    default:
                        return; 
                }
            }
        }
        else{
            setUsername(forgotUsername.data?.data?.username);
        }
    }, [forgotUsername]);  

    const formatDob = e => {
        setDateOfBirthError('');
        let cleaned = e.target.value.replace(/\D/g, '');
        if(cleaned.length > 2){
            setDateOfBirth(`${cleaned.slice(0,2)}/${cleaned.slice(2,4)}`);
        }
        else{
            setDateOfBirth(cleaned);
        }
    };

    const validateFields = () => {
        if(!emailIsValid(email)){
            setEmailError(EMAIL_ERROR); 
            return false;
        }
        else if(dateOfBirth.length < 5 || !dobIsValid(dateOfBirth)){
            setDateOfBirthError(DOB_ERROR);
            return false; 
        }
        return true;
    }

    const createPayload = () => {
        let payload = {
            email: email,
            DOB: dateOfBirth,
        };
        payload[`g-recaptcha-response${grVersion === 'V3' ? '' : '-v2'}`] = grVersion==='V3' ? gRecaptchaResponse : gRecaptchaResponseV2;
        return payload;
    };

    const submitForm = (e) => {
        if(e){
            e.preventDefault();
        }
        setEmailError('');
        setDateOfBirthError('');
        if(validateFields()){
            handleSegmentClick(null, "Verify", "Forgot Username Credentials Submission", "button", "bottom",  "", "registration");
            dispatch(requestForgotUsername(createPayload()));
        }   
    }

    const authorizedSubmit = (authorizedMfaToken) => {
        dispatch(requestForgotUsername(createPayload(), authorizedMfaToken));
    }

    const renderSwitch = (step) => {
        switch(step){
            case FORGOT_USERNAME_STEP : case DISPLAY_USERNAME_STEP: 
                return(
                    <>
                        <RecaptchaV3 setV3Response={setGRecaptchaResponse} formSubmitted={formSubmissions}/>
                        {step === FORGOT_USERNAME_STEP && 
                            <ForgotCredentialForm onSubmit={e => submitForm(e)}>
                                <AuthFormBackLink onClick={() => {history.push('/login')}}>
                                    <i className="fas fa-arrow-left"></i> BACK
                                </AuthFormBackLink>
                                <AuthFormHeader>Retrieve Username</AuthFormHeader>
                                <AuthFormSubtitle>A retrieval code will be sent to you</AuthFormSubtitle>
                                <InputWrapper>
                                    <LabelWrapper>
                                        <LabelText htmlFor="email" name="email">Email</LabelText>
                                    </LabelWrapper>
                                    <InputTextWrapper error={emailError}>
                                        <InputTextIcon src="/react/images/icn-email.svg"/>
                                        <InputText id="email" type="text" onChange={e => setEmail(e.target.value)} name="email" defaultValue={email} placeholder="Enter Email Address" />
                                        <EmailToolTipIcon>
                                            <EmailToolTip className="emailToolTip">The email you used during registration.</EmailToolTip>
                                        </EmailToolTipIcon>
                                    </InputTextWrapper>
                                </InputWrapper>
                                {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
                                <InputWrapper>
                                    <LabelWrapper>
                                        <LabelText htmlFor="dateOfBirth" name="dateOfBirth">Date of Birth</LabelText>
                                    </LabelWrapper>
                                    <InputTextWrapper error={dateOfBirthError}>
                                        <InputTextIcon src="/react/images/icn-calendar.svg"/>
                                        <InputText id="dateOfBirth" value={dateOfBirth} onChange={formatDob} type="text" name="dateOfBirth" placeholder="MM/DD" />
                                    </InputTextWrapper>
                                </InputWrapper>
                                {dateOfBirthError && <ErrorMessage>{dateOfBirthError}</ErrorMessage>}
                                <InputWrapper style={{height: '78px'}}>
                                    {grVersion === 'V2' && <RecaptchaV2 setV2Response={setGRecaptchaResponseV2} formSubmitted={formSubmissions}/>}
                                </InputWrapper>
                                {!forgotUsername.loading ? 
                                    <AuthSubmitButton disabled={!isValid}>Verify</AuthSubmitButton>
                                    :
                                    <ProgressWrapper style={{"display": "flex"}}>
                                        <Spinner />
                                    </ProgressWrapper>
                                }
                            </ForgotCredentialForm>
                        }
                        {step === DISPLAY_USERNAME_STEP && 
                            <ForgotCredentialCard>
                                <DisplayUsername>
                                    <UsernameContainer>
                                        {username ? <>
                                            <UsernameTitle>Your Username</UsernameTitle>
                                            <UserNameSpan>
                                                {username}
                                            </UserNameSpan>
                                        </> : <Spinner /> }  
                                    </UsernameContainer>
                                    <SubmitButton style={{"margin-top": "0"}}onClick={() => {history.push('/login')}}>Log In Now</SubmitButton>
                                </DisplayUsername>
                            </ForgotCredentialCard>
                        }
                    </>
                );
            case VERIFY_STEP: 
                return(
                    <VerifyAccount unauthorizedToken={mfaUnverifiedToken}></VerifyAccount>
                );  
            default: 
                return <></>
        }
    }

    return(
        <>
        <Wrapper>
            <LanguageSelectionWrapper>
                <LanguageSelection />
            </LanguageSelectionWrapper>
            <Container>
                <ForgotCredentialsLogoWrapper>
                    <AuthLogo src="/react/images/hf_logo_white.svg" onClick={() => history.push('login')}/>
                </ForgotCredentialsLogoWrapper>
                {renderSwitch(step)} 
                <Footer>
                    <FooterMenuWrapper>
                        <FooterMenu />
                    </FooterMenuWrapper>
                </Footer>
            </Container>
        </Wrapper>
        </>
    );

}

export const ForgotCredentialsLogoWrapper = styled(LogoWrapper)`
    margin-bottom: 50px;
`;

export const ForgotCredentialForm = styled(Form)`
    margin-top: 0px;
    padding-top: 16px;
`;

export const ForgotCredentialCard = styled.div`
background: #FFFFFF;
filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.10));
border-radius: 8px;
padding: 16px;
margin-top: 32px;
width: 320px;
`;

export const AuthLogo = styled(Logo)`
    height: 32px;
    margin-top: 35px;
`;

export const AuthFormBackLink = styled.a`
font-size: 14px;
font-weight: 500;
color: #474b55;
cursor: pointer;
`;

export const AuthFormHeader = styled.div`
color: #003863;
font-weight: 500;
font-size: 18px;
letter-spacing: 0;
line-height: 24px;
margin-bottom: 0.5rem!important;
text-align: center;
`;

export const AuthFormSubtitle = styled.div`
color: #474b55;
font-size: 16px;
font-weight: 300;
letter-spacing: 0;
line-height: 18px;
margin-bottom: 0.5rem!important;
text-align: center
`;

export const AuthSubmitButton = styled(SubmitButton)`
margin-top: 32px
`
const EmailToolTipIcon = styled.div`
position: absolute;
right: 29px;
top: 145px;
z-index: 3;
display: inline-block;
background: url(/react/images/ico-info.png) no-repeat center;
min-width: 25px;
min-height: 25px;
&:hover .emailToolTip {
    visibility: visible;
}
`; 
const EmailToolTip = styled.span`
visibility: hidden;
text-align: left;
padding: 10px;
position: absolute;
z-index: 1;
bottom: 130%;
margin-left: -155px;
min-width: 196px;
width: 196px;
background-color: #003863;
color: #fff;
border-radius: 4px;
width: 145px;
min-width: 145px;
margin-left: -111px;
text-align: center;
&:after{
    content: "";
    position: absolute;
    top: 100%;
    left: 85%;
    margin-left: -10px;
    border-width: 10px;
    border-style: solid;
    border-color: #003863 transparent transparent transparent;
}
`
const DisplayUsername = styled.div`
animation-duration: 1s;
animation-name: fadeInUp;
animation-fill-mode: both;
`;

const UsernameTitle = styled.div`
color: #003863;
font-weight: 500;
font-size: 18px;
letter-spacing: 0;
line-height: 24px;
text-align:center;
`;

const UserNameSpan = styled.span`
display: block !important;
font-size: 32px;
font-weight: 300;
text-align: center;
overflow-wrap: break-word;
`;

const UsernameContainer = styled.div`
margin-top:7.5rem;
margin-bottom:13.875rem;
`;
export default ForgotUsernamePage;
