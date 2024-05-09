import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { createSvgIcon, Grid } from "@material-ui/core";
import Spinner from "../common/spinner";
import ExternalSiteLink from "../common/externalSiteLink";
import { AnalyticsTrack } from "../../components/common/segment/analytics";
import {
  ANALYTICS_TRACK_TYPE,
  ANALYTICS_TRACK_CATEGORY,
} from "../../constants/segment";

const checkNotNull = (workDays) =>
  Object.values(workDays).some((x) => x !== null);

const displayHours = (time) => {
  let dis = "";
  if (time.length > 0) {
    const timeArr = time[0];
    const openTime = timeArr[1].openTime;
    const closeTime = timeArr[1].closeTime;

    // handle "closed" time
    if (!time[0][1].openTime.length && !time[0][1].openTime.closeTime) {
      return (dis = "Closed");
    }

    if (dis !== "") {
      dis = `${dis}, ${openTime} - ${closeTime}`;
    } else {
      dis = `${openTime} - ${closeTime}`;
    }
  }
  return dis;
};

const daysOfWeek = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const openGoogleMaps = (address) => {
  window.open(`https://www.google.com/maps?q=${address}`);
};

const Details = ({ historyState }) => {
  const history = useHistory();

  const icon = useSelector((state) => state.myHealth.currentCategIcon);
  const details = useSelector((state) => state.myHealth.indMapDetails);
  const myHealth = useSelector((state) => state.myHealth);
  const customerInfo = useSelector((state) => state.customerInfo);

  const handleBack = () => {
    history.push({
      pathname: "/my-health/community-resources/category",
      state: historyState,
    });
  };

  const parseDayTime = (timeObj, value) => {
    const timeArray = Object.entries(timeObj);
    const dayValue = timeArray.filter((time) => {
      if (time[0] === value) return time[1];
    });
    return displayHours(dayValue);
  };

  const handleSegmentBtn = (label, data) => {
    AnalyticsTrack(label + " " + "link clicked", customerInfo, {
      raw_text: label,
      destination_url: window.location.pathname,
      description: data,
      category: ANALYTICS_TRACK_CATEGORY.myHealth,
      type: ANALYTICS_TRACK_TYPE.buttonClicked,
      targetMemberId: customerInfo?.data?.memberId,
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

  return myHealth.loading ? (
    <SpinnerWrapper>
      <Spinner />
    </SpinnerWrapper>
  ) : details ? (
    <InnerWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <DetailsCard>
            <Section>
              <Grid item xs={12}>
                <Grid container direction="row" justify="space-between">
                  <Grid item xs={7}>
                    <BackButton onClick={handleBack}>
                      <BackImg src="/react/images/icn-full-arrow.svg" />
                      <BackText>Back</BackText>
                    </BackButton>
                  </Grid>
                  {/* <Grid item xs={5}>
                      <SaveButton>
                        <span>
                          <SaveIcon src="/react/images/icn-bookmark.svg" />
                        </span>
                        <SaveLabel>Save</SaveLabel>
                      </SaveButton>
                    </Grid> */}
                </Grid>
              </Grid>
              <SubDiv>
                <CardImg src={`data:image/svg;base64,${icon}`} />
                <Title>{details.categoryName}</Title>
                <Text>{details.name}</Text>
              </SubDiv>
              <SubHeader>Contact</SubHeader>
              <ContactDiv>
                {details.phone && (
                  <ContactHead>
                    <ContactTextWrapper>
                      <ContactIcon
                        src="/react/images/icn-blue-call.svg"
                        width="13px"
                        height="12px"
                        alt=""
                      />
                      <ContactText
                        href={`tel:${details.phone}`}
                        onclick={handleSegmentBtn(
                          "Phone Number",
                          details.phone,
                        )}
                      >
                        {details.phone}
                      </ContactText>
                    </ContactTextWrapper>
                  </ContactHead>
                )}
                {details.emailAddress && (
                  <ContactHead>
                    <ContactTextWrapper href={`mailto:${details.emailAddress}`}>
                      <ContactIcon
                        src="/react/images/icn-blue-email.svg"
                        width="13px"
                        height="12px"
                        alt=""
                      />
                      <ContactText>{details.emailAddress}</ContactText>
                    </ContactTextWrapper>
                  </ContactHead>
                )}
                {details.website && (
                  <ContactHead>
                    <ExternalSiteLink
                      link={details.website}
                      label={details.website}
                      target="_blank"
                      styles={{ cursor: "pointer" }}
                    >
                      <ContactTextWrapper>
                        <ContactIcon
                          src="/react/images/icn-blue-web.svg"
                          width="13px"
                          height="12px"
                          alt=""
                        />
                        <ContactText>{details.website}</ContactText>
                      </ContactTextWrapper>
                    </ExternalSiteLink>
                  </ContactHead>
                )}
              </ContactDiv>
              {details.workDays && checkNotNull(details.workDays) && (
                <>
                  <SubHeader margin="24px 0 0 0">Hours</SubHeader>
                  <HoursList>
                    {Array.from(Array(8).keys()).map((value, index) => {
                      if (value >= 1) {
                        value = value === 7 ? 0 : value;
                        return (
                          <Day key={index}>
                            <DayOfTheWeek>{`${daysOfWeek[value]}`}</DayOfTheWeek>
                            <DayHrs>
                              {parseDayTime(
                                details.workDays,
                                daysOfWeek[value],
                              )}{" "}
                            </DayHrs>
                          </Day>
                        );
                      }
                    })}
                  </HoursList>
                </>
              )}
            </Section>
          </DetailsCard>
        </Grid>
        <DetailsGrid item xs={12} md={7}>
          <DetailsCard increasedTopMargin>
            <Section>
              <RightNameText>{details.name}</RightNameText>
              <Address>{details.address}</Address>
              {details.address && (
                <ExternalSiteLink
                  link={`https://www.google.com/maps?q=${details.address}`}
                  label="GoogleMaps"
                  target="_blank"
                  styles={{ cursor: "pointer" }}
                >
                  <GetDirectionsWrapper>
                    <GetDirectionsIcon src="/react/images/icn-map-blue.svg" />
                    <GetDirectionsText>Get Directions</GetDirectionsText>
                  </GetDirectionsWrapper>
                </ExternalSiteLink>
              )}
            </Section>
          </DetailsCard>
          {details.services && details.services.length > 0 && (
            <DetailsCard>
              <Section>
                <SubHeader noMargin>Useful to Know</SubHeader>
                {details.services.map((data, idx) => (
                  <MainDiv key={idx} idx={idx}>
                    <LeftImg src="/react/images/icn-green-checkmark.svg" />
                    <ServiceText>{data}</ServiceText>
                  </MainDiv>
                ))}
              </Section>
            </DetailsCard>
          )}
          {(details.feeStructure ||
            (details.languages && details.languages.length > 0)) && (
            <DetailsCard>
              <Section>
                <SubHeader noMargin>About</SubHeader>
                {details.feeStructure && (
                  <>
                    <AboutHeader padding="16px 0 0 0">
                      FEE STRUCTURE
                    </AboutHeader>
                    <AboutText>{details.feeStructure}</AboutText>
                  </>
                )}
                {details.languages && details.languages.length > 0 && (
                  <>
                    <AboutHeader>LANGUAGES</AboutHeader>
                    {details.languages.map((lang, idx) => (
                      <AboutText key={idx}>{lang}</AboutText>
                    ))}
                  </>
                )}
                {details.description && (
                  <AboutDetail>{details.description}</AboutDetail>
                )}
              </Section>
            </DetailsCard>
          )}
        </DetailsGrid>
      </Grid>
    </InnerWrapper>
  ) : null;
};

const SubDiv = styled.div`
  padding: 16px 8px 0px;
  border-radius: 4px;
  background-color: #ffffff;
`;

const CardImg = styled.img`
  width: 48px;
  height: 48px;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const Title = styled.div`
  font-size: 11px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  text-transform: uppercase;
  color: #003863;
  margin-top: 12px;
`;

const Text = styled.div`
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: center;
  text-align: center;
  color: #474b55;
  margin-top: 5px;
  word-break: break-word;
`;

const DetailsCard = styled.div`
  border-radius: 4px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.23);
  background-color: #ffffff;
  width: 100%;
  margin-top: ${(props) => (props.increasedTopMargin ? "141px" : "20px")};

  @media only screen and (max-width: 960px) {
    margin-top: ${(props) => (props.increasedTopMargin ? "-5px" : "20px")};
  }
`;

const MainDiv = styled.div`
  display: flex;
  margin: ${(props) => props.idx === 0 && "10px 0 0 0"};
`;

const BackButton = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
`;

const ContactDiv = styled.div`
  padding-top: 8px;
`;

const BackImg = styled.img`
  margin-right: 2px;
`;

const BackText = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
  margin-top: 2px;
`;

const SubHeader = styled.div`
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #003863;
  border-bottom: 1px solid #d8d8d8;
  padding-bottom: 8px;
  margin-top: ${(props) => (props.noMargin ? "" : "16px")};
  word-break: break-word;
  margin: ${(props) => props.margin && props.margin};
`;

const ContactHead = styled.div`
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #008bbf;
  margin: 10px 0px;
`;

const ContactTextWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ContactIcon = styled.img`
  margin-right: 4px;
`;

const ContactText = styled.a`
  color: #008bbf !important;
  text-decoration: none !important;
  display: flex;
  word-break: break-all;
  cursor: pointer;
`;

const InnerWrapper = styled.div`
  margin: auto;
  margin-bottom: 40px;
  max-width: 1024px;
`;

const SaveButton = styled.div`
  cursor: pointer;
  background-color: #ffffff;
  display: inline-flex;
  margin-top: 13px;
  width: 100%;
  justify-content: right;
`;

const SaveIcon = styled.img`
  height: 16px;
  padding: 0px 5px 0px 0px;
`;

const SaveLabel = styled.a`
  color: #3e7128 !important;
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
`;

const RightNameText = styled.div`
  color: #003863;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  word-break: break-word;
`;

const Address = styled.div`
  color: #474b55;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  margin: 7px 0;
  letter-spacing: normal;
  word-break: break-word;
`;

const LeftImg = styled.img`
  padding: 10px 2px 10px 0;
`;

const GetDirections = styled.div`
  color: #008bbf;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  padding-top: 8px;
  cursor: pointer;
  word-break: break-word;
`;

const ServiceText = styled.div`
  color: #474b55;
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  padding: 5px 2px 0px 5px;
  word-break: break-word;
`;

const AboutHeader = styled.div`
  color: #757575;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  padding-top: 12px;
  padding: ${(props) => props.padding && props.padding};
`;

const AboutText = styled.div`
  color: #474b55;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  word-break: break-word;
`;

const AboutDetail = styled.div`
  color: #474b55;
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  margin-top: 10px;
`;

const Section = styled.div`
  padding: 16px 24px;

  @media only screen and (max-width: 480px) {
    padding: 16px 16px;
  }
`;

const HoursList = styled.div`
  margin-top: 16px;
`;

const Day = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  color: #757575;
  text-transform: capitalize;
  word-break: break-word;
  display: flex;
`;

const DayOfTheWeek = styled.div`
  flex: 0.5;
`;

const DayHrs = styled.p`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  color: #474b55;
  white-space: pre-wrap;
  flex: 1;
`;

const SpinnerWrapper = styled.div`
  padding-top: 100px;
`;

const GetDirectionsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const GetDirectionsIcon = styled.img`
  margin-right: 5px;
  margin-top: 2px;
`;

const GetDirectionsText = styled.div`
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #008bbf;
`;

const DetailsGrid = styled(Grid)({
  "@media (min-width: 960px)": {
    paddingLeft: "24px!important",
  },
});

export default React.memo(Details);
