
import { AnalyticsTrack } from "../common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";


export const handleSegmentForAuth = (href, rawText, description, type, location ) =>{
    AnalyticsTrack(
      rawText + " " + "button clicked",
      "",
      {
        "raw_text": rawText,
        "destination_url": href.includes('https://') ? href : window.location.origin + href,
        "description": description,
        "category": ANALYTICS_TRACK_CATEGORY.registration,
        "type":  type === "button" ? ANALYTICS_TRACK_TYPE.buttonClicked : ANALYTICS_TRACK_TYPE.linkClicked, 
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