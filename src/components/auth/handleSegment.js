import react from 'react'
import { AnalyticsPage, AnalyticsTrack } from "../common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";

export const handleSegment = (href, eachNavLabel,customerInfo) =>{
    // Segment Track
    AnalyticsPage()
    AnalyticsTrack(
      eachNavLabel + " " + "button clicked",
      customerInfo,
      {
        "raw_text": eachNavLabel,
        "destination_url": href === "/payments" ? customerInfo.data.paymentsUrl : window.location.origin + href,
        "destination_url": window.location.origin + href,
        "description": eachNavLabel,
        "category": ANALYTICS_TRACK_CATEGORY.registration,
        "type": ANALYTICS_TRACK_TYPE.linkClicked,
        "targetMemberId": customerInfo?.data?.memberId,
        "location": {
          "desktop": {
            "width": 960,
            "value": href === "member-logout" || href === "/settings" ? "right" : "top"
          },
          "tablet": {
            "width": 768,
            "value": "right"
          },
          "mobile": {
            "width": 0,
            "value": "right"
          }
        }
      }
    );

} 