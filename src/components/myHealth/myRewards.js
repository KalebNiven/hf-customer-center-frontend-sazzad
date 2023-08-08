import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { loadExternalScript } from "../../utils/externalScripts";

const MY_REWARDS_SCRIPT_ID = 'myRewardsScript';
const MyRewards = () => {

  const { MIX_REACT_TRAILBLAZER_WIDGET_BASE_URL } = process.env;
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const jwt_token = customerInfo.id_token
  const updatedJwt = (jwt_token === undefined ? jwt_token : jwt_token.replace('Bearer ', ''));
  const [existingScript, setExistingScript] = useState(document.getElementById(MY_REWARDS_SCRIPT_ID));

  const events = {
    onNavigateToPrimaryCareProvider: (data) => {
      /* const { pcpId } = data; */ 
      history.push({pathname: '/pcp'});
    }, 
    onNavigateToProviderSearch: (data) => {
      /* const { benefitPackage, groupNumber, year, specialty } = data; */
      history.push({pathname: '/findcare'});
    }
  };

  const mountProps = {
      parentElement: '#rw-main',
      memberId:customerInfo.memberId,
      appId: 'CUSTOMER_CENTER',
      authorizer: 'OKTA',
      lang: customerInfo.language,
      token: updatedJwt,
      defaultPage: 'My Rewards',
      events: events,
  }

  useEffect(() => {
    if(existingScript){
      RewardsWidget.mount(mountProps);
      sessionStorage.setItem("longLoad", false);
    }
    else{
      loadExternalScript(MIX_REACT_TRAILBLAZER_WIDGET_BASE_URL + '/rewards-widget.js', MY_REWARDS_SCRIPT_ID, 
      () => {
        RewardsWidget.mount(mountProps);
        sessionStorage.setItem("longLoad", false);
      });
    }

    return () => {
      const existingScript = document.getElementById(MY_REWARDS_SCRIPT_ID);
      if(existingScript) try{
        RewardsWidget.unmount();
      }catch(e){
        console.log(e)
      }
    };
  },[]);

  return(
    <RewardsWrapper>
        <div id='rw-main'></div>
    </RewardsWrapper>
  )
};

const RewardsWrapper = styled.div`
  height: 100%;
`;
export default MyRewards;