import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useAppContext } from "../../AppContext";
import { ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import { loadExternalScript } from "../../utils/externalScripts";
import useLogError from "../../hooks/useLogError";
import { getLanguageFromUrl } from "../../utils/misc";

const OTC_WIDGET_SCRIPT_ID = "OTCWidgetScript";

const SSO = "sso";
const otcWidgetLinks = {
  navigateToBenefitsCenter: {
    type: SSO,
    link: process.env.MIX_REACT_APP_OTC_NETWORK_HREF_V2,
  },
  navigateToNationsOTC: {
    type: SSO,
    link: process.env.MIX_REACT_APP_NATIONS_OTC_HREF_V2,
  },
  navigateToOTCNetwork: {
    type: SSO,
    link: process.env.MIX_REACT_APP_OTC_NETWORK_HREF_V2,
  },
  navigateToNationsBenefits: {
    type: SSO,
    link: process.env.MIX_REACT_APP_NATIONS_OTC_HREF_V2,
  },
  navigateToConvey: {
    type: SSO,
    link: process.env.MIX_REACT_APP_NATIONS_OTC_HREF_V2,
  },
};
const OTCWidget = () => {
  const { MIX_REACT_TRAILBLAZER_WIDGET_BASE_URL } = process.env;
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const memberId = customerInfo?.hohPlans[0]?.MemberId;
  const jwt_token = customerInfo.id_token;
  const updatedJwt =
    jwt_token === undefined ? jwt_token : jwt_token.replace("Bearer ", "");
  const [existingScript, setExistingScript] = useState(
    document.getElementById(OTC_WIDGET_SCRIPT_ID),
  );
  const { externalSiteModal, setExternalSiteModal } = useAppContext();
  const { logError } = useLogError();

  const handleExternalSiteClicked = (link, type, action) => {
    let externalSiteData = {
      ...externalSiteModal,
      isVisible: true,
      link: link,
      target: "_blank",
      segmentPageCategory: ANALYTICS_TRACK_CATEGORY.otc,
      segmentTargetMemberId: customerInfo.memberId,
      label: action,
    };
    if (type === SSO)
      externalSiteData["membershipKey"] =
        customerInfo.hohPlans[0].MembershipKey;

    setExternalSiteModal(externalSiteData);
  };

  const events = {
    onOTCInfoLinkClicked: (data) => {
      const { identifier, type, url, action } = data;
      switch (action) {
        case "navigateToBenefitsCenter":
        case "navigateToNationsOTC":
        case "navigateToOTCNetwork":
        case "navigateToNationsBenefits":
        case "navigateToConvey":
          handleExternalSiteClicked(
            otcWidgetLinks[action].link,
            otcWidgetLinks[action].type,
            action,
          );
          break;
        default:
          handleExternalSiteClicked(url, type, action);
          return;
      }
    },
  };

  const mountProps = {
    parentElement: "#otcw-main",
    memberId: memberId,
    appId: "CUSTOMER_CENTER",
    authorizer: "OKTA",
    lang: getLanguageFromUrl(),
    token: updatedJwt,
    events: events,
  };

  useEffect(() => {
    if (existingScript) {
      try {
        window.OTCWidget.mount(mountProps);
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
        MIX_REACT_TRAILBLAZER_WIDGET_BASE_URL + "/otc-widget.js",
        OTC_WIDGET_SCRIPT_ID,
        () => {
          try {
            window.OTCWidget.mount(mountProps);
            sessionStorage.setItem("longLoad", false);
            setExistingScript(document.getElementById(OTC_WIDGET_SCRIPT_ID));
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
        window.OTCWidget.unmount();
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
    <OTCWidgetWrapper>
      <div id="otcw-main"></div>
    </OTCWidgetWrapper>
  );
};

const OTCWidgetWrapper = styled.div`
  height: 100%;
`;
export default OTCWidget;
