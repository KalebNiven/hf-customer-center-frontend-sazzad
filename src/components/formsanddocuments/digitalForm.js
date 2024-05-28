import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { loadExternalScript } from "../../utils/externalScripts";
import useLogError from "../../hooks/useLogError";

const DIGITAL_FORM_WIDGET_SCRIPT_ID = "DigitalFormWidgetScript";

const DigitalForm = () => {
  const { MIX_REACT_DIGITAL_FORM_WIDGET_BASE_URL } = process.env;

  const [templateId, setTemplateId] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { logError } = useLogError();

  const token = JSON.parse(localStorage.getItem("okta-token-storage"));

  const cardGridMountProps = {
    parent: "dfw-main",
    appId: "CUSTOMER_CENTER",
    token: token.accessToken.accessToken,
    widgetName: "FORMS_CARD_GRID",
    onFormSelected: (templateId) => {
      setTemplateId(templateId);
    },
  };

  const mountCardGrid = () =>
    window.digitalFormsWidget.mount(cardGridMountProps);

  const stepperMountProps = {
    parent: "dfw-main",
    appId: "CUSTOMER_CENTER",
    token: token.accessToken.accessToken,
    widgetName: "FORM_STEPPER",
    onBackPressed: () => {
      setTemplateId(null);
    },
    templateId,
    locale: "en",
  };

  const mountStepper = () => window.digitalFormsWidget.mount(stepperMountProps);

  const onScriptLoad = () => {
    try {
      console.log("onScriptLoad");
      sessionStorage.setItem("longLoad", false);
      setIsScriptLoaded(true);
    } catch (error) {
      try {
        logError(error);
      } catch (err) {
        console.error("Error caught: ", err.message);
      }
    }
  };

  useEffect(() => {
    const existingScript = document.getElementById(
      DIGITAL_FORM_WIDGET_SCRIPT_ID
    );
    if (existingScript) {
      onScriptLoad();
    } else {
      loadExternalScript(
        MIX_REACT_DIGITAL_FORM_WIDGET_BASE_URL + "/embed/digitalFormsWidget.js",
        DIGITAL_FORM_WIDGET_SCRIPT_ID,
        onScriptLoad
      );
    }

    return () => {
      try {
        window.digitalFormsWidget.unmount();
      } catch (error) {
        try {
          logError(error);
        } catch (err) {
          console.error("Error caught: ", err.message);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (isScriptLoaded) {
      if (templateId) {
        mountStepper();
      } else {
        mountCardGrid();
      }
    }
  }, [isScriptLoaded, templateId]);

  return (
    <DigitalFormWrapper>
      <div id="dfw-main"></div>
    </DigitalFormWrapper>
  );
};

const DigitalFormWrapper = styled.div`
  height: 100%;
`;

export default DigitalForm;
