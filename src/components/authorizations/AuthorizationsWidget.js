import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import useLogError from "../../hooks/useLogError";
import { FeatureTreatment } from "../../libs/featureFlags";
import { loadExternalScript } from "../../utils/externalScripts";
import { getLanguageFromUrl, getSplitAttributes } from "../../utils/misc";
import { AUTHORIZATIONS_PAGE } from "../../constants/splits";
const AUTHORIZATIONS_WIDGET_SCRIPT_ID = "AuthorizationsWidgetScript";

export default () => {
  const customerInfo = useSelector((state) => state.customerInfo);
  const splitAttributes = getSplitAttributes(customerInfo?.data);
  return (
    <FeatureTreatment
      treatmentName={AUTHORIZATIONS_PAGE}
      onLoad={() => {}}
      onTimedout={() => {}}
      attributes={splitAttributes}
    >
      <AuthorizationsWidget />
    </FeatureTreatment>
  );
};

function AuthorizationsWidget() {
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
    document.getElementById(AUTHORIZATIONS_WIDGET_SCRIPT_ID),
  );

  const { MIX_REACT_CC_WIDGETS_BASE_URL } = process.env;

  const mountProps = {
    parentElement: "#CustomerCenterAuthorizationsWidgetApp",
    accessToken: updatedAccessToken,
    idToken: updatedIdToken,
    appId: "CUSTOMER_CENTER",
    lang: getLanguageFromUrl(),
  };

  useEffect(() => {
    if (existingScript) {
      try {
        window.CustomerCenterAuthsWidget.mount(mountProps);
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
        MIX_REACT_CC_WIDGETS_BASE_URL + "/authorizations/cc-auths-widget.js",
        AUTHORIZATIONS_WIDGET_SCRIPT_ID,
        () => {
          try {
            window.CustomerCenterAuthsWidget.mount(mountProps);
            sessionStorage.setItem("longLoad", false);
            setExistingScript(
              document.getElementById(AUTHORIZATIONS_WIDGET_SCRIPT_ID),
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
        window.CustomerCenterAuthsWidget.unmount();
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
      <div id="CustomerCenterAuthorizationsWidgetApp"></div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100%;
`;
