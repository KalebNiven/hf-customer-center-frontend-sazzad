import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components';
import SuccessActivation from './SuccessActivation'
import { activateOTCCard, getOTCCardMeta } from '../../store/saga/apis'
import { requestOTCProfile } from '../../store/actions';
import { useSelector, useDispatch } from 'react-redux'
import Spinner from "../common/spinner";
import { SHOW_OTC_CARD_ACTIVATION_PAGE } from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";
import { VALID_STATUS_CODE_FOR_ACTIVATION } from './config'
import { AnalyticsTrack } from "../common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import { generateCardType } from './utils'

const ActivateOTCCardPage = () => {
  const dispatch = useDispatch();
  const [cardInputValue, setCardInputValue] = useState("");
  const [cardError, setCardError] = useState("");
  const [isActivating, setIsActivating] = useState(false);
  const [cardMeta, setCardMeta] = useState({ isLoading: false })
  const [activationSubmitted, setActivationSubmitted] = useState(false);

  const otcProfile = useSelector((state) => state.otcCard.profile.data);
  const customerInfo = useSelector((state) => state.customerInfo);
  const { hohPlans } = customerInfo?.data;

  useEffect(() => {
    dispatch(requestOTCProfile())
  }, [])

  useEffect(() => {
    setCardMeta({ ...cardMeta, isLoading: true })
    getOTCCardMeta().then((data) => setCardMeta({ ...cardMeta, data, isLoading: false }))
  }, [customerInfo])

  const handleCardInputChange = (e) => {
    const value = e.target.value;
    setCardInputValue(value);
    if(cardError.length) setCardError("")
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!cardInputValue.length) return setCardError("Card number is required")
    
    // Segment Track
    AnalyticsTrack(
      "Activate OTC Card Button Clicked", 
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

    setIsActivating(true)
    activateOTCCard(cardInputValue)
    .then((data) => {
      setIsActivating(false)
      console.log('data!: ', data)
      if(data.status === 200) return setActivationSubmitted(true);
      let message = data.data.message;
      setCardError(message)
    })
    .catch(err => {
      console.log('error err: ', err)
      setCardError(err.message)
      setIsActivating(false)
    })
  }

  return (
    <>
      { customerInfo?.data && <FeatureTreatment
            treatmentName={SHOW_OTC_CARD_ACTIVATION_PAGE}
            onLoad={() => { }}
            onTimedout={() => { }}
            attributes={{
              planCode: customerInfo.data.planCode,
              companyCode: customerInfo.data.companyCode,
              benefitPackage: customerInfo.data.hohPlans?.map(plan => plan.BenefitPackage),
              membershipStatus: customerInfo.data.membershipStatus,
            }}
          >
        <PageWrapper>
          { !otcProfile?.statusId ? <Spinner /> : (!VALID_STATUS_CODE_FOR_ACTIVATION.includes(otcProfile?.statusId) || activationSubmitted) ? <SuccessActivation /> : <CardWrapper>
            <Title>{generateCardType(hohPlans)} Card Activation</Title>
            <Subtitle>Enter Your {generateCardType(hohPlans)} Card Number</Subtitle>
            <Description>Enter your {generateCardType(hohPlans)} Card number below to start receiving your allowance.</Description>
            { cardMeta?.data && <VirtualCard>
              <CardImage src={cardMeta?.data[0]?.card_image?.url} />
            </VirtualCard> }
            <ActivationSection onSubmit={handleSubmit}>
                <ActivationSectionTitle>Last 4 Digits of {generateCardType(hohPlans)} Card Number</ActivationSectionTitle>
                <ActivationSectionInputWrapper cardError={cardError}>
                    <ActivationSectionInputImg src={`/react/images/credit-card-icon${cardError && "-red"}.svg`} />
                    <ActivationSectionInput disabled={isActivating} maxLength="4" type="text" placeholder="Enter Last 4 Digits" onChange={handleCardInputChange} value={cardInputValue} cardError={cardError} />
                </ActivationSectionInputWrapper>
                {cardError && <CardErrorMessage>{cardError}</CardErrorMessage>}
                <ActivationSectionButton 
                  loading={isActivating}
                  type={isActivating ? "button" : "submit"}
                >
                  {isActivating ? <LoadingIcon src="/react/images/spinner-icon-white.svg" /> : "Activate Card"}
                </ActivationSectionButton>
            </ActivationSection>
          </CardWrapper> }
        </PageWrapper>
      </FeatureTreatment> }
    </>
  )
}

