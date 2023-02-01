import React, { useEffect } from 'react'
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux'
import { requestOTCProfile } from '../../../store/actions';
import ActivatingCard from './cards/activatingCard'
import ActiveCard from './cards/activeCard'
import ClosedCard from './cards/closedCard'
import HoldCard from './cards/holdCard'
import InactiveCard from './cards/inactiveCard'
import LostCard from './cards/lostCard'
import UnknownCard from './cards/unknownCard'
import Spinner from '../../common/spinner'
import { SHOW_OTC_CARD_HOME_PAGE, SHOW_SHOP_ONLINE_HOME_PAGE } from "../../../constants/splits";
import { FeatureTreatment } from "../../../libs/featureFlags";
import { useHistory } from "react-router-dom";
import ShopOnlineCard from './cards/shopOnlineCard'
import { AnalyticsTrack } from "../../common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../../constants/segment";

const OTC = () => {
  const dispatch = useDispatch();
  const history = useHistory()

  const customerInfo = useSelector((state) => state.customerInfo);
  const otcProfile = useSelector((state) => state.otcCard.profile);

  useEffect(() => {
    dispatch(requestOTCProfile())
  }, [])

  const handleActivate = (e) => {
    // Segment Track
    AnalyticsTrack(
      "Visit Activate OTC Page Button Clicked", 
      customerInfo,
      {
          "raw_text": e.target.textContent, 
          "destination_url": "/otc/activate-card", 
          "category": ANALYTICS_TRACK_CATEGORY.otc, 
          "type": ANALYTICS_TRACK_TYPE.buttonClicked, 
          "targetMemberId": customerInfo?.data?.memberId,
          "location": {
              "desktop":{
                  "width": 1024,
                  "value": "top right"
              },
              "tablet":{
                  "width": 768,
                  "value": "top right"
              },
              "mobile":{
                  "width": 0,
                  "value": "top right"
              }
          }
      }
    );

    history.push({ pathname: "/otc/activate-card" })
  }

  const handleLearnMore = (e) => {
    // Segment Track
    AnalyticsTrack(
      "Visit Learn More OTC Button Clicked", 
      customerInfo,
      {
          "raw_text": e.target.textContent, 
          "destination_url": "/otc/activate-card", 
          "category": ANALYTICS_TRACK_CATEGORY.otc, 
          "type": ANALYTICS_TRACK_TYPE.buttonClicked, 
          "targetMemberId": customerInfo?.data?.memberId,
          "location": {
              "desktop":{
                  "width": 1024,
                  "value": "top right"
              },
              "tablet":{
                  "width": 768,
                  "value": "top right"
              },
              "mobile":{
                  "width": 0,
                  "value": "top right"
              }
          }
      }
    );

    history.push({ pathname: "/otc/learn-more" })
  }

  const handleOTCRetryButton = (e) => {
    // Segment Track
    AnalyticsTrack(
      "Reload OTC Button Clicked", 
      customerInfo,
      {
          "raw_text": e.target.textContent, 
          "destination_url": "", 
          "category": ANALYTICS_TRACK_CATEGORY.otc, 
          "type": ANALYTICS_TRACK_TYPE.buttonClicked, 
          "targetMemberId": customerInfo?.data?.memberId,
          "location": {
              "desktop":{
                  "width": 1024,
                  "value": "top right"
              },
              "tablet":{
                  "width": 768,
                  "value": "top right"
              },
              "mobile":{
                  "width": 0,
                  "value": "top right"
              }
          }
      }
    );

    dispatch(requestOTCProfile())
  }

  const getOTCTileByStatus = (status) => {
    switch (status) {
      case 11: // Active
        return <ActiveCard handleLearnMore={handleLearnMore} planCode={customerInfo?.data?.planCode} />
      case 3: // Activating
        return <ActivatingCard handleLearnMore={handleLearnMore} />
      case 20: // Closed: Replace Card
      case 21: // Closed: Member is no longer eligible
      case 22: // Closed
      case 23: // Closed: Card Expired
      case 24: // Closed: Redeemed
        return <ClosedCard handleActivate={handleActivate} handleLearnMore={handleLearnMore} />
      case 10: // Pending
      case 2: // Funding
      case 1: // New
        return <InactiveCard handleActivate={handleActivate} handleLearnMore={handleLearnMore} />
      case 12: // On Hold
      case 13: // On Hold by System
        return <HoldCard handleLearnMore={handleLearnMore} statusId={status} />
      case 19: // Lost/Stolen - Pending Replacement Card
        return <LostCard handleActivate={handleActivate} handleLearnMore={handleLearnMore} />
      case 5000: // Unknown
        return <UnknownCard handleLearnMore={handleLearnMore} handleOTCRetryButton={handleOTCRetryButton} />
      default:
        return <></>
    }
  }

  return (
    <>
      { customerInfo?.data &&
        <>
          <FeatureTreatment
            treatmentName={SHOW_OTC_CARD_HOME_PAGE}
            onLoad={() => { }}
            onTimedout={() => { }}
            attributes={{
              planCode: customerInfo.data.planCode,
              companyCode: customerInfo.data.companyCode,
              benefitPackage: customerInfo.data.hohPlans?.map(plan => plan.BenefitPackage),
              membershipStatus: customerInfo.data.membershipStatus,
            }}
          >
            <Wrapper>
              <Title>OTC</Title>
              { otcProfile.data === undefined ?  <UnknownCard handleLearnMore={handleLearnMore} handleOTCRetryButton={handleOTCRetryButton} /> : otcProfile?.data?.statusId ? getOTCTileByStatus(otcProfile?.data?.statusId) : <Spinner /> }
            </Wrapper>
          </FeatureTreatment>

          { !otcProfile?.loading && <FeatureTreatment
            treatmentName={SHOW_SHOP_ONLINE_HOME_PAGE}
            onLoad={() => { }}
            onTimedout={() => { }}
            attributes={{
              planCode: customerInfo.data.planCode,
              companyCode: customerInfo.data.companyCode,
              benefitPackage: customerInfo.data.hohPlans?.map(plan => plan.BenefitPackage),
              membershipStatus: customerInfo.data.membershipStatus,
              otcStatusCode: String(otcProfile?.data?.statusId) // String!
            }}
          >
            <Wrapper>
              <ShopOnlineCard />
            </Wrapper>
          </FeatureTreatment> }
        </>
      }
    </>
  )
}

export const Wrapper = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
`;

export const Title = styled.h3`
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
  /* margin-left: 16px; */
  margin-bottom: 16px;
`;

export const Card = styled.div`
  padding: 16px;
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
  position: relative;
`;

export const OTCIcon = styled.img`
  position: absolute;
  top: 16px;
  right: 16px;
`;

export const HeaderLeft = styled.div`
`;

export const HeaderRight = styled.div`
`;

export const BalanceTitle = styled.h4`
  flex-grow: 0;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
`;

export const Balance = styled.div`
  flex-grow: 0;
  margin: 12px 0 16px 0;
  font-size: 32px;
  font-weight: 900;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
`;

export const ActivateCTATitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
`;

export const ActivateCTADesc = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  margin-top: 4px;
`;

export const ActiveButton = styled.span`
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: right;
  color: #008bbf;
  cursor: pointer;
`;

export default OTC;