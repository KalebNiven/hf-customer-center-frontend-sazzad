import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Toaster = (props) => {
  const {
    unmountMe,
    timeout,
    notificationText,
    notificationType,
    notificationLink,
    notificationLinkText,
  } = props;

  const [fade, setFade] = useState("");

  const unmountThis = () => {
    unmountMe();
  };

  const getNotificationTypeParams = (type) => {
    switch (type) {
      case "success":
        return {
          label: "success",
          color: "#4a6f32",
          accent: "#3b5828",
          svg: "/react/images/icon_notification_success.svg",
        };
      case "warning":
        return {
          label: "warning",
          color: "#c44620",
          accent: "#9d3617",
          svg: "/react/images/icon_notification_warning.svg",
        };
      case "error":
        return {
          label: "error",
          color: "#9f262e",
          accent: "#7e1e26",
          svg: "/react/images/icon_notification_error.svg",
        };
      default:
        return {
          label: "default",
          color: "#4a6f32",
          accent: "#3b5828",
          svg: "/react/images/icon_notification_success.svg",
        };
    }
  };

  const dismiss = () => {
    setFade("hf-customer-center-fadeOut");
    setTimeout(() => {
      unmountThis();
    }, 600);
  };

  useEffect(() => {
    if (notificationText && notificationText != null) {
      setFade("hf-customer-center-fadeIn");
      setTimeout(() => {
        // dismiss();
        setFade("hf-customer-center-fadeOut");
        setTimeout(() => {
          unmountMe();
        }, 600);
      }, timeout);
    }
  }, [notificationText]);

  const setNotificationContent = () => {
    if (notificationLink && notificationLink != null) {
      let textNodes = notificationText.split(notificationLinkText);
      return (
        <span>
          {textNodes[0]}
          <ToastLink href={notificationLink} target="_blank">
            {notificationLinkText}
          </ToastLink>
          {textNodes[1]}
        </span>
      );
    } else return notificationText;
  };

  return (
    <ToasterHolder toasterTop={props.toasterTop}>
      <ToasterContainer
        className={fade}
        notificationTypeParams={getNotificationTypeParams(notificationType)}
      >
        <ToasterIcon
          notificationTypeParams={getNotificationTypeParams(notificationType)}
        >
          <img
            src={getNotificationTypeParams(notificationType).svg}
            width={24}
            height={24}
          />
        </ToasterIcon>
        <ToasterText>{setNotificationContent()}</ToasterText>
        <ToasterClose onClick={dismiss}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xlinkHref="http://www.w3.org/1999/xlink"
            width="12"
            height="12"
            viewBox="0 0 16 16"
          >
            <defs>
              <path
                id="pbuxsaep9a"
                d="M14.77 0L16 1.23 9.23 8 16 14.77 14.77 16 8 9.23 1.23 16 0 14.77 6.769 8 0 1.23 1.23 0 8 6.77 14.77 0z"
              />
            </defs>
            <g fill="none" fillRule="evenodd">
              <mask id="x52m408yrb" fill="#fff">
                <use xlinkHref="#pbuxsaep9a" />
              </mask>
              <use fill="#FFF" xlinkHref="#pbuxsaep9a" />
              <g fill="#FFF" mask="url(#x52m408yrb)">
                <path d="M0 0H16V16H0z" />
              </g>
            </g>
          </svg>
        </ToasterClose>
      </ToasterContainer>
    </ToasterHolder>
  );
};

export default Toaster;

Toaster.propTypes = {
  notificationText: PropTypes.string,
  timeout: PropTypes.number,
  notificationType: PropTypes.string,
  unmountMe: PropTypes.func.isRequired,
  toasterTop: PropTypes.string,
};

Toaster.defaultProps = {
  notificationText: "",
  timeout: 5000,
  notificationType: "success",
  toasterTop: "1in",
};

const ToasterHolder = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  position: fixed;
  top: ${(props) => props.toasterTop};
  left: 50%;
  transform: translate(-50%, 0);
  min-height: 0.5in;
  border-radius: 5px;
  z-index: 9999;
`;

const ToasterContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  background: ${(props) =>
    props.notificationTypeParams.color
      ? props.notificationTypeParams.color
      : "#4a6f32"};
  color: white;
  min-height: 0.5in;
  border-radius: 5px;
  opacity: 0;
  width: 100%;
  max-width: 460px;
  margin-left: 1rem;
  margin-right: 1rem;
  &.hf-customer-center-fadeOut {
    opacity: 0;
    transition: opacity 0.6s;
  }
  &.hf-customer-center-fadeIn {
    opacity: 1;
    transition: opacity 0.6s;
  }
  @media only screen and (min-width: 460px) {
    margin: auto;
  } ;
`;

const ToasterIcon = styled.div`
  background: ${(props) =>
    props.notificationTypeParams.accent
      ? props.notificationTypeParams.accent
      : "#3b5828"};
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 0.5em;
  padding-right: 0.5em;
  border-radius: 5px 0px 0px 5px;
`;

const ToasterText = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px;
  padding-right: 0;
`;

const ToasterClose = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em;
  margin-left: auto;
  cursor: pointer;
`;

const ToastLink = styled.a`
  color: #fff;
  font-weight: 500;
  &:hover {
    color: #fff;
  }
`;
