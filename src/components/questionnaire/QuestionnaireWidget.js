import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSurveyContext } from '../../context/surveyContext'
import Spinner from "../common/spinner";
import { getLocaleFromUrl } from "../../utils/misc";

const QuestionnaireWidget = () => {
  const { surveyScript } = useSurveyContext();

  const mountProps = {
    appId: 'HRA_PUBLIC',
    surveyId: 'hra-v2-survey',
    parentElement: "#questionnaire-widget",
    locale: getLocaleFromUrl()
  };

  useEffect(() => {
    if(!surveyScript) return;

    let widget;

    try {
      widget = new window.HraWidget(mountProps);

      if(!widget.isMounted()) {
        widget.mount(mountProps)
      }

    } catch (error) {
        console.error('Error caught: ', error.message);
    }

    return () => {
      try {
        if(widget.isMounted()) {
          widget.unmount()
        }
      } catch (error) {
        console.error('Error caught: ', error.message);
      }
    }
  }, [surveyScript, mountProps]);

  if(!surveyScript) return <Spinner />

  return (
    <Wrapper>
        <div id='questionnaire-widget'></div>
    </Wrapper>
  )
};

const Wrapper = styled.div`
  min-height: 100%;

  #questionnaire-widget{
    height: 100%;
  }
`;

export default QuestionnaireWidget;
