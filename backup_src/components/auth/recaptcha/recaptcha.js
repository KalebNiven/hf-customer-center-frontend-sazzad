import React, { useEffect, useState } from "react";
import styled from "styled-components";
const { MIX_REACT_APP_CAPTCHA_SITEKEY } = process.env;
const { MIX_REACT_APP_CAPTCHA_V2_SITEKEY } = process.env;
const { MIX_REACT_APP_CAPTCHA_ENABLED } = process.env;

export const RecaptchaV3 = (props) => {
    const [grecaptchaV3, setGrecaptchaV3] = useState();
    if(MIX_REACT_APP_CAPTCHA_ENABLED !== 'true') return(<></>);
    useEffect(()=>{
        loadReCaptchaScript();
    }, []);

    useEffect(() => {
        grecaptchaV3?.ready(function(){
            grecaptchaV3.reset();
        });
    }, [props.formSubmitted]);

    const loadReCaptchaScript = () => {
        let id = 'recaptcha-key';
        const isScriptExist = document.getElementById(id);
        if (!isScriptExist) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = `https://www.google.com/recaptcha/api.js?render=${MIX_REACT_APP_CAPTCHA_SITEKEY}`;
            script.id = id;
            document.body.appendChild(script);
          }
          document.getElementById(id).addEventListener('load', () => {
            grecaptcha.ready(function(){
                grecaptcha.execute(`${MIX_REACT_APP_CAPTCHA_SITEKEY}`)
                .then(token => {
                    props.setV3Response(token);
                    setGrecaptchaV3(grecaptcha);
                });
            });
          });
    }
    return(<></>);
}
export const RecaptchaV2 = (props) => {
    useEffect( () => {
        if(MIX_REACT_APP_CAPTCHA_ENABLED === 'true'){
            grecaptcha.render('ReCaptchaFallbackContainer', {
                'sitekey' : MIX_REACT_APP_CAPTCHA_V2_SITEKEY,
                callback: function (token) {
                    props.setV2Response(token);
                }
            });
        }
    }, []);

    useEffect( () => {
        grecaptcha.reset();
    }, [props.formSubmitted])

    return(<Recaptcha id="ReCaptchaFallbackContainer"></Recaptcha>);
}
const Recaptcha = styled.div`
transform: scale(0.77); 
-webkit-transform: scale(.95); 
transform-origin: 0 0; 
-webkit-transform-origin: 0 0;
`