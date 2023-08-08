import styled from "styled-components";
import React from "react";
import GlobalStyle from "../../styles/GlobalStyle";
import { useHistory } from 'react-router-dom';
import { useSelector } from "react-redux";
import { AnalyticsPage, AnalyticsTrack } from "../../components/common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";

const PreviousHealthPlan = () => {

  const history = useHistory();
  const customerInfo = useSelector(state => state.customerInfo) 

  const handleClickEvent = (label) =>{
    history.push({
      pathname: '/settings',
      state: { sideBarIndex: 3 }
    })
    handleSegmentBtn(label,'/settings')
    AnalyticsPage()


  }



  const handleSegmentBtn = (label, pathname) => { 

    // Segment Track
    AnalyticsTrack(
      label + " " + "link clicked",
      customerInfo,
      {
        "raw_text": label,
        "destination_url": pathname,
        "description": label,
        "category": ANALYTICS_TRACK_CATEGORY.settings,
        "type": ANALYTICS_TRACK_TYPE.linkClicked,
        "targetMemberId": customerInfo?.data?.memberId,
        "location": {
          "desktop": {
            "width": 960,
            "value": "left"
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

  return (
    <><GlobalStyle />
      <Card>
        <PrevPlanTxt>
          Looking for your previous Healthfirst plan?
        </PrevPlanTxt>
        <ViewPrevPlans onClick = {() => handleClickEvent('View Previous Plans')   }>
          View Previous Plans
        </ViewPrevPlans>
      </Card>
    </>
  );
};

export default PreviousHealthPlan;

const Card = styled.div`
  margin: 0px 0 40px;
  padding: 16px 5px 16px 16px;
  border-radius: 4px;
  background-color: rgba(170, 170, 170, 0.12);
  
`;

const PrevPlanTxt = styled.div`
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: left;
  color:#474b55;
`;

const ViewPrevPlans = styled.div`
  margin: 6px 0px 0 0;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: left;
  color: #3e7128;
  &:hover{
    cursor:pointer;
    text-decoration:underline;
  }
`;