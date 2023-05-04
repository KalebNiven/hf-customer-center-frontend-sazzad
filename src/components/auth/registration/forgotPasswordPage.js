import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { requestForgotPassword, requestMFAFactors } from "../../../store/actions";
import { dobIsValid, passwordIsValid } from "../../../utils/formValidation";
import { Container, ErrorMessage, Footer, FooterMenuWrapper, Form, InputText, InputTextIcon, InputTextWrapper, InputWrapper, LabelText, LabelWrapper, LanguageSelectionWrapper, Logo, LogoWrapper, SubmitButton, Wrapper } from "../login";
import { ProgressWrapper, Spinner } from "../styles";
import FooterMenu from "../login/footerMenu";
import LanguageSelection from "../login/languageSelection";
import VerifyAccount from "./verifyAccount";
import {RecaptchaV3, RecaptchaV2 }from "../recaptcha/recaptcha";
import { requestSetPassword } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { AuthFormBackLink, AuthFormHeader, AuthFormSubtitle, AuthLogo, AuthSubmitButton, ForgotCredentialForm, ForgotCredentialsLogoWrapper } from "./forgotUsernamePage";
import {useToaster} from "../../../hooks/useToaster";
import { RESET_FORGOT_PASSWORD, RESET_MFA_CODE, RESET_MFA_FACTORS, RESET_MFA_VERIFY, RESET_SET_PASSWORD } from "../../../store/actions/actionTypes";
import { handleSegmentClick } from "../../../libs/segment";

const DOB_ERROR = 'Your Date of Birth is not correct. Please enter it again.';
const PASSWORD_FIELD_EMPTY_ERROR = 'Please enter a valid new password.';
const PASSWORD_CONFIRMATION_EMPTY_ERROR = 'Enter password confirmation';
const PASSWORD_LENGTH_ERROR = 'Please enter at least 9 characters.';
const PASSWORD_REQUIREMENTS_ERROR = 'Password requirements were not met.';
const USERNAME_LENGTH_ERROR = 'The username may not be greater than 32 characters.';
const BAD_REQUEST_ERROR = 'Sorry, we do not recognize the username and/or date of birth you have entered. Please try again. If you need assistance, please call member services.';
const PASSWORDS_NOT_MATCHING_ERROR ='Passwords do not match';
const NO_VERIFIED_CHANNELS_ERROR = "Sorry, it looks like you did't verify your email or phone. Please call member services for assistance";

const FORGOT_PASSWORD_STEP = 'forgotPassword';
const RESET_PASSWORD_STEP = 'resetPassword';
const VERIFY_STEP = 'verify';

const USERNAME_MAX_LENGTH = 32;
const PASSWORD_MIN_LENGTH = 9;
const FORMATTED_DOB_LENGTH = 5; 

