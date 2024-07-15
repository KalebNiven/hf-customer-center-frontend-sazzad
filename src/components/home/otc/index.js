import React from "react";
import { useClient } from "@splitsoftware/splitio-react";
import OtcMiniWidget from "./OtcMiniWidget";
import OTC from "./OtcCard";
import { SHOW_OTC_CARD_HOME_PAGE } from "../../../constants/splits";

export default () => {
  const splitHookClient = useClient();
  const otcCardHomePageSplitTreatment = splitHookClient.getTreatment(
    SHOW_OTC_CARD_HOME_PAGE,
  );

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
