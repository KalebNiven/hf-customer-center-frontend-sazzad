import React, { useEffect } from "react";
import styled from "styled-components";
const { MIX_REACT_APP_CAPTCHA_SITEKEY } = process.env;
const { MIX_REACT_APP_CAPTCHA_V2_SITEKEY } = process.env;
export const RecaptchaV3 = (props) => {
    useEffect(()=>{
        loadReCaptchaScript();
    }, []);
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
                    console.log({token});
                });
            });
          });
    }
    return(<></>);
}
export const RecaptchaV2 = (props) => {
    useEffect( () => {
        console.log('rendering...')
        grecaptcha.render('ReCaptchaFallbackContainer', {
            'sitekey' : MIX_REACT_APP_CAPTCHA_V2_SITEKEY,
            callback: function (token) {
                props.setV2Response(token);
            }
        });
    }, []);
    return(<Recaptcha id="ReCaptchaFallbackContainer"></Recaptcha>);
}
const Recaptcha = styled.div`
transform: scale(0.77); 
-webkit-transform: scale(.95); 
transform-origin: 0 0; 
-webkit-transform-origin: 0 0;
`