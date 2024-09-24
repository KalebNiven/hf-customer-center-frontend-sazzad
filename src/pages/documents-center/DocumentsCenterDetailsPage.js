import React from "react";
import GetDocument from "../../components/documents/getDocument";
import DocumentCenterWidget from "../../components/documents/DocumentCenterWidget";
import { DOCUMENTS_PAGE } from "../../constants/splits";
import { useClient } from "@splitsoftware/splitio-react";
import PermissionDenied from "../../components/common/PermissionDenied";

export default () => {
  const splitHookClient = useClient();
  const documentPageSplitTreatment =
    splitHookClient.getTreatment(DOCUMENTS_PAGE);

  switch (documentPageSplitTreatment) {
    case "on":
      return <DocumentCenterWidget />;
    case "legacy":
      return <GetDocument />;
    case "off":
      return <PermissionDenied />;
    case "control":
      return <></>;
    default:
      return <></>;
  }
};
