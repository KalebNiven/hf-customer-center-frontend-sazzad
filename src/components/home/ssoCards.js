import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { useClient } from "@splitsoftware/splitio-react";
import GlobalStyle from "../../styles/GlobalStyle";
import { useAppContext } from '../../AppContext';
import {
  SHOW_DOC,
  SHOW_MANAGE_PRESCRIPTIONS, SHOW_VISION_BENEFITS, SHOW_VISION_BENEFITS_EYEMED, SHOW_LAUNCH_TELEDOC, SHOW_SILVER_SNEAKERS,
  SHOW_HEALTH_HSA, SHOW_NATIONSHEARING, SHOW_DENTAQUEST, SHOW_OTCNETWORK, SHOW_NATIONSOTC, SHOW_PRIMARY_CARE_PROVIDER,
  SHOW_COVERAGE_AND_BENEFITS, SHOW_CLAIMS, SHOW_AUTHS, SHOW_MYHEALTH, SHOW_ESTIMATECOST, SHOW_SUGGESTION_CARDS, SHOW_EXTERNAL_LINK_CARDS, SHOW_COST_ESTIMATOR_WIDGET, SHOW_MANAGE_PRESCRIPTIONS_MEMBERSHIP_TREATMENTS, SHOW_MY_REWARDS, SHOW_HEALTH_ASSESMENT_SURVEY, SHOW_HEALTH_ASSESMENT_SURVEY_CARD,
} from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";
import ExternalSiteLink from '../common/externalSiteLink';
import ExternalSiteLinkSSO from '../common/externalSiteLinkSSO';
import { AnalyticsPage, AnalyticsTrack } from "../../components/common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import { useSSOModalContext } from '../../context/ssoModalContext';
import { NOTICE, SSO } from '../overTheCounter/config';
import NoticeLink from "../common/noticeLink";
import AcknowledgmentModal from "../common/acknowledgmentModal";
import { getSplitAttributesForHOHPlan } from "../../utils/misc";

