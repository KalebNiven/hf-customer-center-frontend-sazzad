import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { FeatureTreatment } from "../../libs/featureFlags";
import { loadExternalScript } from "../../utils/externalScripts";
import useLogError from "../../hooks/useLogError";
import { getLanguageFromUrl, getSplitAttributes } from "../../utils/misc";
import { SHOW_TRANSPORTATION_CARD } from "../../constants/splits";

export const MODE_OF_TRANSPORT_MICRO_WIDGET_SCRIPT_ID = "MOTMiniWidgetScript";

export default ({ ignoreSplit }) => {
  const customerInfo = useSelector((state) => state.customerInfo);
  const splitAttributes = getSplitAttributes(customerInfo?.data);

  return (
    <FeatureTreatment
      treatmentName={SHOW_TRANSPORTATION_CARD}
      onLoad={() => {}}
      onTimedout={() => {}}
      attributes={splitAttributes}
      ignoreSplit={ignoreSplit}
    >
      <TransportationMicroWidget />
    </FeatureTreatment>
  );
};

const TransportationMicroWidget = () => {
  const { MIX_REACT_MODE_OF_TRANSPORT_WIDGET_BASE_URL } = process.env;
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const history = useHistory();
  const memberId = customerInfo?.hohPlans[0]?.MemberId;
  const jwt_token = customerInfo.id_token;
  const updatedJwt =
    jwt_token === undefined ? jwt_token : jwt_token.replace("Bearer ", "");
  const [existingScript, setExistingScript] = useState(
    document.getElementById(MODE_OF_TRANSPORT_MICRO_WIDGET_SCRIPT_ID),
  );
  const { logError } = useLogError();

  const events = {
    onNavigateToTransportionTab: () => {
      history.push("/transportation");
    },
  };
  const mountProps = {
    parentElement: "#transport-mini-widget",
    memberId: memberId,
    appId: "CC",
    lang: getLanguageFromUrl(),
    token: updatedJwt,
    widgetPage: "TRANSPORTATION",
    events,
  };

  useEffect(() => {
    if (existingScript) {
      try {
        window.modeOfTransportMicroWidget.mount(mountProps);
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
          "/modeOfTransportMicroWidget.js",
        MODE_OF_TRANSPORT_MICRO_WIDGET_SCRIPT_ID,
        () => {
          try {
            window.modeOfTransportMicroWidget.mount(mountProps);
            sessionStorage.setItem("longLoad", false);
            setExistingScript(
              document.getElementById(MODE_OF_TRANSPORT_MICRO_WIDGET_SCRIPT_ID),
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
        window.modeOfTransportMicroWidget.unmount();
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
      <div id="transport-mini-widget"></div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100%;
  margin-top: 18px;
`;
