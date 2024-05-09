import React, { useEffect } from "react";
import { loadExternalScript } from "../../utils/externalScripts";
import { useSurveyContext } from "../../context/surveyContext";
const { MIX_REACT_SURVEY_WIDGET_BASE_URL } = process.env;
const HRA_WIDGET_SCRIPT_ID = "survey-widget-script";

// This Component is used to embed survey script into the app. Notice we don't mount any widgets in here.
const SurveyScript = () => {
  const { surveyScript, setSurveyScript } = useSurveyContext();

  useEffect(() => {
    if (!surveyScript) {
      const callback = async () => {
        setSurveyScript(document.getElementById(HRA_WIDGET_SCRIPT_ID));
      };
      loadExternalScript(
        MIX_REACT_SURVEY_WIDGET_BASE_URL + "/embed/hraWidget.js",
        HRA_WIDGET_SCRIPT_ID,
        callback,
      );
    }
  }, []);

  return <></>;
};

export default SurveyScript;