export const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const CardWrapper = styled.div`
  padding: 32px 24px;
  background-color: #fff;
  width: 360px;
  margin: 64px 0;

  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);

  @media only screen and (max-width: 767px) {
    width: 100%;
  }
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: center;
  color: #003863;
`;

export const Subtitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: center;
  color: #003863;
  margin-top: 24px;
`;

export const Description = styled.p`
    margin-top: 8px;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: normal;
    text-align: center;
    color: #474b55;
`;

export const VirtualCard = styled.div`
  margin: 28px 0;
`;

export const VirtualCardBase = styled.div`
  height: 164px;
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.23);
  padding-top: 32px;
`;

export const VirtualCardStrip = styled.div`
  width: 100%;
  height: 32px;
  background: rgba(0, 0, 0, 0.5);
`;

export const VirtualCardName = styled.h5`
  margin-left: 16px;
  margin-top: 16px;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
`;

export const VirtualCardNumberWrapper = styled.div`
  width: 140px;
  padding: 12px 8px;
  margin-top: 10px;
  margin-left: 8px;
  border-radius: 6px;
  border: solid 2px #529535;
`;

export const VirtualCardNumber = styled.div`
  display: flex;
  align-items: center;
`;

export const VirtualCardNumberText = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 0;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  margin-top: 5px;
`;

export const ActivationSection = styled.form`
`;

export const ActivationSectionTitle = styled.h4`
    font-size: 16px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: left;
    color: ${props => props.cardError ? "#ad122a" : "#474b55" };
    
`;

export const ActivationSectionInputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  border: ${props => props.cardError ? "solid 1px #ad122a" : "solid 1px #a8abac" };
  background-color: #fff;
`;

export const ActivationSectionInputImg = styled.img`
  margin-right: 8px;
`;

export const ActivationSectionInput = styled.input`
  height: 24px;
  flex-grow: 1;
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  outline: none;
  border: none;
  color: ${props => props.cardError && "#ad122a" };

  ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${props => props.cardError ? "#ad122a" : "#a8abac" };
    opacity: 1; /* Firefox */
  }
  :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: ${props => props.cardError ? "#ad122a" : "#a8abac" };
  }
  ::-ms-input-placeholder { /* Microsoft Edge */
    color: ${props => props.cardError ? "#ad122a" : "#a8abac" };
  }
  &:disabled{ background-color: #fff };
`;

export const CardErrorMessage = styled.div`
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.4px;
  text-align: left;
  color: #ad122a;
  margin-top: 4px;
  margin: ${props => props.margin && props.margin};
  text-align: ${props => props.align && props.align};
`;

const SpinnerRotate = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
`;

export const LoadingIcon = styled.img`
  animation-name: ${SpinnerRotate};
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;

export const ActivationSectionButton = styled.button`
  align-self: stretch;
  flex-grow: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #3e7128;
  border: none;
  width: 100%;
  cursor: ${props => props.loading ? "none" : "pointer"};

  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: -0.08px;
  text-align: center;
  color: #fff;
  margin-top: 28px;
  
  &:hover {
    background: ${props => !props.loading && "#517f3d"};
  }
`;

export const CardImage = styled.img`
  width: 100%;
  border-radius: 10px;
`;

export default ActivateOTCCardPage