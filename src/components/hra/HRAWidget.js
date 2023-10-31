import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useHistory, useParams } from 'react-router-dom'
import { useSurveyContext } from '../../context/surveyContext'
import Spinner from "../common/spinner";
import { getLanguageFromUrl } from "../../utils/misc";
const surveyId = 'hra-v2-survey';
const widgetPage = "HRA";

const HRAWidget = () => {
  const history = useHistory();
  const { memberId } = useParams();
  const { surveyScript } = useSurveyContext();
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

    const widget = new window.HraWidget(surveyId);

    if(!widget.isMounted({ widgetPage })) {
      widget.mount(mountProps)
    }

    return () => {
      if(widget.isMounted({ widgetPage })) {
        widget.unmount(mountProps)
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