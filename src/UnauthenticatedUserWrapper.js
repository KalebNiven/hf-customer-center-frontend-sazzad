import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestGlobalAlerts, requestResetState } from "./store/actions/index";
import { ToastProvider } from "./hooks/useToaster";
import { FeatureFactory } from "./libs/featureFlags";
import { featureFlagOptions } from "./constants/splits";
import Cookies from "js-cookie";
const uuid = Cookies.get("ajs_anonymous_id") || "uuid";
import { useClient } from "@splitsoftware/splitio-react";
import { MAINTENANCE_PAGE } from "./constants/splits";
const { MIX_SPLITIO_KEY } = process.env;
import Maintenance from "./components/maintenance";
import styled from "styled-components";
import GlobalAlerts from "./components/common/globalAlerts";
import { ErrorBoundary } from "react-error-boundary";
import UnrecoverableErrorUnauthenticated from "./components/errors/UnrecoverableErrorUnauthenticated";
import SurveyScript from "./components/scripts/SurveyScript";
import { SurveyContextProvider } from "./context/surveyContext";

const UnauthenticatedUserWrapper = ({ children }) => {
  // Reset Redux Store if not authenticated
  const dispatch = useDispatch();
  const { alertsList } = useSelector((state) => state.globalAlerts);

  useEffect(() => {
    dispatch(requestResetState());
    dispatch(requestGlobalAlerts());
  }, []);

  return (
    <>
      <ErrorBoundary FallbackComponent={UnrecoverableErrorUnauthenticated}>
        <FeatureFactory
          splitKey={MIX_SPLITIO_KEY}
          options={featureFlagOptions}
          uniqueId={uuid}
          trafficType="anonymous"
        >
          {alertsList?.length > 0 && <GlobalAlerts alertsList={alertsList} />}
          <SurveyContextProvider>
            <Wrapper>
              <SurveyScript />
              <ToastProvider>{children}</ToastProvider>
            </Wrapper>
          </SurveyContextProvider>
        </FeatureFactory>
      </ErrorBoundary>
    </>
  );
};

const Wrapper = ({ children }) => {
  // Maintenance Mode
  const splitHookClient = useClient();
  const maintenanceFeature = splitHookClient.getTreatmentWithConfig(
    MAINTENANCE_PAGE
  );
  if (maintenanceFeature?.treatment === "on") return <Maintenance />;
  return children;
};

export default UnauthenticatedUserWrapper;
