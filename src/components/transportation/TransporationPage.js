import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { loadExternalScript } from "../../utils/externalScripts";
import useLogError from "../../hooks/useLogError";
import { getLanguageFromUrl } from "../../utils/misc";
import { MainContentContainer } from "../common/styles";

const MODE_OF_TRANSPORT_WIDGET_SCRIPT_ID = "MOTWidgetScript";

const TransportationPage = () => {
  const { MIX_REACT_MODE_OF_TRANSPORT_WIDGET_BASE_URL } = process.env;
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const memberId = customerInfo?.hohPlans[0]?.MemberId;
  const jwt_token = customerInfo.id_token;
  const updatedJwt =
    jwt_token === undefined ? jwt_token : jwt_token.replace("Bearer ", "");
  const [existingScript, setExistingScript] = useState(
    document.getElementById(MODE_OF_TRANSPORT_WIDGET_SCRIPT_ID),
  );
  const { logError } = useLogError();

  const mountProps = {
    parentElement: "#transport-main",
    memberId: memberId,
    appId: "CC",
    lang: getLanguageFromUrl(),
    token: updatedJwt,
    widgetPage: "TRANSPORTATION",
  };

  useEffect(() => {
    if (existingScript) {
      try {
        window.modeOfTransportWidget.mount(mountProps);
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
        MIX_REACT_MODE_OF_TRANSPORT_WIDGET_BASE_URL +
          "/embed/modeOfTransportWidget.js",
        MODE_OF_TRANSPORT_WIDGET_SCRIPT_ID,
        () => {
          try {
            window.modeOfTransportWidget.mount(mountProps);
            sessionStorage.setItem("longLoad", false);
            setExistingScript(
              document.getElementById(MODE_OF_TRANSPORT_WIDGET_SCRIPT_ID),
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
        window.modeOfTransportWidget.unmount();
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
    <TransportationPageContainer>
      <div id="transport-main"></div>
    </TransportationPageContainer>
  );
};

const TransportationPageContainer = styled(MainContentContainer)`
  max-width: 1024px;
  position: relative;
  margin: auto;
  margin-bottom: 1.5rem;
  width: 100%;
  @media only screen and (min-width: 480px) and (max-width: 820px) {
    width: auto;
    margin-left: 3rem;
    margin-right: 3rem;
  }
`;

export default TransportationPage;
