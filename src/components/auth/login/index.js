import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import LanguageSelection from './languageSelection'
import FooterMenu from './footerMenu'
import styled, { keyframes } from 'styled-components';
import { useOktaAuth } from '@okta/okta-react';

const Login = () => {
    const [state, setState] = useState({ username: "", password: "", saveUsername: false, error: "", loading: false })
    const { username, password, saveUsername, error, loading } = state;
    const [sessionToken, setSessionToken] = useState();
    const { authState, oktaAuth } = useOktaAuth();
    const history = useHistory();

    // autofill username if exist
    useEffect(() => {
        const username = localStorage.getItem('username');
        if(username) setState({ ...state, username, saveUsername: true });
    }, [])

    const handleChange = (e) => {
        if(loading) return;
        const value = e.target.value;
        const type = e.target.dataset.type;
        if(type === "saveUsername") {
            setState({ ...state, saveUsername: e.target.checked, error: "" })
        } else {
            setState({ ...state, [type]: value, error: "" })
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
        handleAuthorization({ username, password }).then((data) => {
            if(data.error) {
                switch(data.error.errorCode) {
                    case "E0000004":
                        return setState({ ...state, password: "", error: "Your username and password do not match.", loading: false });
                    default:
                        return setState({ ...state, error: data.error.errorSummary, loading: false });
                }
            }
        }).catch((err) => {
            setState({ ...state, loading: false })
            console.log('Error caught: ', err)
        })
    }

    if (sessionToken) {
        // Hide form while sessionToken is converted into id/access tokens
        return null;
    }

    // ! TODO if already authenticated -> redirect to /home
    if (authState?.isAuthenticated) {
        history.push('/home')
    }

    return (
        <Wrapper>
            <LanguageSelectionWrapper>
                <LanguageSelection />
            </LanguageSelectionWrapper>
            <Container>
                <LogoWrapper>
                    <Logo src="/react/images/logo-white.svg" />
                </LogoWrapper>
                <Form onSubmit={e => handleSubmit(e)}>
                    <InputWrapper>
                        <LabelWrapper>
                            <LabelText htmlFor="username" name="username">Username</LabelText>
                            <LabelLink to="/forgot">Forgot Username?</LabelLink>
                        </LabelWrapper>
                        <InputTextWrapper error={error}>
                            <InputTextIcon src="/react/images/user-icon-grey.svg" />
                            <InputText id="username" placeholder="Enter Username" type="text" data-type="username" value={username} onChange={e => handleChange(e)} error={error} disabled={loading} />
                        </InputTextWrapper>
                    </InputWrapper>
                    <InputWrapper>
                        <LabelWrapper>
                            <LabelText htmlFor="password" name="password">Password</LabelText>
                            <LabelLink to="/reset">Forgot Password?</LabelLink>
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
                    <SubmitButton type="submit" disabled={!username || !password} isLoading={loading}>{loading ? <Spinner width="20px" height="20px" /> : "Login"}</SubmitButton>
                </Form>
                <Footer>
                    <Paragraph>Don't have an account? <LinkTo to="/register">Create an account</LinkTo></Paragraph>
                    <Paragraph>Interested in becoming a member?</Paragraph>
                    <Paragraph margin="0"><a href="https://healthfirst.org">Visit Healthfirst.org</a> to find out how.</Paragraph>
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
`;

export const Logo = styled.img`
  
`;

export const Form = styled.form`
    background: #FFFFFF;
    filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.23));
    border-radius: 8px;
    padding: 16px;
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

export const SubmitButton = styled.button`
    padding: 8px 16px;
    background: #3E7128;
    border: none;
    border-radius: 4px;
    width: 100%;
    font-weight: 600;
    color: #FFFFFF;
    margin-top: 32px;

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
