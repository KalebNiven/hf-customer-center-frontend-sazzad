import React, { useState, useEffect } from "react";
import styled from 'styled-components'
import { useLogout } from "../../hooks/useLogout";
import { ModalWrapper, Header, ModalContent, ModalInnerWrapper } from '../../styles/commonStyles';
const { MIX_REACT_SESSION_LIFETIME_SECONDS } = process.env;
const { MIX_REACT_SESSION_WARNING_COUNTDOWN_SECONDS } = process.env;
const { MIX_REACT_OKTA_API_URL } = process.env;

const SessionTimeoutModal = (props) => {
    const [timeoutVisible, setTimeoutVisible] = useState(false);
    const [warningTimerId, setWarningTimerId] = useState(undefined);
    const [countDownSecondsLeft, setCountdownSecondsLeft] = useState(MIX_REACT_SESSION_WARNING_COUNTDOWN_SECONDS);
    const [startCounter, setStartCounter] = useState(false);
    const logout = useLogout();

    let countDownId;

    const clearTimers = (hideModal = false) => {
        if(hideModal){
            setStartCounter(false);
            setTimeoutVisible(false);
        }
        if(!timeoutVisible || hideModal){
            clearTimeout(warningTimerId);
            setWarningTimerId(undefined);  
            startSessionTimer();  
        }
    }

    const countDownTimer = () => {
        let count = MIX_REACT_SESSION_WARNING_COUNTDOWN_SECONDS;
        setCountdownSecondsLeft(count);
        countDownId = !countDownId && setInterval(function() {
            setCountdownSecondsLeft(count--);
            if(count <= 0){
                setStartCounter(false);
                logout();
            }
        }, 1000);
    }

    const startSessionTimer = () => {
        window.sessionStorage.setItem('SessionTimeStamp', new Date());
        let aid = setTimeout(()=>{
            setTimeoutVisible(true);
            clearInterval(aid);
            setStartCounter(true);
        }, (MIX_REACT_SESSION_LIFETIME_SECONDS - MIX_REACT_SESSION_WARNING_COUNTDOWN_SECONDS) * 1000);
        setWarningTimerId(aid);
    }

    const sessionReset = () => {
         fetch(`${MIX_REACT_OKTA_API_URL}/sessions/me/lifecycle/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accpet: 'application/json'
            }
         });

         fetch('/sessionKeepAlive', {
            headers: {
                'X-CSRF-TOKEN': props.csrf
            }
         })
         .then((data) => {
         })
         .catch((error) => {
            console.log(error);
         })
         .finally( ()=> {
            clearTimers(true);
         })
    }

    const sessionTimeStamp = () => {
        let sessionTimeStamp = window.sessionStorage.getItem('SessionTimeStamp');
        if(sessionTimeStamp){
            let currentTime = new Date();
            sessionTimeStamp = new Date(sessionTimeStamp); 
            let timeDiff = (currentTime - sessionTimeStamp)/1000; 
            if(timeDiff >= MIX_REACT_SESSION_LIFETIME_SECONDS){
                clearTimers(true);
                logout();
            }
        }
    }

    useEffect(() => {
        startSessionTimer();
        window.addEventListener('blur', () => {
            sessionTimeStamp();
        });
        window.addEventListener('focus', () => {
            sessionTimeStamp();
        });
    }, []);

    useEffect(() => {
        if(startCounter === true){
            countDownTimer();
        } 
        else {
            countDownId && clearInterval(countDownId);    
        } 
        return () => clearInterval(countDownId);
      }, [startCounter]);

      //Clear time on page interations actions 
      onclick = (event) => clearTimers(false);
      onkeydown = (event) => clearTimers(false);

    return(
        timeoutVisible && <AppModalWrapper visible={timeoutVisible}>
            <AppModalInnerWrapper>
                <AppModalContent>
                    <SessionTimeoutModalWrapper>
                        <SessionModalDialog role="document">
                            <SessionModalContent>
                                <SessionModalHeader>
                                    <SessionModalH5>Your session is about to expire!</SessionModalH5>
                                </SessionModalHeader>
                                <SessionModalBody>
                                    <span>
                                        You will be logged out in <cite>{countDownSecondsLeft}</cite> seconds.
                                        <br></br>
                                        Do you want to stay signed in?
                                    </span>
                                </SessionModalBody>
                                <SessionModalFooter>
                                    <a id="oktaLogoutUrl" className="btn btn-secondary-md session-sign-out" route='JSON' onClick={()=>{logout()}}>Logout</a>
                                    <button id="session-keep-signed-in" type="button" className="btn btn-primary-md session-sign-in" onClick={()=>sessionReset()}>Yes, keep me signed in</button>
                                </SessionModalFooter>
                            </SessionModalContent>
                        </SessionModalDialog>
                    </SessionTimeoutModalWrapper>
                </AppModalContent>
            </AppModalInnerWrapper>
        </AppModalWrapper>
    )
}
export default React.memo(SessionTimeoutModal);

const AppModalWrapper = styled(ModalWrapper)`
    opacity: ${props => props.visible ? "1" : "0" };
`

const AppModalInnerWrapper = styled(ModalInnerWrapper)`
    max-width: 450px;
    @media only screen and (max-width: 768px){
      max-width: 320px;
    }
`

const AppModalContent = styled(ModalContent)`
    // transition: opacity .3s ease-out; 
    // transition: transform .3s ease-out,-webkit-transform .3s ease-out;
    padding: initial;
    border: initial;
    // transform: translateY(-25%);
    -webkit-animation-name: animatetop;
    -webkit-animation-duration: 0.3s;
    animation-name: animatetop;
    animation-duration: 0.3s
    /* Add Animation */
    @-webkit-keyframes animatetop {
      from {transform: translateY(-100%); opacity:0}
      to {transform: translateY(0);; opacity:1}
    }
  
    @keyframes animatetop {
      from {transform: translateY(-100%); opacity:0}
      to {transform: translateY(0);; opacity:1}
    }

    @media only screen and (max-width: 768px){
      width: 320px;
      max-width: 320px;
    }
`

const AppModalHeader = styled(Header)`
    font-size: 20px;
    line-height: 1.4;
    margin-bottom: 1rem;
`

const SessionTimeoutModalWrapper = styled.div`
    display: block;   
`

const SessionModalDialog = styled.div`
    position: relative;
    width: auto;
    margin: 10% auto;
    pointer-events: none;
    transform: translate(0);
    max-width: 450px;

    @media (min-width: 576px){
        max-width: 500px;
        margin: 50% auto;
    }
`
const SessionModalContent = styled.div`
    padding: 10px;
    position: relative;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    width: 100%;
    pointer-events: auto;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0,0,0,.2);
    border-radius: 0.3rem;
    outline: 0;
    display: flex
`
const SessionModalHeader = styled.div`
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
    border-top-left-radius: 0.3rem;
    border-top-right-radius: 0.3rem;
    display: flex;
    flex-direction: column;
    border: none;
    margin-bottom: -2em;
`
const SessionModalH5 = styled.div`
    letter-spacing: 0;
    line-height: 18px;
    color: #003863;
    font-size: 18px;
    font-weight: 400;
    margin: 1em auto;
`
const SessionModalBody = styled.div`
    flex: 1 1 auto;
    position: relative;
    -webkit-box-flex: 1;
    border: none;
    padding: 0px;
    text-align: center;
`
const SessionModalFooter = styled.div`
    text-align: center;
    justify-content: center;
    border: none;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: end;
    padding: 1rem;
    @media only screen and (max-width: 768px){
        flex-flow: column;
    }
    > * {
        &:not(:first-child) {
            margin-left: 0.25rem;
        }
        @media only screen and (max-width: 768px){
            float: none;
            display: block;
            margin: 0 auto;
            margin-bottom: 0.5rem;
            width: 270px;
        }
    }

    > * {
        &:first-child {
            margin-right: 0.25rem;
            @media only screen and (max-width: 768px){
                float: none;
                display: block;
                margin: 0 auto;
                margin-bottom: 0.5rem;
                width: 270px;
            }
        }
    }
`
