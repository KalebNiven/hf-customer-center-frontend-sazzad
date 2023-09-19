import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import useLogError from "../../hooks/useLogError";
import { getSelectedLang } from "../auth/login/languageSelection.js";

const UpdatedContactInformation = () => {
  const customerInfo = useSelector((state) => state.customerInfo);
  const { logError } = useLogError();

  /** Adding Widget script for Preference Management and Mounting the widget on page load */
  useEffect(() => {

    const jwt_token = customerInfo.data.id_token
    const updatedJwt = (jwt_token === undefined ? jwt_token : jwt_token.replace('Bearer ', ''));

    const mountProps = {
      parentElement: "#widget-container",
      appId: "CC",
      token: updatedJwt,
      isWidget: true,
      widgetPage: 'CONTACT',
      lang: getSelectedLang()|| "en",
    };

    try {
      if (updatedJwt) {
        try {
          { prefManagementWidget?.mount(mountProps); }
        } catch (error) {
          (async () => {
              try {
                  await logError(error);
              } catch (err) {
                  console.error('Error caught: ', err.message);
              }
          })()
        }
      }
    } catch (error) {
      (async () => {
          try {
              await logError(error);
          } catch (err) {
              console.error('Error caught: ', err.message);
          }
      })()
      try {
        prefManagementWidget?.unmount(mountProps);
        prefManagementWidget?.mount(mountProps);
      } catch (error) {
        (async () => {
            try {
                await logError(error);
            } catch (err) {
                console.error('Error caught: ', err.message);
            }
        })()
      }
    }

  }, [customerInfo.data.id_token])

  return (
    <Widget id="widget-container" />
  );

};
export default UpdatedContactInformation;
const Widget = styled.div`

`