const SSOCards = () => {

  const history = useHistory();

  const { innerWidth } = useAppContext();
  const customerInfo = useSelector((state) => state.customerInfo);    
  

  const { MIX_REACT_APP_OTC_NETWORK_HREF } = process.env;
  const { MIX_REACT_APP_TELADOC_HREF } = process.env;
  const { MIX_REACT_APP_DAVIS_VISION_HREF } = process.env;
  const { MIX_REACT_APP_DENTAQUEST_HREF } = process.env;
  const { MIX_REACT_APP_CVS_HREF } = process.env;
  const { MIX_APP_DOMAIN } = process.env;
  const { MIX_REACT_APP_NATIONS_OTC_HREF } = process.env;
  const { MIX_REACT_APP_SILVER_SNEAKERS_HREF } = process.env;
  const { MIX_REACT_APP_HEALTH_EQUITY_HREF } = process.env;
  const { MIX_REACT_APP_NATIONS_HEARING_HREF } = process.env;
  const { MIX_REACT_EYE_MED_BASE_URL } = process.env;
  const [showReward, setShowReward] = useState(false);
  const [rewardsEnabled, setRewardsEnabled] = useState(false);
  const [costEstimatorWidgetEnabled, setCostEstimatorWidgetEnabledEnabled] = useState(null);
  const [managePrescriptionNoticeEnabled, setManagePrescriptionNoticeEnabled] = useState(false);

  const splitAttributes = {
    memberId: customerInfo?.data?.memberId,
    customerId: customerInfo?.data?.customerId,
    lob: customerInfo?.data?.sessLobCode,
    companyCode: customerInfo?.data?.hohPlans?.map((plan) => plan.CompanyNumber),
    benefitPackage: customerInfo?.data?.hohPlans?.map((plan) => plan.BenefitPackage),
    membershipStatus: customerInfo?.data?.membershipStatus,
    accountStatus: customerInfo?.data?.accountStatus,
  };

  const splitHookClient = useClient(customerInfo?.data?.customerId === null ? 'Anonymous' : customerInfo?.data?.customerId);

  useEffect(() => {
    splitAttributes.companyCode.map((value, index) => {
      const rewardsEnabledTreatment = splitHookClient.getTreatmentWithConfig(SHOW_MY_REWARDS, getSplitAttributesForHOHPlan(customerInfo.data, index));

      if (!splitHookClient) return;
      const showCostEstimatorWidgetTreatment = splitHookClient.getTreatmentWithConfig(SHOW_COST_ESTIMATOR_WIDGET, splitAttributes);
      console.log('splitHookClient ', splitHookClient);
      console.log('SHOW_COST_ESTIMATOR_WIDGET ', SHOW_COST_ESTIMATOR_WIDGET);
      console.log('splitAttributes ', splitAttributes);
      console.log('showCostEstimatorWidgetTreatmentL ', showCostEstimatorWidgetTreatment);
      const showManagePrescriptionNoticeTreatment = splitHookClient.getTreatmentWithConfig(SHOW_MANAGE_PRESCRIPTIONS, splitAttributes);
      if(showCostEstimatorWidgetTreatment.treatment === "on") setCostEstimatorWidgetEnabledEnabled(true);
      if(showCostEstimatorWidgetTreatment.treatment === "off") setCostEstimatorWidgetEnabledEnabled(false);
      setManagePrescriptionNoticeEnabled(showManagePrescriptionNoticeTreatment.treatment === 'notice');
      setRewardsEnabled(rewardsEnabledTreatment.treatment === "off" ? false : rewardsEnabledTreatment.treatment === "on" ? setShowReward(true) : false);
    });
  }, [splitHookClient, customerInfo, splitAttributes]);

  const SuggestionData = [{
    featureName: SHOW_PRIMARY_CARE_PROVIDER, name: "Find a Doctor", img: "/react/images/icon_care_providers.svg", routeLink: "findcare",
  },
  {
    featureName: SHOW_COVERAGE_AND_BENEFITS, name: "View Benefits", img: "/react/images/icon_benefits.svg", routeLink: "coverage-and-benefits",
  },
  {
    featureName: SHOW_CLAIMS, name: "View Claims", img: "/react/images/icon_claims.svg", routeLink: "claims",
  },
  {
    featureName: SHOW_AUTHS, name: "View Authorizations", img: "/react/images/icon_authorizations.svg", routeLink: "authorizations",
  },
  {
    featureName: SHOW_MYHEALTH, name: "Manage Your Health", img: "/react/images/icon_health.svg", routeLink: "my-health",
  },
  {
    featureName: SHOW_ESTIMATECOST, name: "Estimate Cost", img: "/react/images/icon_calculator.svg", routeLink: "payments",
  },
  {
    featureName: SHOW_DOC,
    name: "View Document Center",
    img: "/react/images/icon_claims.svg",
    routeLink: "document-center",
    className: "documentCenter-coachmark",
    splitAttributes: {
      lob: customerInfo?.data?.sessLobCode,
      companyCode: customerInfo?.data?.hohPlans?.map((plan) => plan.CompanyNumber),
      benefitPackage: customerInfo?.data?.hohPlans?.map((plan) => plan.BenefitPackage),
      accountStatus: customerInfo?.data?.accountStatus,
      membershipStatus: customerInfo?.data?.membershipStatus,
    },
  },
  {
    featureName: SHOW_HEALTH_ASSESMENT_SURVEY_CARD, name: "Health Assessment", img: "/react/images/icon_claims.svg", routeLink: "my-health/annual-health-assessment",
  },
  ];

  const externalLinksData = [{
    name: "Manage Prescriptions", desc: "View and manage your prescriptions", vendor: "CVS Caremark", img: "/react/images/icn-gray-pharmacy.svg", featureName: SHOW_MANAGE_PRESCRIPTIONS, routeLink: MIX_REACT_APP_CVS_HREF, type: managePrescriptionNoticeEnabled ? NOTICE : SSO, membershipSplit: SHOW_MANAGE_PRESCRIPTIONS_MEMBERSHIP_TREATMENTS,
  },
  {
    name: "Vision Benefit", desc: "View specialists in your plan's network ", vendor: "Davis Vision", img: "/react/images/icn-vision-benefits.svg", featureName: SHOW_VISION_BENEFITS, routeLink: MIX_REACT_APP_DAVIS_VISION_HREF, type: SSO,
  },
  {
    name: "Vision Benefit", desc: "View specialists in your plan's network", vendor: "EyeMed", img: "/react/images/icn-vision-benefits.svg", featureName: SHOW_VISION_BENEFITS_EYEMED, routeLink: MIX_REACT_EYE_MED_BASE_URL, type: SSO,
  },
  {
    name: "Launch Teladoc", desc: "24/7 access to care by phone or video chat", vendor: "Teladoc", img: "/react/images/icn-teledoc.svg", featureName: SHOW_LAUNCH_TELEDOC, routeLink: MIX_REACT_APP_TELADOC_HREF, type: SSO,
  },
  {
    name: "Fitness Programs", desc: "Fitness programs to keep you active", vendor: "SilverSneakers", img: "/react/images/icn-silver-sneakers.svg", featureName: SHOW_SILVER_SNEAKERS, routeLink: MIX_REACT_APP_SILVER_SNEAKERS_HREF, type: SSO,
  },
  {
    name: "HSA", desc: "Discover ways to get more from your benefits  ", vendor: "HealthEquity HSA", img: "/react/images/icn-health-equity.svg", featureName: SHOW_HEALTH_HSA, routeLink: MIX_REACT_APP_HEALTH_EQUITY_HREF, type: SSO,
  },
  {
    name: "Hearing Benefit", desc: "Access hearing benefits and affordable hearing aids ", vendor: "NationsHearing", img: "/react/images/icn-nations-hearing.svg", featureName: SHOW_NATIONSHEARING, routeLink: MIX_REACT_APP_NATIONS_HEARING_HREF, type: SSO,
  },
  {
    name: "Dental Benefit", desc: "Resources for oral health and wellness", vendor: "DentaQuest", img: "/react/images/icn-denta-quest.svg", featureName: SHOW_DENTAQUEST, routeLink: MIX_REACT_APP_DENTAQUEST_HREF, type: SSO,
  },
  {
    name: "OTC Network", desc: "Activate or check your Healthfirst OTC card balance", vendor: "", img: "/react/images/icn-otc-network.svg", featureName: SHOW_OTCNETWORK, routeLink: MIX_REACT_APP_OTC_NETWORK_HREF, type: SSO,
  },
  {
    name: "NationsOTC", desc: "Use your OTC card to order health/wellness products", vendor: "", img: "/react/images/icn-nation-otc.svg", featureName: SHOW_NATIONSOTC, routeLink: MIX_REACT_APP_NATIONS_OTC_HREF, type: SSO,
    
  }];

  const handleSegmentBtn = (label, routeLink, rawtext, row) => {
    AnalyticsPage();
    AnalyticsTrack(
      `${label} ` + `link clicked`,
      customerInfo,
      {
        raw_text: rawtext,
        destination_url: window.location.pathname,
        description: label,
        category: ANALYTICS_TRACK_CATEGORY.home,
        type: ANALYTICS_TRACK_TYPE.linkClicked,
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
      },
    );

    if (routeLink === 'payments' && costEstimatorWidgetEnabled !== null && costEstimatorWidgetEnabled === true) {
      return history.push(`/costEstimator`);
    }
    return history.push(`/${routeLink}`);
  };
  function RewardsCard(data) {
    return (
      <Card
        className={data.data?.className}
        onClick={() => handleSegmentBtn(data.data?.name, data.data?.routeLink, data.data?.name, data.data)}
        innerWidth={innerWidth}
      >
        <SuggestionImage alt="" src={data.data?.img} />
        <SuggestionVerbiage>{data.data?.name}</SuggestionVerbiage>
      </Card>
    );
  }

  const displaySuggestionCards = () => {
    const isDual = customerInfo.data.hohPlans.filter((plan) => plan.MembershipStatus === "active").length > 1;
    SuggestionData.push({
      featureName: SHOW_MY_REWARDS, name: "View My Rewards", img: "/react/images/icn-coin-grey.svg", routeLink: "my-rewards",
    });
    const SuggestionCards = (
      <CardRow>
        {
        SuggestionData?.map((row, index) => (
          <>
            <FeatureTreatment
              key={index}
              treatmentName={row?.featureName}
              onLoad={() => { }}
              onTimedout={() => { }}
              attributes={row.splitAttributes ? row.splitAttributes : splitAttributes}>
              {console.log('costEstimatorWidgetEnabled: ', costEstimatorWidgetEnabled)}
              {row?.routeLink === 'payments' && costEstimatorWidgetEnabled !== null && costEstimatorWidgetEnabled !== true

                ? (
                  <ExternalSiteLink link="https://hfcostlookup.org/" label="hfcostlookup" target="_blank" styles={{ display: "flex" }}>
                    <Card>
                      <SuggestionImage alt="" src={row?.img} />
                      <SuggestionVerbiage>{row?.name}</SuggestionVerbiage>
                      <SizedBox />
                    </Card>
                  </ExternalSiteLink>
                )
                : (
                  <Card
                    className={row?.className}
                    onClick={() => handleSegmentBtn(row?.name, row?.routeLink, row?.name, row)}
                    innerWidth={innerWidth}
                  >
                    <SuggestionImage alt="" src={row?.img} />
                    <SuggestionVerbiage>{row?.name}</SuggestionVerbiage>
                  </Card>
                )}
            </FeatureTreatment>
            { showReward && isDual && row?.name == "View My Rewards" && <RewardsCard data={row} />}
          </>
        ))

      }
        <AcknowledgmentModal />
      </CardRow>
    );
    return SuggestionCards;
  };

  const getExternalCard = (row) => {
    switch (row?.type) {
      case SSO:
        return (
          // Keep If loop check here...
          <LinkCard innerWidth={innerWidth}>
            <ExternalSiteLinkSSO link={row?.routeLink} label={row?.name} membershipSplit={row?.membershipSplit} featureNameSplit={row?.featureName} target="_blank">
              <LinkIcon alt="" src={row?.img} />
              <LinkVerbiage>{row?.name}</LinkVerbiage>
              <LinkDescription>{row?.desc}</LinkDescription>
              <LinkVendor>{row?.vendor}</LinkVendor>
            </ExternalSiteLinkSSO>
          </LinkCard>
        );
      case NOTICE:
        return (
          <LinkCard innerWidth={innerWidth}>
            <NoticeLink label={row?.name}>
              <LinkIcon alt="" src={row?.img} />
              <LinkVerbiage>{row?.name}</LinkVerbiage>
              <LinkDescription>{row?.desc}</LinkDescription>
              <LinkVendor>{row?.vendor}</LinkVendor>
            </NoticeLink>
          </LinkCard>
        );
      default:
        return (
          <LinkCard innerWidth={innerWidth}>
            <ExternalSiteLink link={row?.routeLink} label={row?.name} target="_blank" membershipKey={customerInfo?.data?.hohPlans[0]?.MembershipKey}>
              <LinkIcon alt="" src={row?.img} />
              <LinkVerbiage>{row?.name}</LinkVerbiage>
              <LinkDescription>{row?.desc}</LinkDescription>
            </ExternalSiteLink>
          </LinkCard>
        );
    }
  };

  const displayExternalLinkCards = () => {
    const externalLinkCards = (
      <ExternalLinkCardRow className="servicesDeck-checkmark">
        {
          externalLinksData?.map((row, index) => (
            <FeatureTreatment
              key={index}
              treatmentName={row?.featureName}
              onLoad={() => { }}
              onTimedout={() => { }}
              attributes={splitAttributes}
              showUnlessOff
            >
              {
                  getExternalCard(row)
                }
            </FeatureTreatment>
          ))
}
      </ExternalLinkCardRow>
    );

    return externalLinkCards;
  };

  return (
    <>
      <GlobalStyle />
      <FeatureTreatment
        treatmentName={SHOW_SUGGESTION_CARDS}
        onLoad={() => { }}
        onTimedout={() => { }}
        attributes={splitAttributes}
      >
        <SuggestionText>What would you like to do?</SuggestionText>
        {displaySuggestionCards()}
      </FeatureTreatment>
      <FeatureTreatment
        treatmentName={SHOW_EXTERNAL_LINK_CARDS}
        onLoad={() => { }}
        onTimedout={() => { }}
        attributes={splitAttributes}
      >
        <ExternalLinkTxt>External Links</ExternalLinkTxt>
        {displayExternalLinkCards()}
      </FeatureTreatment>
    </>
  );
}

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

