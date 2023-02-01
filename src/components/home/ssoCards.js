import styled from "styled-components";
import React, { useState, useEffect } from "react";
import GlobalStyle from "../../styles/GlobalStyle";
import { useAppContext } from '../../AppContext';
import { useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import {
  SHOW_MANAGE_PRESCRIPTIONS, SHOW_VISION_BENEFITS, SHOW_LAUNCH_TELEDOC, SHOW_SILVER_SNEAKERS,
  SHOW_HEALTH_HSA, SHOW_NATIONSHEARING, SHOW_DENTAQUEST, SHOW_OTCNETWORK, SHOW_NATIONSOTC, SHOW_PRIMARY_CARE_PROVIDER,
  SHOW_COVERAGE_AND_BENEFITS, SHOW_CLAIMS, SHOW_AUTHS, SHOW_MYHEALTH, SHOW_ESTIMATECOST, SHOW_SUGGESTION_CARDS, SHOW_EXTERNAL_LINK_CARDS, SHOW_COST_ESTIMATOR_WIDGET
} from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";
import ExternalSiteLink from '../common/externalSiteLink';
import ExternalSiteLinkSSO from '../common/externalSiteLinkSSO';
import { AnalyticsPage, AnalyticsTrack } from "../../components/common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import { useClient } from "@splitsoftware/splitio-react";
import { SSO } from '../overTheCounter/config'

const SSOCards = () => {

  const history = useHistory();

  const { innerWidth } = useAppContext();
  const customerInfo = useSelector((state) => state.customerInfo?.data);

  const { MIX_REACT_APP_OTC_NETWORK_HREF } = process.env;
  const { MIX_REACT_APP_TELADOC_HREF } = process.env;
  const { MIX_REACT_APP_DAVIS_VISION_HREF } = process.env;
  const { MIX_REACT_APP_DENTAQUEST_HREF } = process.env;
  const { MIX_REACT_APP_CVS_HREF } = process.env;
  const { MIX_REACT_APP_NATIONS_OTC_HREF } = process.env;
  const { MIX_REACT_APP_SILVER_SNEAKERS_HREF } = process.env;
  const { MIX_REACT_APP_HEALTH_EQUITY_HREF } = process.env;
  const { MIX_REACT_APP_NATIONS_HEARING_HREF } = process.env;

  const [costEstimatorWidgetEnabled, setCostEstimatorWidgetEnabledEnabled] = useState(false);

  const splitAttributes = {
    lob: customerInfo.sessLobCode,
    companyCode: customerInfo.companyCode,
    benefitPackage: customerInfo.benefitPackage,
    membershipStatus: customerInfo.membershipStatus,
    accountStatus: customerInfo.accountStatus,
  }

  const splitHookClient = useClient(customerInfo.customerId === null ? 'Anonymous' : customerInfo.customerId)

  useEffect(() => {
      if(!splitHookClient) return;
          const showCostEstimatorWidgetTreatment = splitHookClient.getTreatmentWithConfig(SHOW_COST_ESTIMATOR_WIDGET, splitAttributes)
          setCostEstimatorWidgetEnabledEnabled(showCostEstimatorWidgetTreatment.treatment === "off" ? false : showCostEstimatorWidgetTreatment.treatment === "on" ? true : false)
  }, [splitHookClient])

  const SuggestionData = [{ featureName: SHOW_PRIMARY_CARE_PROVIDER, name: "Find a Doctor", img: "react/images/icon_care_providers.svg", routeLink: "findcare" },
  { featureName: SHOW_COVERAGE_AND_BENEFITS, name: "View Benefits", img: "react/images/icon_benefits.svg", routeLink: "coverage-and-benefits" },
  { featureName: SHOW_CLAIMS, name: "View Claims", img: "react/images/icon_claims.svg", routeLink: "claims" },
  { featureName: SHOW_AUTHS, name: "View Authorizations", img: "react/images/icon_authorizations.svg", routeLink: "authorizations" },
  { featureName: SHOW_MYHEALTH, name: "Manage Your Health", img: "react/images/icon_health.svg", routeLink: "communityResources" },
  { featureName: SHOW_ESTIMATECOST, name: "Estimate Cost", img: "react/images/icon_calculator.svg", routeLink: "payments" }];

  const externalLinksData = [{ name: "Manage Prescriptions", desc: "View and manage your prescriptions", img: "react/images/icn-gray-pharmacy.svg", featureName: SHOW_MANAGE_PRESCRIPTIONS, routeLink: MIX_REACT_APP_CVS_HREF, type: SSO },
  { name: "Vision Benefits", desc: "View specialists in your plan's network ", img: "react/images/icn-vision-benefits.svg", featureName: SHOW_VISION_BENEFITS, routeLink: MIX_REACT_APP_DAVIS_VISION_HREF, type: SSO },
  { name: "Launch Teladoc", desc: "24/7 access to care by phone or video chat", img: "react/images/icn-teledoc.svg", featureName: SHOW_LAUNCH_TELEDOC, routeLink: MIX_REACT_APP_TELADOC_HREF, type: SSO },
  { name: "SilverSneakers®", desc: "Fitness programs to keep you active", img: "react/images/icn-silver-sneakers.svg", featureName: SHOW_SILVER_SNEAKERS, routeLink: MIX_REACT_APP_SILVER_SNEAKERS_HREF, type: SSO },
  { name: "HealthEquity HSA", desc: "Discover ways to get more from your benefits  ", img: "react/images/icn-health-equity.svg", featureName: SHOW_HEALTH_HSA, routeLink: MIX_REACT_APP_HEALTH_EQUITY_HREF, type: SSO },
  { name: "Nations Hearing", desc: "Access hearing benefits and affordable hearing aids ", img: "react/images/icn-nations-hearing.svg", featureName: SHOW_NATIONSHEARING, routeLink: MIX_REACT_APP_NATIONS_HEARING_HREF, type: SSO },
  { name: "DentaQuest", desc: "Resources for oral health and wellness", img: "react/images/icn-denta-quest.svg", featureName: SHOW_DENTAQUEST, routeLink: MIX_REACT_APP_DENTAQUEST_HREF, type: SSO },
  { name: "OTC Network", desc: "Activate or check your Healthfirst OTC card balance", img: "react/images/icn-otc-network.svg", featureName: SHOW_OTCNETWORK, routeLink: MIX_REACT_APP_OTC_NETWORK_HREF, type: SSO },
  { name: "NationsOTC", desc: "Use your OTC card to order health/wellness products", img: "react/images/icn-nation-otc.svg", featureName: SHOW_NATIONSOTC, routeLink: MIX_REACT_APP_NATIONS_OTC_HREF, type: SSO }];


  const handleSegmentBtn = (label, routeLink, rawtext) => {
    AnalyticsPage();
    AnalyticsTrack(
      label + " " + "link clicked",
      customerInfo,
      {
        "raw_text": rawtext,
        "destination_url": window.location.pathname,
        "description": label,
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
    (routeLink === 'payments' || routeLink === 'findcare') ? routeLink === 'payments' && costEstimatorWidgetEnabled == true ? window.location.href = "/costEstimator" : window.location.href = "/findcare" : history.push(`/${routeLink}`)
    window.location.href = row?.routeLink
  }

  const displaySuggestionCards = () => {

    let SuggestionCards = <CardRow >
      {
        SuggestionData?.map((row, index) => {
          return (
            <FeatureTreatment
              key={index}
              treatmentName={row?.featureName}
              onLoad={() => { }}
              onTimedout={() => { }}
              attributes={splitAttributes}>

                {row?.routeLink === 'payments' && costEstimatorWidgetEnabled !== true? 
                  <Card innerWidth={innerWidth} > 
                  <ExternalSiteLink  link= "https://hfcostlookup.org/" label ="hfcostlookup" target="_blank" styles={{display: "flex"}}>
                      <SuggestionImage src={row?.img}></SuggestionImage>
                    <SuggestionVerbiage>{row?.name}</SuggestionVerbiage></ExternalSiteLink>
                  </Card>
                :
                <Card onClick={() => handleSegmentBtn(row?.name, row?.routeLink, row?.name, row)} innerWidth={innerWidth}

                >
                  <SuggestionImage src={row?.img}></SuggestionImage>
                  <SuggestionVerbiage>{row?.name}</SuggestionVerbiage>
                </Card>}
            </FeatureTreatment>)
        })

      }
    </CardRow>
    return SuggestionCards;
  }

  const displayExternalLinkCards = () => {

    let externalLinkCards =
      <ExternalLinkCardRow className="servicesDeck-checkmark">
        {
          externalLinksData?.map((row, index) => {
            return (

              <FeatureTreatment
                key={index}
                treatmentName={row?.featureName}
                onLoad={() => { }}
                onTimedout={() => { }}
                attributes={splitAttributes}>
                {
                  row?.type === SSO ?
                    <LinkCard innerWidth={innerWidth}>
                      <ExternalSiteLinkSSO link={row?.routeLink} label={row?.name} target="_blank">
                        <LinkIcon src={row?.img}></LinkIcon>
                        <LinkVerbiage>{row?.name}</LinkVerbiage>
                        <LinkDescription>{row?.desc}</LinkDescription>
                      </ExternalSiteLinkSSO>
                    </LinkCard>
                  :
                  <LinkCard innerWidth={innerWidth}>
                    <ExternalSiteLink link={row?.routeLink} label={row?.name} target="_blank" membershipKey={customerInfo?.hohPlans[0]?.MembershipKey} >
                      <LinkIcon src={row?.img}></LinkIcon>
                      <LinkVerbiage>{row?.name}</LinkVerbiage>
                      <LinkDescription>{row?.desc}</LinkDescription>
                    </ExternalSiteLink>
                  </LinkCard>
                }
              </FeatureTreatment>)
          })}
      </ExternalLinkCardRow>

    return externalLinkCards;
  }

  return (
    <><GlobalStyle />
      <FeatureTreatment
        treatmentName={SHOW_SUGGESTION_CARDS}
        onLoad={() => { }}
        onTimedout={() => { }}
        attributes={splitAttributes}>
        <SuggestionText>What would you like to do?</SuggestionText>
        {displaySuggestionCards()}</FeatureTreatment>
      <FeatureTreatment
        treatmentName={SHOW_EXTERNAL_LINK_CARDS}
        onLoad={() => { }}
        onTimedout={() => { }}
        attributes={splitAttributes}>
        <ExternalLinkTxt>External Links</ExternalLinkTxt>
        {displayExternalLinkCards()}
      </FeatureTreatment>
    </>
  );
};

export default SSOCards;

const CardRow = styled.div`
  width:100%;
  display: flex;
  margin-bottom: 40px;
  flex-wrap: wrap;
  column-gap: 24px;
  row-gap: 16px;
`;

const ExternalLinkCardRow = styled.div`
  width:100%;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 40px;
  gap:8px;
`;

const Card = styled.div`
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  background-color: #ffffff;
  display:flex;
  align-items:center;
  width: ${props => props.innerWidth > 668 ? "calc(50% - 12px)" : "100%"};
  &:hover{
    cursor:pointer;
    background-color: #f3f3f3;
  }
  &:focus {
    cursor:pointer;
    background-color: #e6e6e6;
  }
`;

const LinkCard = styled.div`
  height:142px;
  padding: 16px 8px 26px;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  background-color: #ffffff;
  width: ${props => props.innerWidth > 668 ? "calc(100%/3 - 6px)" : "100%"};
  &:hover {
    cursor:pointer;
    background-color: #f3f3f3;
  }
  &:focus {
    cursor:pointer;
    background-color: #e6e6e6;
  }
`;

const SuggestionVerbiage = styled.p`
  flex-grow: 0;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  margin-left: 10px;
`;

const SuggestionText = styled.div`
  flex-grow: 0;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
  margin-bottom : 1.25rem;
`;

const ExternalLinkTxt = styled.div`
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

const LinkIcon = styled.img`
  width: 40px;
  height: 40px;
  margin: auto;
  display:block; 
  object-fit: contain;
`;

const LinkVerbiage = styled.div`
  margin: 8px 0 4px;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.13;
  letter-spacing: normal;
  text-align: center;
  color: #474b55;
`;

const LinkDescription = styled.div`
  margin: 4px 0 0;
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: center;
  color: #474b55;

`;

const SuggestionImage = styled.img`
  filter : ${props => props.src === "react/images/icon_calculator.svg" && 'opacity(0.3) drop-shadow(0 0 0 #474b55)'};
  width: 24px;
  height: 24px;
  flex-grow: 0;
  object-fit: contain;
`;