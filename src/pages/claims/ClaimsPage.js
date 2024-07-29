import { useClient } from "@splitsoftware/splitio-react";
import React from "react";
import PermissionDenied from "../../components/common/PermissionDenied";
import ClaimsPage from "../../components/claims/claimsPage";
import ClaimsWidget from "../../components/claims/ClaimsWidget";
import { CLAIMS_PAGE } from "../../constants/splits";
import PageLayout from "../../layouts/PageLayout";

export default () => {
  const splitHookClient = useClient();
  const claimsPageSplitTreatment = splitHookClient.getTreatment(CLAIMS_PAGE);

  switch (claimsPageSplitTreatment) {
    case "on":
      return <ClaimsWidget />;
    case "legacy":
      return <ClaimsPage />;
    case "off":
      return <PermissionDenied />;
    case "control":
      return <></>;
    default:
      return <></>;
  }
};
