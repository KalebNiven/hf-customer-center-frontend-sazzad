import React, { useEffect, useState } from "react";
import { useSurveyContext } from "../../context/surveyContext";
import { useSelector } from "react-redux";
import { getLocaleFromUrl } from "../../utils/misc";
import { DIGITAL_SURVEY } from "../../constants/splits";
import { useClient } from "@splitsoftware/splitio-react";
import useLogError from "../../hooks/useLogError";
import { getSplitAttributes } from "../../utils/misc";

// This Component is used to mount Digital Survey widget.
const DigitalSurvey = () => {
  const [mountProps, setMountProps] = useState(null);
  const {
    surveyScript,
    digitalSurveyWidget,
    setDigitalSurveyWidget,
    resetDigitalSurveyWidget,
  } = useSurveyContext();
  const { logError } = useLogError();
  const customerInfoData = useSelector((state) => state.customerInfo?.data);
  const { memberId, id_token } = customerInfoData;
  const splitAttributes = getSplitAttributes(customerInfoData);
  const token =
    id_token === undefined ? id_token : id_token.replace("Bearer ", "");
  const splitHookClient = useClient();
  const { treatment } = splitHookClient.getTreatmentWithConfig(
    DIGITAL_SURVEY,
    splitAttributes,
  );

  useEffect(() => {
    if (!token || !memberId) return;
    setMountProps({
      token: token,
      locale: getLocaleFromUrl(),
      onSurveyDoneClick: () => {},
      onSurveyDoneBackClick: () => {},
      parentElement: "#digital-survey",
      surveyType: "Digital Survey",
      appId: "cc",
      memberId: memberId,
      hideCloseBtn: false,
    });
  }, [token, memberId]);

  useEffect(() => {
    if (treatment !== "on") return;
    if (!mountProps) return;

    if (surveyScript && !digitalSurveyWidget) {
      try {
        const widget = new window.HraWidget(mountProps);
        widget.deployTriggers();
        setDigitalSurveyWidget(widget);
      } catch (error) {
        (async () => {
          try {
            await logError(error);
          } catch (err) {
            console.error("Error caught: ", err.message);
          }
        })();
      }
    }

    return () => {
      resetDigitalSurveyWidget();
    };
  }, [surveyScript, mountProps, treatment]);

  return <>{treatment === "on" && <div id="digital-survey"></div>}</>;
};

export default DigitalSurvey;
