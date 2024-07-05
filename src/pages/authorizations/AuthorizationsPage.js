import React from "react";
import AuthorizationPage from "../../components/authorizations/authorizationPage";
import { AUTHORIZATIONS_PAGE } from "../../constants/splits";
import AuthorizationsWidget from "../../components/authorizations/AuthorizationsWidget";
import PermissionDenied from "../../components/common/PermissionDenied";
import { useClient } from "@splitsoftware/splitio-react";

export default () => {
  const splitHookClient = useClient();
  const authorizationsPageSplitTreatment =
    splitHookClient.getTreatment(AUTHORIZATIONS_PAGE);

  switch (authorizationsPageSplitTreatment) {
    case "on":
      return <AuthorizationsWidget />;
    case "legacy":
      return <AuthorizationPage />;
    case "off":
      return <PermissionDenied />;
    case "control":
      return <></>;
    default:
      return <></>;
  }
};
