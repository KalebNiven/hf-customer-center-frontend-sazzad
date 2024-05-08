import React from "react";
import { useClient } from "@splitsoftware/splitio-react";
import PermissionDenied from "../components/common/PermissionDenied";

const PublicPageLayout = ({
  children,
  splitFeatureName,
  ignoreSplit,
  attributes,
}) => {
  if (ignoreSplit) return children;

  const splitHookClient = useClient();
  const feature = splitHookClient.getTreatmentWithConfig(
    splitFeatureName,
    attributes,
  );

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

export default PublicPageLayout;
