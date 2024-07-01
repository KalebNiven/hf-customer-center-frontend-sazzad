import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import useLogError from "../../hooks/useLogError";
import { FeatureTreatment } from "../../libs/featureFlags";
import { loadExternalScript } from "../../utils/externalScripts";
import { getLanguageFromUrl, getSplitAttributes } from "../../utils/misc";
import { DOCUMENTS_PAGE } from "../../constants/splits";
const DOCUMENT_CENTER_WIDGET_SCRIPT_ID = "DocumentCenterWidgetScript";

export default () => {
  const customerInfo = useSelector((state) => state.customerInfo);
  const splitAttributes = getSplitAttributes(customerInfo?.data);
  return (
    <FeatureTreatment
      treatmentName={DOCUMENTS_PAGE}
      onLoad={() => {}}
      onTimedout={() => {}}
      attributes={splitAttributes}
    >
      <DocumentCenterWidget />
    </FeatureTreatment>
  );
};

function DocumentCenterWidget() {
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
    document.getElementById(DOCUMENT_CENTER_WIDGET_SCRIPT_ID),
  );
  const history = useHistory();
  const { MIX_REACT_CC_WIDGETS_BASE_URL } = process.env;

  const events = {
    onNavigateToPaperlessSettings: () => {
      history.push({
        pathname: "/settings",
        state: {
          sideBarIndex: 2,
        },
      });
    },
  };

  const mountProps = {
    parentElement: "#CustomerCenterDocumentCenterWidgetApp",
    accessToken: updatedAccessToken,
    idToken: updatedIdToken,
    appId: "CUSTOMER_CENTER",
    lang: getLanguageFromUrl(),
    events: events,
  };

  useEffect(() => {
    if (existingScript) {
      try {
        window.CustomerCenterDocumentCenterWidget.mount(mountProps);
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
        MIX_REACT_CC_WIDGETS_BASE_URL +
          "/document-center/cc-document-center-widget.js",
        DOCUMENT_CENTER_WIDGET_SCRIPT_ID,
        () => {
          try {
            window.CustomerCenterDocumentCenterWidget.mount(mountProps);
            sessionStorage.setItem("longLoad", false);
            setExistingScript(
              document.getElementById(DOCUMENT_CENTER_WIDGET_SCRIPT_ID),
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
        window.CustomerCenterDocumentCenterWidget.unmount();
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
      <div id="CustomerCenterDocumentCenterWidgetApp"></div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100%;
`;
