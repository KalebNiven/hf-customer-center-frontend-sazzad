import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import useLogError from "../../hooks/useLogError";
import { FeatureTreatment } from "../../libs/featureFlags";
import { loadExternalScript } from "../../utils/externalScripts";
import { getLanguageFromUrl, getSplitAttributes } from "../../utils/misc";
import { CLAIMS_PAGE } from "../../constants/splits";
import { useSurveyContext } from "../../context/surveyContext";
const CLAIMS_WIDGET_SCRIPT_ID = "ClaimsWidgetScript";

export default () => {
  const customerInfo = useSelector((state) => state.customerInfo);
  const splitAttributes = getSplitAttributes(customerInfo?.data);
  return (
    <FeatureTreatment
      treatmentName={CLAIMS_PAGE}
      onLoad={() => {}}
      onTimedout={() => {}}
      attributes={splitAttributes}
    >
      <ClaimsWidget />
    </FeatureTreatment>
  );
};

function ClaimsWidget() {
  const { logError } = useLogError();
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const idToken = customerInfo.id_token;
  const updatedIdToken =
    idToken === undefined ? idToken : idToken.replace("Bearer ", "");
  const accessToken = customerInfo.access_token;
  const updatedAccessToken =
    accessToken === undefined
      ? accessToken
      : accessToken.replace("Bearer ", "");
  const [existingScript, setExistingScript] = useState(
    document.getElementById(CLAIMS_WIDGET_SCRIPT_ID),
  );
  const { MIX_REACT_CC_WIDGETS_BASE_URL } = process.env;
  const [claimsSubmitted, setClaimsSubmitted] = useState(0);

  const {
    digitalSurveyWidget,
    triggerDigitalSurveyByEventName,
    DIGITAL_SURVEY_EVENTS,
  } = useSurveyContext();

  const onClaimSubmitted = useCallback(() => {
    setClaimsSubmitted(claimsSubmitted + 1);
  }, []);

  const events = {
    onClaimSubmitted,
  };

  const mountProps = {
    parentElement: "#CustomerCenterClaimsWidgetApp",
    accessToken: updatedAccessToken,
    idToken: updatedIdToken,
    appId: "CUSTOMER_CENTER",
    lang: getLanguageFromUrl(),
    events: events,
    onClaimSubmitted,
  };

  useEffect(() => {
    if (digitalSurveyWidget && claimsSubmitted)
      triggerDigitalSurveyByEventName(
        digitalSurveyWidget,
        DIGITAL_SURVEY_EVENTS.CLAIM_SUBMITTED,
      );
  }, [claimsSubmitted]);

  useEffect(() => {
    if (existingScript) {
      try {
        window.CustomerCenterClaimsWidget.mount(mountProps);
        sessionStorage.setItem("longLoad", false);
      } catch (error) {
        (async () => {
          try {
            await logError(error);
          } catch (err) {
            console.error("Error caught: ", err.message);
          }
        })();
      }
    } else {
      loadExternalScript(
        MIX_REACT_CC_WIDGETS_BASE_URL + "/claims/cc-claims-widget.js",
        CLAIMS_WIDGET_SCRIPT_ID,
        () => {
          try {
            window.CustomerCenterClaimsWidget.mount(mountProps);
            sessionStorage.setItem("longLoad", false);
            setExistingScript(document.getElementById(CLAIMS_WIDGET_SCRIPT_ID));
          } catch (error) {
            (async () => {
              try {
                await logError(error);
              } catch (err) {
                console.error("Error caught: ", err.message);
              }
            })();
          }
        },
      );
    }
    return () => {
      try {
        window.CustomerCenterClaimsWidget.unmount();
      } catch (error) {
        (async () => {
          try {
            await logError(error);
          } catch (err) {
            console.error("Error caught: ", err.message);
          }
        })();
      }
    };
  }, []);

  return (
    <Wrapper>
      <div id="CustomerCenterClaimsWidgetApp"></div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100%;
`;
