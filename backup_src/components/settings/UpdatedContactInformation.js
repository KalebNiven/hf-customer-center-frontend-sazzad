import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import styled from "styled-components";

const UpdatedContactInformation = () => {



  const customerInfo = useSelector((state) => state.customerInfo);



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
    };

    try {
      if (updatedJwt) {
        { prefManagementWidget?.mount(mountProps); }
      }
    } catch (error) {
      prefManagementWidget?.unmount(mountProps);
      prefManagementWidget?.mount(mountProps);
    }

  }, [customerInfo.data.id_token])

  return (
    <Widget id="widget-container" />
  );

};
export default UpdatedContactInformation;
const Widget = styled.div`

`