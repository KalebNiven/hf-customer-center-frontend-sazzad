import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { ALERT_STYLES, ALERT_TYPES, LINK_TYPES } from "./config";
import ExternalSiteLink from "../../common/externalSiteLink";
import {
  SHOW_GLOBAL_ALERTS_WARNING,
  SHOW_GLOBAL_ALERTS_INFO,
  SHOW_GLOBAL_ALERTS_DANGER,
  SHOW_GLOBAL_ALERTS_SUCCESS,
} from "../../../constants/splits";
import { FeatureTreatment } from "../../../libs/featureFlags";
import { getSplitAttributes } from "../../../utils/misc";

const GlobalAlerts = ({ alertsList, ignoreSplit }) => {
  const customerInfo = useSelector((state) => state?.customerInfo);
  const splitAttributes = {
    ...(customerInfo?.data && {
      ...getSplitAttributes(customerInfo?.data),
    }),
    pathname: window.location.pathname,
  };
  const [closedAlerts, setClosedAlerts] = useState([]);
  const generateAlertStyling = (alertType) => {
    switch (alertType) {
      case ALERT_TYPES.WARNING:
        return ALERT_STYLES.WARNING;
      case ALERT_TYPES.INFO:
        return ALERT_STYLES.INFO;
      case ALERT_TYPES.DANGER:
        return ALERT_STYLES.DANGER;
      case ALERT_TYPES.SUCCESS:
        return ALERT_STYLES.SUCCESS;
      default:
        return ALERT_STYLES.DEFAULT;
    }
  };

  const getTreatmentName = (alertType) => {
    switch (alertType) {
      case ALERT_TYPES.WARNING:
        return SHOW_GLOBAL_ALERTS_WARNING;
      case ALERT_TYPES.INFO:
        return SHOW_GLOBAL_ALERTS_INFO;
      case ALERT_TYPES.DANGER:
        return SHOW_GLOBAL_ALERTS_DANGER;
      case ALERT_TYPES.SUCCESS:
        return SHOW_GLOBAL_ALERTS_SUCCESS;
      default:
        return SHOW_GLOBAL_ALERTS_WARNING;
    }
  };

  const generateLinkComponent = (link, styles) => {
    if (link.link_type === LINK_TYPES.INTERNAL) {
      const handleClick = (url) => {
        return (window.location.href = url);
      };
      return (
        <BannerLink
          key={link.id}
          onClick={() => handleClick(link.link_url)}
          textColor={styles.textColor}
        >
          {link.link_text}
        </BannerLink>
      );
    }
    if (link.link_type === LINK_TYPES.EXTERNAL) {
      return (
        <ExternalSiteLink
          key={link.id}
          link={link.link_url}
          target="_blank"
          label="GlobalAlerts"
          styles={{ cursor: "pointer" }}
        >
          <BannerLink textColor={styles.textColor}>{link.link_text}</BannerLink>
        </ExternalSiteLink>
      );
    }
  };

  const closeAlert = (id) => {
    window.sessionStorage.setItem(`globalAlertClosed-${id}`, true);
    setClosedAlerts([...closedAlerts, id]);
  };

  return (
    <Wrapper>
      {alertsList.map((alert) => {
        const {
          id,
          alert_type,
          alert_data: {
            alert_message,
            alert_links,
            show_alert_icon,
            show_alert_close_button,
          },
        } = alert;
        const styles = generateAlertStyling(alert_type);
        const alertNotClosed =
          window.sessionStorage.getItem(`globalAlertClosed-${id}`) === null &&
          !closedAlerts?.includes(id);
        return (
          <FeatureTreatment
            treatmentName={getTreatmentName(alert_type)}
            onLoad={() => {}}
            onTimedout={() => {}}
            attributes={splitAttributes}
            ignoreSplit={ignoreSplit}
          >
            {alertNotClosed && (
              <Banner className="no-print" id="bannerContent" key={id}>
                <BannerContent bgColor={styles.bgColor}>
                  {show_alert_icon && (
                    <BannerIcon alt={`banner-icon-${id}`} src={styles.icon} />
                  )}
                  <BannerText textColor={styles.textColor}>
                    {alert_message}
                    {alert_links.map((link) =>
                      generateLinkComponent(link, styles),
                    )}
                  </BannerText>
                  {show_alert_close_button && (
                    <BannerCloseIcon
                      alt={`banner-close-icon-${id}`}
                      src={styles.closeIcon}
                      onClick={() => closeAlert(id)}
                    />
                  )}
                </BannerContent>
              </Banner>
            )}
          </FeatureTreatment>
        );
      })}
    </Wrapper>
  );
};

export const Wrapper = styled.div`
  position: relative;
  z-index: 201;
`;

export const Banner = styled.div``;

export const BannerContent = styled.div`
  min-height: 48px;
  background-color: ${(props) => props.bgColor && props.bgColor};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px 16px;
`;

export const BannerText = styled.p`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: ${(props) => props.textColor && props.textColor};
`;

export const BannerIcon = styled.img`
  margin-right: 12px;
  align-self: baseline;
  width: 24px;
  height: 24px;
`;

export const BannerCloseIcon = styled.img`
  margin-left: 16px;
  margin-right: 12px;
  align-self: baseline;
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

export const BannerLink = styled.span`
  font-weight: 700;
  text-decoration: underline;
  color: ${(props) => props.textColor && props.textColor};
  margin-left: 16px;
  cursor: pointer;
`;

export default GlobalAlerts;
