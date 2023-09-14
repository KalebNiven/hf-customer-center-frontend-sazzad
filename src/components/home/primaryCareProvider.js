import styled from "styled-components";
import React from 'react';
import GlobalStyle from "../../styles/GlobalStyle";
import { useSelector } from "react-redux";
import moment from 'moment';
import { AnalyticsPage, AnalyticsTrack } from "../../components/common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import ExternalSiteLink from '../common/externalSiteLink';

const PrimaryCareProvider = () => {

  const pcpDetails = useSelector((state) => state.pcp.pcpDetails);
  const customerInfo = useSelector(state => state.customerInfo) 

 

  const checkIfOpened = (openTime, closeTime) => {
    const open = moment(openTime);
    const close = moment(closeTime);
    const now = moment();
    return now.isBetween(open, close);
  };

  const checkOpeningToday = (openTime) => {
    const open = moment(openTime);
    const now = moment();
    return open.isAfter(now);
  };

  const workdays = (workday) => {
    if (workday !== undefined) {
      let msg = '';
      let dot = '';
      let status = '';
      const day = moment().day();
      // const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
      const today = moment().format("dddd");
      // const today = days[day];
      const currentTime = moment();
      const format = "hh:mm:ss";
      const todaySchedule = workday[today.toLowerCase()];
      const timeZone = 'ET';
      if (todaySchedule && todaySchedule.openAllHours) {
        msg = "Open 24 Hours"
      }
      else if (todaySchedule && checkIfOpened(todaySchedule.openTime, todaySchedule.closeTime)) {
        const formatteDate = moment(todaySchedule.closeTime).format("hh:mm A ");
        msg = `- Closes at ${formatteDate} ${timeZone}`;
        status = `Open`;
      }
      else if (todaySchedule && checkOpeningToday(todaySchedule.openTime)) {
        const formatteDate = moment(todaySchedule.openTime).format("hh:mm A ");
        msg = ` - Opens Today at ${formatteDate} ${timeZone}`;
        status = `Closed`;
      }
      else {
        const tomorrow = moment().add(1, "days").format("dddd");
        const tmrwSchedule = workday[tomorrow.toLowerCase()];
        if (tmrwSchedule !== null) {
          if (tmrwSchedule.openAllHours) {
            msg = ` - Opens tomorrow for 24 hours`;
            status = `Closed`;
          }
          else {
            const formatteDate = moment(tmrwSchedule.openTime).format("hh:mm A ");
            msg = `- Opens tomorrow ${formatteDate} ${timeZone}`;
            status = `Closed`;
          }
        }
        else {
          Array.from(Array(8).keys()).map((value) => {
            if (msg === '' && value > 1) {
              const nextOpeningDay = moment().add(value, "days").format("dddd");
              const nextOpeningDayTime = workday[nextOpeningDay.toLowerCase()];
              if (nextOpeningDayTime) {
                if (nextOpeningDayTime.openAllHours) {
                  status = 'Closed';
                  msg = ` - Opens ${nextOpeningDay} for 24 hours`
                } else {
                  const formatteDate = moment(nextOpeningDayTime.openTime).format(
                    "hh:mm A "
                  );
                  status = 'Closed';
                  msg = ` - Opens ${nextOpeningDay} at ${formatteDate} ${timeZone}`
                }
              }
            }
            return value;
          });
        }
      }


      return (<StatusSection>
        <StatusIcon statusIcn={status} />
        <StatusTxt><b>{status}</b>{msg}</StatusTxt>
      </StatusSection>
      )
    }
  }

  const handleClick = (label) => {
    if(label === 'View or Change Primary Care Provider'){
      window.location.href = "/findcare";
    }
    handleSegmentBtn(label)
  }

  const handleSegmentBtn = (label) => {
    AnalyticsPage({
      "path": window.location.pathname ,
      "referrer": '',
      "search": '',
     "title": 'Member Portal | Healthfirst',
      "url":  window.location.href
    }
    );

    AnalyticsTrack(
      label === 'External Link Clicked'? label + " " :label + " " + "link clicked" ,
      customerInfo,
      {
        "raw_text": label,
        "destination_url": label === 'External Link Clicked'? 'Google Maps Link Clicked': '/findcare',
        "description": label === 'External Link Clicked'? 'Google Maps Link Clicked': '/findcare',
        "category": ANALYTICS_TRACK_CATEGORY.home,
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

  const openGoogleMaps = (address) => {
    window.open(
      `https://www.google.com/maps?q=${address}`
    );
  };

  return (pcpDetails !== undefined && pcpDetails !== null && Object.keys(pcpDetails).length > 0 &&
    <> <GlobalStyle />
      <PcpTxt>
        Primary Care Provider
      </PcpTxt>
      <Card className="pcp-coachmark">
        <PcpProvider>
          <ProviderImage alt = "" src="/react/images/icon_care_providers.svg" />
          <PcpDetails>
            <ProviderName>{pcpDetails.name !== undefined && pcpDetails.name.toLowerCase()}</ProviderName>
            <Practice>
              {pcpDetails.practice !== undefined && pcpDetails.practice.toLowerCase()}
            </Practice>
          </PcpDetails>
        </PcpProvider>
        {workdays(pcpDetails.workDays)}
        <ExternalSiteLink link={`https://www.google.com/maps?saddr=Current+Location&daddr= ${pcpDetails.address}`} label = "GoogleMaps" target="_blank" styles={{cursor: "pointer"}}>
        <Section>
          <LocationIcon alt = "" src="/react/images/icn-map-blue.svg" />
          <AddressTxt onClick={() =>   handleClick('External Link Clicked')}>
              {pcpDetails.address !== undefined && pcpDetails.address.toLowerCase()}
          </AddressTxt>
        </Section>
        </ExternalSiteLink>
        <Section  onClick={() =>   handleClick('View or Change Primary Care Provider')}>
          <PcpIcon alt = "" src="/react/images/icn-pcpuser.svg" />
          <ViewChangePcp>View or Change Primary Care Provider</ViewChangePcp>
        </Section>
      </Card>
    </>
  )
};

export default PrimaryCareProvider;

const PcpTxt = styled.div`
  flex-grow: 0;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
  margin-bottom : 24px;
`;

const Card = styled.div`
  flex-grow: 0;
  margin: 16px 0;
  padding: 16px 14px 16px 16px;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px 0 #d8d8d8;
`;

const PcpProvider = styled.div`
  display:flex;
`;

const ProviderImage = styled.img`
  width: 32px;
  height: 32px;
  flex-grow: 0;
  padding: 8px 2px 8px 2px;
  background-color: #eeeeee;
  border-radius: 20px;
`;

const PcpDetails = styled.div``;

const ProviderName = styled.div`
  margin: 0 2px 2px 10px;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.13;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  text-transform:capitalize;
`;

const Practice = styled.div`
margin: 2px 2px 12px 10px;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  text-align: left;
  color: #474b55;
  text-transform:capitalize;
`;

const Section = styled.div`
  display:flex;
  &:hover{
    cursor:pointer;
  }
`;

const StatusSection = styled.div`
  display:flex;
`;

const StatusIcon = styled.p`
  width: 6px;
  height: 6px;
  margin-left:14px;
  background-color: #529535;
  border-radius: 20px;
  flex-grow: 0;
  background-color: ${props => props.statusIcn === 'Closed' ? `#a8abac` : `#529535`};
`;

const StatusTxt = styled.p`
  flex-grow: 0;
  margin: -5px 0px 8px 10px;
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
`;

const LocationIcon = styled.img`
  width: 16px;
  height: 16px;
  flex-grow: 0;
  margin: 9px 6px 31px 10px;
  object-fit: contain;
`;

const AddressTxt = styled.p`
  flex-grow: 0;
  margin: 8px 0 16px 0px;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: left;
  color: #008bbf;
  text-transform:capitalize;
  &:hover{
    cursor:pointer;
    color:#2A6A9E;
    text-decoration:underline;
  }
`;

const PcpIcon = styled.img`
  width: 16px;
  height: 16px;
  flex-grow: 0;
  margin: 0 6px 0 10px;
  object-fit: contain;
`;

const ViewChangePcp = styled.p`
  flex-grow: 0;
  margin: 0 0 0 0px;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #008bbf;
  &:hover{
    cursor:pointer;
    color:#2A6A9E;
    text-decoration:underline;
  }
`;
