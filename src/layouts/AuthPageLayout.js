import React from "react";
import { useClient } from "@splitsoftware/splitio-react";
import PermissionDenied from "../components/common/PermissionDenied";

const AuthPageLayout = ({ children, splitFeatureName, ignoreSplit }) => {
  if (ignoreSplit) return children;

  const splitHookClient = useClient();
  const feature = splitHookClient.getTreatmentWithConfig(splitFeatureName);

  switch (feature.treatment) {
    case "on":
      return children;
    case "off":
      return <PermissionDenied />;
    case "control":
      return <></>;
    default:
      return <></>;
  }
};

export default AuthPageLayout;
