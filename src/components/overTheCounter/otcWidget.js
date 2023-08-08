import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { loadExternalScript } from "../../utils/externalScripts";

const OTC_WIDGET_SCRIPT_ID = 'OTCWidgetScript';
const OTCWidget = () => {

  const { MIX_REACT_TRAILBLAZER_WIDGET_BASE_URL } = process.env;
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const jwt_token = customerInfo.id_token
  const updatedJwt = (jwt_token === undefined ? jwt_token : jwt_token.replace('Bearer ', ''));
  const [existingScript, setExistingScript] = useState(document.getElementById(OTC_WIDGET_SCRIPT_ID));

  const events = {};

  const mountProps = {
      parentElement: '#otcw-main',
      memberId:customerInfo.memberId,
      appId: 'CUSTOMER_CENTER',
      authorizer: 'OKTA',
      lang: customerInfo.language,
      token: updatedJwt,
      events: events,
  }

  useEffect(() => {
    if(existingScript){
      window.OTCWidget.mount(mountProps);
      sessionStorage.setItem("longLoad", false);
    }
    else{
      loadExternalScript(MIX_REACT_TRAILBLAZER_WIDGET_BASE_URL + '/otc-widget.js', OTC_WIDGET_SCRIPT_ID, 
      () => {
        window.OTCWidget.mount(mountProps);
        sessionStorage.setItem("longLoad", false);
        setExistingScript(document.getElementById(OTC_WIDGET_SCRIPT_ID));
      });
    }
    return () => {
      try{
        window.OTCWidget.unmount();
      }catch(e){
        console.log(e)
      }
    };
  },[]);

  return(
    <OTCWidgetWrapper>
        <div id='otcw-main'></div>
    </OTCWidgetWrapper>
  )
};

const OTCWidgetWrapper = styled.div`
  height: 100%;
`;
export default OTCWidget;