import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useAppContext } from "../../AppContext";
import { ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import { loadExternalScript } from "../../utils/externalScripts";
import useLogError from "../../hooks/useLogError";
import { useLocation } from "react-router-dom";
import { useSurveyContext } from '../../context/surveyContext';

const MEMBER_ID_CARD_WIDGET_SCRIPT_ID = 'MemberIdCardWidgetScript';

const MemberIdCardWidget = () => {

  const { MIX_REACT_TRAILBLAZER_WIDGET_BASE_URL } = process.env;
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const location = useLocation();
  const jwt_token = customerInfo.id_token
  const updatedJwt = (jwt_token === undefined ? jwt_token : jwt_token.replace('Bearer ', ''));
  const [existingScript, setExistingScript] = useState(document.getElementById(MEMBER_ID_CARD_WIDGET_SCRIPT_ID));
  const { externalSiteModal, setExternalSiteModal } = useAppContext();
  const { logError } = useLogError();
  const memberId = location?.state?.dependentMemberId ? location?.state?.dependentMemberId : customerInfo?.hohPlans[0]?.MemberId;
  const { digitalSurveyWidget, triggerDigitalSurveyByEventName, DIGITAL_SURVEY_EVENTS } = useSurveyContext();


  const handleExternalSiteClicked = (link, action) => {
      let externalSiteData = {
        ...externalSiteModal, 
        isVisible: true, 
        link: link, 
        target: "_blank", 
        segmentPageCategory: ANALYTICS_TRACK_CATEGORY.memberIdCard, 
        segmentTargetMemberId: customerInfo.memberId, 
        label: action,
      };

      setExternalSiteModal(externalSiteData);
  };
  const events = {
    onNavigateToTrackingClicked: (data) => {
        const {url, action} = data
        handleExternalSiteClicked(url, action);
      },
      onNavigateToLocationClicked: (data) => {
        const {url, action} = data
        handleExternalSiteClicked(url, action);
      },
      onNavigateToAppstoreClicked: (data) => {
        const {url, action} = data
        handleExternalSiteClicked(url, action);
      },
      onMailRequestCompleted: (data) => {
        console.log('completed')
        if(digitalSurveyWidget) triggerDigitalSurveyByEventName(digitalSurveyWidget, DIGITAL_SURVEY_EVENTS.MAIL_ID_CARD);
      },
  }  

  const mountProps = {
      parentElement: '#member-id-card-main',
      memberId:memberId,
      appId: 'CUSTOMER_CENTER',
      authorizer: 'OKTA',
      lang: customerInfo.language,
      token: updatedJwt,
      events: events,
  }

  useEffect(() => {
    if(existingScript){
      try {
        //attempt to mount the widget if the script exists
        window.IDCardWidget.mount(mountProps);
      } catch (error) {
        (async () => {
            try {
                await logError(error);
            } catch (err) {
                console.error('Error caught: ', err.message);
            }
        })()
      }
    }
    else{
      loadExternalScript(MIX_REACT_TRAILBLAZER_WIDGET_BASE_URL + '/id-card-widget.js', MEMBER_ID_CARD_WIDGET_SCRIPT_ID, 
      () => {
        try {
          window.IDCardWidget.mount(mountProps);
          sessionStorage.setItem("longLoad", false);
          setExistingScript(document.getElementById(MEMBER_ID_CARD_WIDGET_SCRIPT_ID));
        } catch (error) {
          (async () => {
              try {
                  await logError(error);
              } catch (err) {
                  console.error('Error caught: ', err.message);
              }
          })()
        }
      });
    }
    return () => {
      try {
        window.IDCardWidget.unmount();
      } catch(error){
        (async () => {
            try {
                await logError(error);
            } catch (err) {
                console.error('Error caught: ', err.message);
            }
        })()
      }
    };
  },[]);

  return(
    <IDCardWidgetWrapper>
        <div id='member-id-card-main'></div>
    </IDCardWidgetWrapper>
  )
};

const IDCardWidgetWrapper = styled.div`
  height: 100%;
`;
export default MemberIdCardWidget;
