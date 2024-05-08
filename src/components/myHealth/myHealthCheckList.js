import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { loadExternalScript } from "../../utils/externalScripts";
import useLogError from "../../hooks/useLogError";
import { getLanguageFromUrl } from "../../utils/misc";

const MY_HEALTH_CHECKLIST_SCRIPT_ID = "myHealthChecklistScript";
const MyHealthCheckList = () => {
  const { MIX_REACT_TRAILBLAZER_WIDGET_BASE_URL } = process.env;
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const jwt_token = customerInfo.id_token;
  const updatedJwt =
    jwt_token === undefined ? jwt_token : jwt_token.replace("Bearer ", "");
  const [existingScript, setExistingScript] = useState(
    document.getElementById(MY_HEALTH_CHECKLIST_SCRIPT_ID)
  );
  const history = useHistory();
  const { logError } = useLogError();

  const events = {
    onNavigateToPrimaryCareProvider: (data) => {
      /* const { pcpId } = data; */
      history.push({ pathname: "/pcp" });
    },
    onNavigateToProviderSearch: (data) => {
      /* const { benefitPackage, groupNumber, year, specialty } = data; */
      history.push({ pathname: "/findcare" });
    },
    onNavigateToRewards: () => {
      history.push({ pathname: "/my-rewards" });
    },
  };

  const mountProps = {
    parentElement: "#mhc-main",
    memberId: customerInfo.memberId,
    appId: "CUSTOMER_CENTER",
    authorizer: "OKTA",
    lang: getLanguageFromUrl(),
    token: updatedJwt,
    defaultPage: "My Health Checklist",
    events: events,
  };

  useEffect(() => {
    if (existingScript) {
      sessionStorage.setItem("longLoad", false);
      try {
        MyHealthChecklistWidget.mount(mountProps);
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
        MIX_REACT_TRAILBLAZER_WIDGET_BASE_URL + "/mhc-widget.js",
        MY_HEALTH_CHECKLIST_SCRIPT_ID,
        () => {
          try {
            MyHealthChecklistWidget.mount(mountProps);
          } catch (error) {
            (async () => {
              try {
                await logError(error);
              } catch (err) {
                console.error("Error caught: ", err.message);
              }
            })();
          }
          sessionStorage.setItem("longLoad", false);
          setExistingScript(
            document.getElementById(MY_HEALTH_CHECKLIST_SCRIPT_ID)
          );
        }
      );
    }
    return () => {
      try {
        MyHealthChecklistWidget.unmount();
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
    <HealthChecklistWrapper>
      <div id="mhc-main"></div>
    </HealthChecklistWrapper>
  );
};

const HealthChecklistWrapper = styled.div`
  height: 100%;
`;
export default MyHealthCheckList;
