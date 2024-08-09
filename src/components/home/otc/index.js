import React from "react";
import { useClient } from "@splitsoftware/splitio-react";
import OtcMiniWidget from "./OtcMiniWidget";
import OTC from "./OtcCard";
import { SHOW_OTC_CARD_HOME_PAGE } from "../../../constants/splits";
import { getSplitAttributes } from "../../../utils/misc";
import { useSelector } from "react-redux";

export default () => {
  const splitHookClient = useClient();
  const customerInfo = useSelector((state) => state.customerInfo);
  const splitAttributes = getSplitAttributes(customerInfo?.data);

  const otcCardHomePageSplitTreatment = splitHookClient.getTreatmentWithConfig(
    SHOW_OTC_CARD_HOME_PAGE,
    splitAttributes,
  ).treatment;

  switch (otcCardHomePageSplitTreatment) {
    case "on":
      return <OtcMiniWidget />;
    case "legacy":
      return <OTC />;
    case "off":
      return <></>;
    case "control":
      return <></>;
    default:
      return <></>;
  }
};
