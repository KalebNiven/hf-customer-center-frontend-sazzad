import React, { useState, useEffect } from "react";

import { loadExternalScript } from "../../utils/externalScripts";
import useLogError from "../../hooks/useLogError";
import { getLocaleFromUrl } from "../../utils/misc";

const DIGITAL_FORM_WIDGET_SCRIPT_ID = "DigitalFormWidgetScript";

const DigitalForm = ({
  memberId,
  customerId,
  templateId,
  setTemplateId,
  stepperId,
  cardsId,
}) => {
  const { MIX_REACT_DIGITAL_FORM_WIDGET_BASE_URL } = process.env;

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { logError } = useLogError();

  const token = JSON.parse(localStorage.getItem("okta-token-storage"));

  const cardGridMountProps = {
    parent: cardsId,
    appId: "CUSTOMER_CENTER",
    token: token.accessToken.accessToken,
    widgetName: "FORMS_CARD_GRID",
    onFormSelected: (templateId) => {
      setTemplateId(templateId);
    },
  };

  const mountCardGrid = () =>
    window.digitalFormsWidget.mount(cardGridMountProps);
  const unmountCardGrid = () => {
    if (window.digitalFormsWidget.isMounted(cardGridMountProps.widgetName)) {
      window.digitalFormsWidget.unmount(cardGridMountProps.widgetName);
    }
  };

  const stepperMountProps = {
    parent: stepperId,
    appId: "CUSTOMER_CENTER",
    token: token.accessToken.accessToken,
    widgetName: "FORM_STEPPER",
    onBackPressed: () => {
      setTemplateId(null);
    },
    templateId,
    memberId,
    customerId,
    locale: getLocaleFromUrl(),
  };

  const mountStepper = () => window.digitalFormsWidget.mount(stepperMountProps);
  const unmountStepper = () => {
    if (window.digitalFormsWidget.isMounted(stepperMountProps.widgetName)) {
      window.digitalFormsWidget.unmount(stepperMountProps.widgetName);
    }
  };

  const onScriptLoad = () => {
    try {
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
      DIGITAL_FORM_WIDGET_SCRIPT_ID,
    );
    if (existingScript) {
      onScriptLoad();
    } else {
      loadExternalScript(
        MIX_REACT_DIGITAL_FORM_WIDGET_BASE_URL + "/embed/digitalFormsWidget.js",
        DIGITAL_FORM_WIDGET_SCRIPT_ID,
        onScriptLoad,
      );
    }

    return () => {
      try {
        unmountCardGrid();
        unmountStepper();
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
        unmountCardGrid();
        mountStepper();
      } else {
        unmountStepper();
        mountCardGrid();
      }
    }
  }, [isScriptLoaded, templateId]);

  return null;
};

export default DigitalForm;
