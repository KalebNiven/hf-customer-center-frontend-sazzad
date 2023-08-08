import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import LanguageSelection from './languageSelection'
import FooterMenu from './footerMenu'
import styled, { keyframes } from 'styled-components';
import { useOktaAuth } from '@okta/okta-react';
import { handleSegmentClick } from '../../../libs/segment';
import { useSelector } from 'react-redux';

const FORGOT_USERNAME ="ForgotUserName";
const FORGOT_PASSWORD   ="ForgotPassword";
const CREATE_AN_ACCOUNT ="CreateAnAccount Link";
const HEALTH_FIRST_LINK ="HealthFirst Link"

const Login = () => {
    const [state, setState] = useState({ username: "", password: "", saveUsername: false, error: "", loading: false })
    const { username, password, saveUsername, error, loading } = state;
    const [sessionToken, setSessionToken] = useState();
    const { authState, oktaAuth } = useOktaAuth();
    const history = useHistory();
    const forgotUsername = useSelector((state) => state.forgotUsername);

    // autofill username if exist
    useEffect(() => {
        const usernameRetrieved = forgotUsername?.data?.data?.username;
        if(usernameRetrieved) {
            setState({ ...state, username: usernameRetrieved });
            return;
        }
        const username = localStorage.getItem('username');
        if(username) setState({ ...state, username, saveUsername: true });
        let fromUrl = sessionStorage.getItem("from") 
        if(fromUrl != null){
            const url  = new URL(fromUrl)
            const path  =  new URL(window.location.href)
            const searchParam = new URLSearchParams(window.location.search)
            if(path.search !=""){
                window.history.pushState(null,null,path.href);
                sessionStorage.setItem("from",path.origin+searchParam.get("redirectUrl"))
            } else{
                let redirectUrl = window.location.origin+ "/login?redirectUrl=" + url.pathname.replace("/","%2F")
                window.history.pushState(null,null,redirectUrl);
            }
        }
    }, [])

    const handleChange = (e) => {
        if(loading) return;
        const value = e.target.value;
        const type = e.target.dataset.type;
        if(type === "saveUsername") {
            setState({ ...state, saveUsername: e.target.checked, error: "" })
        } else {
            setState({ ...state, [type]: value.replace(/\s/g, ''), error: "" })
        }
    }

    const handleSaveUsername = (state) => {
        // if checkbox is selected - save username, else remove username from localStorage
        if(state.saveUsername) {
            localStorage.setItem('username', state.username);
        } else {
            localStorage.removeItem('username');
        }
    }

    const handleAuthorization = async ({ username, password }) => {
        return oktaAuth.signInWithCredentials({ username, password })
        .then(res => {
            //check if the account is locked out
            if(res.data.status==='LOCKED_OUT'){
                return Promise.resolve({error:{message: 'Account is locked out', status: 'LOCKED_OUT', errorCode: 'E0000004a'}})
            }
            const sessionToken = res.sessionToken;
            setSessionToken(sessionToken);
            // sessionToken is a one-use token, so make sure this is only called once
            return oktaAuth.signInWithRedirect({ sessionToken });
        })
        .catch(err => {
            console.log('Error caught: ', err)
            return { error: err };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(loading) return;
        setState({ ...state, loading: true })
        handleSaveUsername(state);
        handleSegmentClick("/home", "Login", "Login Form Submission", "button", "bottom",  "", "registration");
        handleAuthorization({ username, password }).then((data) => {
            if(data.error) {
                switch(data.error.errorCode) {
                    case "E0000004":
                        return setState({ ...state, password: "", error: "Your username and password do not match.", loading: false });
                    case "E0000004a":
                        return setState({ ...state, password: "", error: "Your account has been locked due to too many failed attempts. Please reset your password.", loading: false });
                    default:
                        return setState({ ...state, error: data.error.errorSummary, loading: false });
                }
            }
        }).catch((err) => {
            setState({ ...state, loading: false })
            console.log('Error caught: ', err)
        })
    }

    // Hide the form while sessionToken is being converted into id/access tokens
    if (sessionToken) return null;

    // Redirect to home if user already authenticated
    if (authState?.isAuthenticated) history.push('/home')

    const handleHealthFirstLogoClick = () =>{
        history.push('/login')
    }


    return (
        <Wrapper>
            <LanguageSelectionWrapper>
                <LanguageSelection />
            </LanguageSelectionWrapper>
            <Container>
                <LogoWrapper>
                    <Logo onClick={handleHealthFirstLogoClick} src="/react/images/logo-white.svg" />
                </LogoWrapper>
                <Form onSubmit={e => handleSubmit(e)}>
                    <InputWrapper>
                        <LabelWrapper>
                            <LabelText htmlFor="username" name="username">Username</LabelText>
                            <LabelLink onClick={() => handleSegmentClick('/forgotUsername', 'Forgot Username', 'Redirect to forgot username page', 'link', 'right',  "", "registration")} to="/forgotUsername">Forgot Username?</LabelLink>
                        </LabelWrapper>
                        <InputTextWrapper error={error}>
                            <InputTextIcon src="/react/images/user-icon-grey.svg" />
                            <InputText id="username" autoComplete='username' placeholder="Enter Username" type="text" data-type="username" value={username} onChange={e => handleChange(e)} error={error} disabled={loading} />
                        </InputTextWrapper>
                    </InputWrapper>
                    <InputWrapper>
                        <LabelWrapper>
                            <LabelText htmlFor="password" name="password">Password</LabelText>
                            <LabelLink onClick={() => handleSegmentClick('/forgotPassword','Forgot Password', 'Redirect to Forgot Password page', 'link','right',  "", "registration")} to="/forgotPassword">Forgot Password?</LabelLink>
                        </LabelWrapper>
                        <InputTextWrapper error={error}>
                            <InputTextIcon src="/react/images/lock-icon-grey.svg" />
                            <InputText id="password" placeholder="Enter Password" type="password" data-type="password" value={password} onChange={e => handleChange(e)} error={error} disabled={loading} />
                        </InputTextWrapper>
                    </InputWrapper>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <CheckBoxWrapper error={error}>
                        <CheckBox id="saveUsername" type="checkbox" data-type="saveUsername" checked={saveUsername} onChange={e => handleChange(e)} disabled={loading} />
                        <CheckBoxLabel htmlFor="saveUsername" name="save username">Remember Username</CheckBoxLabel>
                    </CheckBoxWrapper>
                    <ControlButtonsWrapper>
                        <SubmitButton variant="primary" isMobile={true} type="submit" disabled={!username || !password} isLoading={loading}>{loading ? <Spinner width="20px" height="20px" /> : "Login"}</SubmitButton>
                    </ControlButtonsWrapper>
                </Form>
                <Footer>
                    <Paragraph>Don't have an account? <LinkTo onClick={() => handleSegmentClick('/register', 'Create an account', 'Redirect to Create Account page', 'link','bottom',  "", "registration")} to="/register">Create an account</LinkTo></Paragraph>
                    <Paragraph>Interested in becoming a member?</Paragraph>
                    <Paragraph margin="0"><a onClick={() => handleSegmentClick('https://healthfirst.org', 'Visit Healthfirst.org', 'Redirect Healthfirst home page', 'link', 'bottom',  "", "registration")} href="https://healthfirst.org">Visit Healthfirst.org</a> to find out how.</Paragraph>
                    <FooterMenuWrapper>
                        <FooterMenu />
                    </FooterMenuWrapper>
                </Footer>
            </Container>
        </Wrapper>
    )
}

export const Wrapper = styled.div`
    display: flex;
   justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url('/react/images/auth-background.png');
    background-position: center;
    background-repeat: repeat;
    background-size: contain;
    position: relative;
`;

export const LanguageSelectionWrapper = styled.div`
    position: absolute;
    right: 20px;
    top: 20px;
`;

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  cursor:pointer;
`;

export const Logo = styled.img`
  
`;

export const Form = styled.form`
    background: #FFFFFF;
    filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.23));
    border-radius: 8px;
    padding: 0px 16px 16px 16px;
    margin-top: 42px;
    width: 320px;
