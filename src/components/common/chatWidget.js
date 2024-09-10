import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { SHOW_CHAT_WIDGET } from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";
import useLogError from "../../hooks/useLogError";
import { useSurveyContext } from "../../context/surveyContext";
import { getSplitAttributes } from "../../utils/misc";

export const ChatWidget = ({ memberId, jwt, nonce }) => {
  const customerInfo = useSelector((state) => state.customerInfo);
  const splitAttributes = getSplitAttributes(customerInfo?.data);

  return (
    <>
      <FeatureTreatment
        treatmentName={SHOW_CHAT_WIDGET}
        onLoad={() => {}}
        onTimedout={() => {}}
        attributes={splitAttributes}
      >
        <ChatWidgetScript
          memberId={memberId}
          jwt={jwt}
          nonce={nonce}
          removeChatWidget={false}
        />
      </FeatureTreatment>
      <FeatureTreatment
        treatmentName={SHOW_CHAT_WIDGET}
        onLoad={() => {}}
        onTimedout={() => {}}
        attributes={splitAttributes}
        invertBehavior
      >
        <ChatWidgetScript
          memberId={memberId}
          jwt={jwt}
          nonce={nonce}
          removeChatWidget={true}
        />
      </FeatureTreatment>
    </>
  );
};

export const ChatWidgetScript = ({
  memberId,
  removeChatWidget,
  jwt,
  nonce,
}) => {
  const { MIX_CHAT_WIDGET_BASE_URL } = process.env;
  const { logError } = useLogError();
  const {
    digitalSurveyWidget,
    triggerDigitalSurveyByEventName,
    DIGITAL_SURVEY_EVENTS,
  } = useSurveyContext();

  const handleChatWindowClosed = () => {
    // Trigger the survey
    console.log("chat closing... triggering survey", "debug - REMOVE ME");
    if (digitalSurveyWidget) {
      console.log(
        "chat closing..., survery object found triggering survey",
        "debug - REMOVE ME",
      );
      triggerDigitalSurveyByEventName(
        digitalSurveyWidget,
        DIGITAL_SURVEY_EVENTS.CHAT,
      );
    }
  };

  // Chat Widget Integration
  useEffect(() => {
    if (!removeChatWidget) {
      const chatContainer = document.querySelector("#hf-chat-widget-container");
      if (!memberId || !jwt || !nonce) return;
      const script = document.createElement("script");
      script.src = MIX_CHAT_WIDGET_BASE_URL + "/widget.js";
      script.async = true;
      script.onload = () => {
        try {
          window.EmbeddableWidget.mount({
            token: jwt.slice(7), // Slice Bearer part
            nonce: nonce,
            caller: "web",
            memberId: memberId,
            onChatWindowClosed: handleChatWindowClosed,
          });
        } catch (error) {
          (async () => {
            try {
              await logError(error);
            } catch (err) {
              console.error("Error caught: ", err.message);
            }
          })();
        }
      };

      chatContainer.appendChild(script);

      return () => {
        chatContainer.removeChild(script);
        try {
          window.EmbeddableWidget && window.EmbeddableWidget.unmount();
        } catch (error) {
          (async () => {
            try {
              await logError(error);
            } catch (err) {
              console.error("Error caught: ", err.message);
            }
          })();
        }
      };
    } else {
      try {
        window.EmbeddableWidget && window.EmbeddableWidget.unmount();
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
  }, [memberId, jwt, nonce, digitalSurveyWidget]);

  return <></>;
};

export const RemoveChatWidgetScript = ({ memberId }) => {
  // Chat Widget Integration
  useEffect(() => {
    window.EmbeddableWidget && window.EmbeddableWidget.unmount();
    return () => {};
  }, [memberId]);

  return <></>;
};
