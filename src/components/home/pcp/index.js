import React from "react";
import { useClient } from "@splitsoftware/splitio-react";
import PCPMiniWidget from "./pcpMiniWidget";
import PrimaryCareProvider from "./primaryCareProvider";
import { SHOW_PCP_MINI_WIDGET } from "../../../constants/splits";
import { getSplitAttributes } from "../../../utils/misc";
import { useSelector } from "react-redux";

export default () => {
  const splitHookClient = useClient();
  const customerInfo = useSelector((state) => state.customerInfo);
  const splitAttributes = getSplitAttributes(customerInfo?.data);

  const pcpDetailsSplitTreatment = splitHookClient.getTreatmentWithConfig(
    SHOW_PCP_MINI_WIDGET,
    splitAttributes,
  ).treatment;

  switch (pcpDetailsSplitTreatment) {
    case "on":
      return <PCPMiniWidget />;
    case "legacy":
      return <PrimaryCareProvider />;
    case "off":
      return <></>;
    case "control":
      return <></>;
    default:
      return <></>;
  }
};
