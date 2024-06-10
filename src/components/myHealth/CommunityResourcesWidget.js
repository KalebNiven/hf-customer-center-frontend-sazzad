import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import useLogError from "../../hooks/useLogError";
import { FeatureTreatment } from "../../libs/featureFlags";
import { loadExternalScript } from "../../utils/externalScripts";
import { getLanguageFromUrl } from "../../utils/misc";
import { COMMUNITY_RESOURCES_WIDGET } from "../../constants/splits";
const COMMUNITY_RES_WIDGET_SCRIPT_ID = "CommResWidgetScript";

export default () => {
  return (
    <FeatureTreatment
      treatmentName={COMMUNITY_RESOURCES_WIDGET}
      onLoad={() => {}}
      onTimedout={() => {}}
      attributes={{}}
    >
      <CommunityResourcesWidget />
    </FeatureTreatment>
  );
};

function CommunityResourcesWidget() {
  const { logError } = useLogError();
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const jwt_token = customerInfo.id_token;
  const memberId = customerInfo?.hohPlans[0]?.MemberId;
  const updatedJwt =
    jwt_token === undefined ? jwt_token : jwt_token.replace("Bearer ", "");
  const [existingScript, setExistingScript] = useState(
    document.getElementById(COMMUNITY_RES_WIDGET_SCRIPT_ID),
  );
  const { MIX_REACT_TRAILBLAZER_WIDGET_BASE_URL } = process.env;

  const mountProps = {
    parentElement: "#community-resources-widget",
    token: updatedJwt,
    memberId: memberId,
    appId: "CUSTOMER_CENTER",
    authorizer: "OKTA",
    lang: getLanguageFromUrl(),
  };

  useEffect(() => {
    if (existingScript) {
      try {
        window.CommunityResourcesWidget.mount(mountProps);
        sessionStorage.setItem("longLoad", false);
      } catch (error) {
        (async () => {
          try {
            await logError(error);
          } catch (err) {
            console.error("Error caught: ", err.message);
          }
        })();
      }
    } else {
      loadExternalScript(
        MIX_REACT_TRAILBLAZER_WIDGET_BASE_URL +
          "/community-resources-widget.js",
        COMMUNITY_RES_WIDGET_SCRIPT_ID,
        () => {
          try {
            window.CommunityResourcesWidget.mount(mountProps);
            sessionStorage.setItem("longLoad", false);
            setExistingScript(
              document.getElementById(COMMUNITY_RES_WIDGET_SCRIPT_ID),
            );
          } catch (error) {
            (async () => {
              try {
                await logError(error);
              } catch (err) {
                console.error("Error caught: ", err.message);
              }
            })();
          }
        },
      );
    }
    return () => {
      try {
        window.CommunityResourcesWidget.unmount();
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
  }, []);

  return (
    <Wrapper>
      <div id="community-resources-widget"></div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100%;
`;
