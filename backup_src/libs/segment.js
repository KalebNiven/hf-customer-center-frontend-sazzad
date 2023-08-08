import { AnalyticsTrack } from "../components/common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../constants/segment";


export const handleSegmentClick = (href, rawText, description, type, location, customerInfo, category) =>{
   
    AnalyticsTrack(
      rawText + " " + type +" clicked",
      customerInfo,
      {
        "raw_text": rawText,
        "destination_url": href? window.location.origin + href:"N/A",
        "description": description,
        "category": ANALYTICS_TRACK_CATEGORY[category],
        "type":  type === "button" ? ANALYTICS_TRACK_TYPE.buttonClicked : ANALYTICS_TRACK_TYPE.linkClicked, 
        "targetMemberId": customerInfo?.data?.memberId,
        "location": {
          "desktop": {
            "width": 960,
            "value": location
          },
          "tablet": {
            "width": 768,
            "value":location
          },
          "mobile": {
            "width": 0,
            "value":location
          }
        }
      }
    );

} 