`;

export const InputWrapper = styled.div`
  margin-top: 24px;
`;

export const LabelWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const LabelText = styled.label`
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    color: #474B55;
    padding: 0;
`;

export const LabelLink = styled(Link)`
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    color: #3E7128;
`;

export const InputTextWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 8px 12px 8px 10px;
    background: #FFFFFF;
    border: 1px solid #A8ABAC;
    border-radius: 4px;
    width: 100%;
    ${props => props.error && "border-color: #AD122A"}
`;

export const InputTextIcon = styled.img`
    margin-right: 5px;
`;

export const InputText = styled.input`
    background: #FFFFFF;
    width: 100%;
    border: none;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    color: #474B55;
    ${props => props.error && "color: #AD122A;"}
    &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
    };
`;

export const ErrorMessage = styled.span`
    font-style: normal;
    font-weight: 300;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.4px;
    color: #AD122A;
`;

export const CheckBoxWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-top: ${props => props.error ? "0" : "20px"};
`;

export const CheckBox = styled.input`
    background: #FFFFFF;
    border: 1px solid #A8ABAC;
    border-radius: 4px;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    cursor: pointer;
`;

export const CheckBoxLabel = styled.label`
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    color: #474B55;
    user-select: none;
`;

export const ControlButtonsWrapper = styled.div`
  margin-top: 32px;
`;

export const SubmitButton = styled.button`
    padding: 8px 16px;
    background: #3E7128;
    border: none;
    border-radius: 4px;
    width: 100%;
    font-weight: 600;
    color: #FFFFFF;

    &:hover {
        ${props => (!props.disabled && !props.isLoading) && "background: #517f3d"};
    };

    ${
        props => props.disabled &&
        `color: #757575; background: #D8D8D8;`
    };
`;

export const FooterMenuWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 24px;
`;

export const Footer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
`;

export const LinkTo = styled(Link)`
    &:hover {
        text-decoration: underline;
    }
`;

export const Paragraph = styled.p`
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    text-align: center;
    color: #FFFFFF;
    margin-top: 16px;
    ${props => props.margin && `margin: ${props.margin}`};

    & > a {
        font-weight: 700;
        color: #FFFFFF;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
`;

const Spinner = styled.div`
  text-align: center;
  margin: auto;
  border: .2em solid #e6e6e6;
  border-top: .2em solid #4b6f32;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation-name: ${keyframes`from {transform: rotate(0deg);} to {transform: rotate(360deg);}`};
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;

export default Login