const SizedBox = styled.div`
width:143px;
heigth:56px;
border-radius: 4px;
box-shadow: 0 2px 8px 0 #d8d8d8;
background-color: #ffffff;
 &:hover{
    cursor:pointer;
    background-color: #f3f3f3;
  }
  &:focus {
    cursor:pointer;
    background-color: #e6e6e6;
  }

  @media only screen and (max-width: 1024px) {
    width:95px;
  }
  @media only screen and (max-width: 768px) {
    width:115px;
  }
  @media only screen and (max-width: 425px) {
    width:222px;
  }
`;
export const Card = styled.div`
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.10);
  background-color: #ffffff;
  display:flex;
  align-items:center;
  width: ${(props) => (props.innerWidth > 668 ? "calc(50% - 12px)" : "100%")};
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
  display: flex;
  flex-direction: column;
  padding: 16px 8px 26px;
  border-radius: 4px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.10);
  background-color: #ffffff;
  width: ${(props) => (props.innerWidth > 668 ? "calc(100%/3 - 6px)" : "100%")};
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
  margin: 6px 0 0 0;
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
  margin: 6px 0 0 0;
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: center;
  color: #474b55;

`;

const LinkVendor = styled.div`
  margin: 6px 0 0 0;
  font-size: 12px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 16px;
  letter-spacing: normal;
  text-align: center;
  color: #757575;
`;

const SuggestionImage = styled.img`
  filter : ${(props) => props.src === "/react/images/icon_calculator.svg" && 'opacity(0.3) drop-shadow(0 0 0 #474b55)'};
  width: 24px;
  height: 24px;
  flex-grow: 0;
  object-fit: contain;
`;
