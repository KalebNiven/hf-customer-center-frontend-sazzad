import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import useLogError from "../../../hooks/useLogError";
import { FeatureTreatment } from "../../../libs/featureFlags";
import { loadExternalScript } from "../../../utils/externalScripts";
import { getLanguageFromUrl, getSplitAttributes } from "../../../utils/misc";
import { SHOW_PCP_MINI_WIDGET } from "../../../constants/splits";
import { useAppContext } from "../../../AppContext";

export const PCP_MINI_WIDGET_SCRIPT_ID = "PCPMiniWidgetScript";

export default ({ ignoreSplit }) => {
  const customerInfo = useSelector((state) => state.customerInfo);
  const splitAttributes = getSplitAttributes(customerInfo?.data);
  return (
    <FeatureTreatment
      treatmentName={SHOW_PCP_MINI_WIDGET}
      onLoad={() => {}}
      onTimedout={() => {}}
      attributes={splitAttributes}
      ignoreSplit={ignoreSplit}
    >
      <PCPMiniWidget />
    </FeatureTreatment>
  );
};

function PCPMiniWidget() {
  const { logError } = useLogError();
  const { externalSiteModal, setExternalSiteModal } = useAppContext();
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const memberId = customerInfo?.hohPlans[0]?.MemberId;
  const pcpId = customerInfo?.hohPlans[0]?.pcpId;
  const idToken = customerInfo.id_token;
  const token =
    idToken === undefined ? idToken : idToken.replace("Bearer ", "");
  const [existingScript, setExistingScript] = useState(
    document.getElementById(PCP_MINI_WIDGET_SCRIPT_ID),
  );

  const { MIX_REACT_APP_PROVIDER_BASE_URL, MIX_REACT_APP_PROVIDER_API_KEY } =
    process.env;

  const handleNavigateToFullViewClick = () => {
    window.location.href = "/findcare";
  };

  const handleOpenAddressLinkClick = (addressLink) => {
    if (addressLink) {
      setExternalSiteModal({
        ...externalSiteModal,
        isVisible: true,
        link: addressLink,
        target: "_blank",
        label: "PCP Address",
      });
    }
  };

  const mountProps = {
    parentElement: "#CustomerCenterPCPMiniWidgetApp",
    channel: "customer-center",
    pcpId: pcpId,
    appId: "customer-center",
    widgetId: "PCP",
    apiKey: MIX_REACT_APP_PROVIDER_API_KEY,
    lang: getLanguageFromUrl(),
    memberId,
    token,
    size: "SMALL",
    handleNavigateToFullView: handleNavigateToFullViewClick,
    handleOpenAddressLink: handleOpenAddressLinkClick,
  };

  useEffect(() => {
    if (existingScript) {
      try {
        window.ProviderDirectoryMicroWidget.mount(mountProps);
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
        MIX_REACT_APP_PROVIDER_BASE_URL + "provider-directory-micro-widget.js",
        PCP_MINI_WIDGET_SCRIPT_ID,
        () => {
          try {
            window.ProviderDirectoryMicroWidget.mount(mountProps);
            sessionStorage.setItem("longLoad", false);
            setExistingScript(
              document.getElementById(PCP_MINI_WIDGET_SCRIPT_ID),
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
        window.ProviderDirectoryMicroWidget.unmount();
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
      <div id="CustomerCenterPCPMiniWidgetApp"></div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100%;
  max-height: 315px;
`;
