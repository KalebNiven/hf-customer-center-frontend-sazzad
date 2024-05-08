import React, { useEffect } from "react";

const HandleSegmentBtn = (props) => {
  const { destination_url, label } = props.item;
  // Segment Track
  AnalyticsTrack(label + " " + "link clicked", customerInfoData, {
    raw_text: label,
    destination_url: destination_url,
    description: label,
    category: ANALYTICS_TRACK_CATEGORY.settings,
    type: ANALYTICS_TRACK_TYPE.linkClicked,
    targetMemberId: customerInfoData?.data?.memberId,
    location: {
      desktop: {
        width: 960,
        value: "left",
      },
      tablet: {
        width: 768,
        value: "right",
      },
      mobile: {
        width: 0,
        value: "right",
      },
    },
  });
};

export default HandleSegmentBtn;