const ForgotPasswordPage = () => {

    const history = useHistory();
    const [username, setUsername] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [dateOfBirthError, setDateOfBirthError] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [step, setStep] = useState(FORGOT_PASSWORD_STEP);
    const [mfaUnverifiedToken, setmfaUnverifiedToken] = useState();
    const [gRecaptchaResponse, setGRecaptchaResponse] = useState();
    const [gRecaptchaResponseV2, setGRecaptchaResponseV2] = useState();
    const [grVersion, setGrVersion] = useState('V3');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmedPasswordError, setConfirmedPasswordError] = useState('');
    const [formSubmissions, setFormSubmissions] = useState(0);

    const forgotPassword = useSelector((state) => state.forgotPassword);
    const mfaVerify = useSelector((state) => state.mfaVerify);
    const setPasswordRes = useSelector((state) => state.setPassword);
    const mfaFactors = useSelector((state) => state.mfaFactors);
    const mfaVerifiedToken = mfaVerify.data?.mfaAuthorization;
    const dispatch = useDispatch();
    const {addToast} = useToaster();

    useEffect(() => {
        return () => {
            dispatch({type: RESET_FORGOT_PASSWORD});
            dispatch({type: RESET_SET_PASSWORD});
            dispatch({type: RESET_MFA_VERIFY});
            dispatch({type: RESET_MFA_CODE});
            dispatch({type: RESET_MFA_FACTORS});
            setStep(FORGOT_PASSWORD_STEP);
        }
    }, []);

    useEffect(() => {
        if(step === FORGOT_PASSWORD_STEP){
            setIsValid( username.length > 0 && dateOfBirth.length === FORMATTED_DOB_LENGTH);
        }
    }, [username, dateOfBirth]);
    
    useEffect(() => {
        if(mfaVerifiedToken){
            setStep(RESET_PASSWORD_STEP);
        }
    }, [mfaVerifiedToken]);

    useEffect(() => {
        if(forgotPassword.loading) return;
        setFormSubmissions(formSubmissions + 1);
        if(forgotPassword.error?.data?.message?.includes('recaptcha')){
            setGrVersion('V2');
        }
        else if(forgotPassword.error?.status === 500){
            addToast({
                notificationText: BAD_REQUEST_ERROR,
                notificationType: 'error',
                timeout: 5000,
                notificationLink: 'https://healthfirst.org/contact',
                notificationLinkText: 'call member services'
            });
        }
        else{
            switch(forgotPassword.data?.data?.errorCode){
                case 1004: 
                    setmfaUnverifiedToken(forgotPassword.data?.data?.errorData?.mfaToken);
                    dispatch(requestMFAFactors(forgotPassword.data?.data?.errorData?.mfaToken));
                    // setStep(VERIFY_STEP);
                    break;
                case 1011: 
                    setDateOfBirthError(DOB_ERROR);
                    break;
                default:
                    break;
            }
        }
    }, [forgotPassword]);

    useEffect(() =>{
        if (!mfaFactors?.loading && mfaFactors?.data) {
            const hasVerfiedChannel = mfaFactors?.data?.channels.reduce((accumulator, channel) => {return accumulator || channel.verificationStatus}, false);
            if (!hasVerfiedChannel) {
                addToast({
                    notificationText: NO_VERIFIED_CHANNELS_ERROR,
                    notificationType: 'error',
                    timeout: 5000,
                    notificationLink: 'https://healthfirst.org/contact',
                    notificationLinkText: 'call member services'
                });
            }
            else setStep(VERIFY_STEP);
        }
    }, [mfaFactors]);

    useEffect(() => {
        if(setPasswordRes.loading) return;
        if(setPasswordRes.error?.status === 500){
            addToast({
                notificationText: BAD_REQUEST_ERROR,
                notificationType: 'error',
                timeout: 5000,
                notificationLink: 'https://healthfirst.org/contact',
                notificationLinkText: 'call member services'
            });
        }
        else if(setPasswordRes.data?.status === 200){
            addToast({
                notificationText: 'Password Reset, try logging in',
                notificationType: 'success',
                timeout: 5000
            });
            history.push('/login');
        }
    },[setPasswordRes]);

    const formatDob = e => {
        let cleaned = e.target.value.replace(/\D/g, '');
        if(cleaned.length > 2){
            setDateOfBirth(`${cleaned.slice(0,2)}/${cleaned.slice(2,4)}`);
        }
        else{
            setDateOfBirth(cleaned);
        }
    };

    const validateFields = () => {
        if(dateOfBirth.length < 5 || !dobIsValid(dateOfBirth)){
            setDateOfBirthError(DOB_ERROR);
            return false; 
        }
        if(username.length > USERNAME_MAX_LENGTH){
            setUsernameError(USERNAME_LENGTH_ERROR);
            return false;
        }
        else return true;
    }

    const validatePasswordReset = (e) => {
        if(e) e.preventDefault();
        setPasswordError('');
        setConfirmedPasswordError('');
        let passwordValid = false; 
        let confirmPasswordValid = false; 

        if(password.length < 1){
            setPasswordError(PASSWORD_FIELD_EMPTY_ERROR);
        }
        else if(password.length < PASSWORD_MIN_LENGTH){
            setPasswordError(PASSWORD_LENGTH_ERROR);
        }
        else if(!passwordIsValid(password)){
            setPasswordError(PASSWORD_REQUIREMENTS_ERROR);
        }else{
            passwordValid = true;
        }

        if(confirmedPassword.length < 1){
            setConfirmedPasswordError(PASSWORD_CONFIRMATION_EMPTY_ERROR);
        }
        else if(confirmedPassword !== password){
            setConfirmedPasswordError(PASSWORDS_NOT_MATCHING_ERROR);
        }else{
            confirmPasswordValid = true;
        }
        setIsValid(passwordValid && confirmPasswordValid);
    }

    const handleResetPassword = async(e) => {
        if(e) e.preventDefault();
        let payload = {
            password: password,
            confirmPassword: confirmedPassword
        };
        handleSegmentClick(null, "Verify", "Change Password Form Submission", "button", "bottom");
        dispatch(requestSetPassword(payload, mfaVerifiedToken));
    }

    const submitForm = async (e) => {
        if(e) e.preventDefault();
        if(validateFields()){
            let payload = {
                username: username,
                DOB: dateOfBirth,
            }
            if(grVersion==="V3"){
                payload["g-recaptcha-response"] = gRecaptchaResponse
            }else if(grVersion==="V2"){
                payload["g-recaptcha-response-v2"] = gRecaptchaResponseV2
            }
            handleSegmentClick(null, "Verify", "Forgot Password Credentials Submission", "button", "bottom", "", "registration");
            dispatch(requestForgotPassword(payload));
        }   
    }

    const renderSwitch = (step) => {
        switch(step){
            case FORGOT_PASSWORD_STEP : case RESET_PASSWORD_STEP: 
                return(
                    <>
                        {step === FORGOT_PASSWORD_STEP && 
                            <ForgotCredentialForm onSubmit={e => submitForm(e)}>
                                <RecaptchaV3 setV3Response={setGRecaptchaResponse} formSubmitted={formSubmissions}/>
                                <AuthFormBackLink href='/login'>
                                    <i className="fas fa-arrow-left"></i> BACK
                                </AuthFormBackLink>
                                <AuthFormHeader>Reset Password</AuthFormHeader>
                                <AuthFormSubtitle>A reset code will be sent to you</AuthFormSubtitle>
                                <InputWrapper>
                                    <LabelWrapper>
                                        <LabelText htmlFor="username" name="username">Username</LabelText>
                                    </LabelWrapper>
                                    <InputTextWrapper error={usernameError}>
                                        <InputTextIcon src="/react/images/icn-user-grey.svg"/>
                                        <InputText id="username" type="text" onChange={e => setUsername(e.target.value.replace(/\s/g, ''))} name="username" defaultValue={username} value={username} placeholder="" />
                                    </InputTextWrapper>
                                </InputWrapper>
                                {usernameError && <ErrorMessage>{usernameError}</ErrorMessage>}
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
                                    {grVersion === 'V2' && <RecaptchaV2 setV2Response={setGRecaptchaResponseV2} />}
                                </InputWrapper>
                                {!forgotPassword.loading && !mfaFactors.loading? 
                                    <AuthSubmitButton  disabled={!isValid}>Verify</AuthSubmitButton>
                                    :
                                    <ProgressWrapper style={{"display": "flex"}}>
                                        <Spinner />
                                    </ProgressWrapper>
                                }
                            </ForgotCredentialForm>
                        }
                        {step === RESET_PASSWORD_STEP && 
                            <ForgotCredentialForm onSubmit={e => handleResetPassword(e)}>
                                <AuthFormBackLink href='/login'>
                                    <i className="fas fa-arrow-left"></i> BACK
                                </AuthFormBackLink>
                                <AuthFormHeader>New Password</AuthFormHeader>
                                <InputWrapper>
                                    <LabelWrapper>
                                        <LabelText htmlFor="password" name="password">Password</LabelText>
                                    </LabelWrapper>
                                    <InputTextWrapper error={passwordError}>
                                        <InputTextIcon src="/react/images/lock-icon-grey.svg"/>
                                        <InputText id="password" type="password" onChange={e => setPassword(e.target.value)} onBlur={validatePasswordReset} name="password" defaultValue={password} placeholder="" />
                                        <PasswordToolTipIcon>
                                            <PasswordToolTip visible={passwordError.length < 1 ? 'hidden' : 'visible'} className="passwordToolTip">
                                            Must contain:
                                                <ul>
                                                    <li>- At least 9 characters</li>
                                                    <li>- 1 upper case letter</li>
                                                    <li>- 1 lower case letter</li>
                                                    <li>- 1 number</li>
                                                    <li>- 1 special character</li>
                                                    <li>- Should NOT contain part<br></br>&nbsp;&nbsp;&nbsp;of your username, first,<br></br>&nbsp;&nbsp;&nbsp;or last name</li>
                                                </ul>
                                            </PasswordToolTip>
                                        </PasswordToolTipIcon>
                                    </InputTextWrapper>
                                </InputWrapper>
                                {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
                                <InputWrapper>
                                    <LabelWrapper>
                                        <LabelText htmlFor="dateOfBirth" name="dateOfBirth">Confirm Password</LabelText>
                                    </LabelWrapper>
                                    <InputTextWrapper error={confirmedPasswordError}>
                                        <InputTextIcon src="/react/images/lock-icon-grey.svg"/>
                                        <InputText id="confirmedPassword" type="password" onChange={e => setConfirmedPassword(e.target.value)} onBlur={validatePasswordReset} name="confirmedPassword" defaultValue={confirmedPassword} placeholder="" />
                                    </InputTextWrapper>
                                </InputWrapper>
                                {confirmedPasswordError && <ErrorMessage>Passwords do not match.</ErrorMessage>}
                                {!setPasswordRes.loading ? 
                                    <AuthSubmitButton disabled={!isValid}>Verify</AuthSubmitButton>
                                    :
                                    <ProgressWrapper style={{"display": "flex"}}>
                                        <Spinner />
                                    </ProgressWrapper>
                                }
                            </ForgotCredentialForm>
                        }
                    </>
                );
            case VERIFY_STEP: 
                return(
                    <VerifyAccount unauthorizedToken={mfaUnverifiedToken}></VerifyAccount>
                );       
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

const PasswordToolTipIcon = styled.div`
position: absolute;
right: 29px;
top: 121px;
z-index: 3;
display: inline-block;
background: url(/img/ico-info.png) no-repeat center;
min-width: 25px;
min-height: 25px;
&:hover .passwordToolTip {
    visibility: visible;
}
`; 
const PasswordToolTip = styled.span`
visibility: ${props => props.visible};
text-align: left;
padding: 10px;
position: absolute;
z-index: 1;
bottom: 130%;
margin-left: -140px;
min-width: 180px;
width: 180px;
background-color: #003863;
color: #fff;
border-radius: 4px;
font-size: 12px;
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

export default ForgotPasswordPage;