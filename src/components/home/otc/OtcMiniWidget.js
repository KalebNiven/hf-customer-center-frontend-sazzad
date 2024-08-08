import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import useLogError from "../../../hooks/useLogError";
import { FeatureTreatment } from "../../../libs/featureFlags";
import { loadExternalScript } from "../../../utils/externalScripts";
import { getLanguageFromUrl, getSplitAttributes } from "../../../utils/misc";
import { SHOW_OTC_CARD_HOME_PAGE } from "../../../constants/splits";
import { useHistory } from "react-router-dom";
export const OTC_MIN_WIDGET_SCRIPT_ID = "OtcMiniWidgetScript";

export default ({ ignoreSplit }) => {
  const customerInfo = useSelector((state) => state.customerInfo);
  const splitAttributes = getSplitAttributes(customerInfo?.data);

  return (
    <FeatureTreatment
      treatmentName={SHOW_OTC_CARD_HOME_PAGE}
      onLoad={() => {}}
      onTimedout={() => {}}
      attributes={splitAttributes}
      ignoreSplit={ignoreSplit}
    >
      <OtcMiniWidget />
    </FeatureTreatment>
  );
};

function OtcMiniWidget() {
  const { logError } = useLogError();
  const history = useHistory();
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const memberId = customerInfo.memberId;
  const [existingScript, setExistingScript] = useState(
    document.getElementById(OTC_MIN_WIDGET_SCRIPT_ID),
  );

  const { MIX_REACT_TRAILBLAZER_WIDGET_BASE_URL } = process.env;

  const token = JSON.parse(localStorage.getItem("okta-token-storage"));

  const mountProps = {
    parentElement: "#CustomerCenterOtcMiniWidgetApp",
    memberId,
    appId: "CUSTOMER_CENTER",
    authorizer: "OKTA",
    token: token.idToken.idToken,
    lang: getLanguageFromUrl(),
    widgetId: "OTC",
    size: "SMALL",
    events: {
      onNavigateToFullView: () => {
        history.push("/otc-widget");
      },
    },
  };

  useEffect(() => {
    if (existingScript) {
      try {
        window.MicroWidget.mount(mountProps);
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
        MIX_REACT_TRAILBLAZER_WIDGET_BASE_URL + "/micro-widget.js",
        OTC_MIN_WIDGET_SCRIPT_ID,
        () => {
          try {
            window.MicroWidget.mount(mountProps);
            sessionStorage.setItem("longLoad", false);
            setExistingScript(
              document.getElementById(OTC_MIN_WIDGET_SCRIPT_ID),
            );
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
        window.MicroWidget.unmount(mountProps.widgetId);
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
      <div id="CustomerCenterOtcMiniWidgetApp"></div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100%;
`;
