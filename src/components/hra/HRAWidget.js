import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useHistory, useParams } from 'react-router-dom'
import { useSurveyContext } from '../../context/surveyContext'
import Spinner from "../common/spinner";
import { getLanguageFromUrl } from "../../utils/misc";
import useLogError from "../../hooks/useLogError";
const surveyId = 'hra-v2-survey';
const widgetPage = "HRA";

const HRAWidget = () => {
  const history = useHistory();
  const { memberId } = useParams();
  const { surveyScript } = useSurveyContext();
  const { logError } = useLogError();
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const jwt_token = customerInfo.id_token;
  const updatedJwt = (jwt_token === undefined ? jwt_token : jwt_token.replace('Bearer ', ''));

  const mountProps = {
      surveyId: surveyId,
      appId: 'cc',
      token: updatedJwt,
      locale: getLanguageFromUrl(),
      widgetPage: widgetPage,
      memberId: memberId,
      onSurveyDoneClick: () => {
        history.push('/my-health/annual-health-assessment')
      },
      onSurveyDoneBackClick: () => {
        history.push('/my-health/annual-health-assessment')
      },                            
      parentElement: "#hra-widget",
  }

  useEffect(() => {
    if(!surveyScript) return;

    let widget;
    
    try {
      widget = new window.HraWidget(mountProps);

      if(!widget.isMounted({ widgetPage })) {
        widget.mount(mountProps)
      }
    } catch (error) {
      (async () => {
          try {
              await logError(error);
          } catch (err) {
              console.error('Error caught: ', err.message);
          }
      })()
    }

    return () => {
      try {
        if(widget.isMounted({ widgetPage })) {
          widget.unmount(mountProps)
        }
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
  }, [surveyScript, mountProps]);

  if(!surveyScript) return <Spinner />

  return (
    <Wrapper>
        <div id='hra-widget'></div>
    </Wrapper>
  )
};

const Wrapper = styled.div`
  min-height: 100%;
`;

export default HRAWidget;