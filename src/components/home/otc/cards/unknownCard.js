import React from 'react'
import styled from 'styled-components';
import { CardHeader, CardBody, CardFooter, Card, FooterActions, FooterBody } from './styles.js'
import OTCBenefitsCenterButton from './otcBenefitsCenterButton'
import LearnMoreButton from './learnMoreButton'

const UnknownCard = ({ handleLearnMore, handleOTCRetryButton }) => {
  return (
    <Card>
        <OTCIcon src="react/images/otc-icon.svg" />
        <CardHeader>
        <BalanceTitle>Account Status</BalanceTitle>
        </CardHeader>
        <CardBody>
        <Balance>Unknown</Balance>
        <Paragraph><Img src="react/images/alert-icon.svg" width="16px" height="16px" margin="0 3px 0 0" /> OTC has failed to connect. <TryAgainBtn onClick={handleOTCRetryButton}>Try again</TryAgainBtn></Paragraph>
        </CardBody>
        <CardFooter>
          <FooterActions>
            <LearnMoreButton handleLearnMore={handleLearnMore} />
            <OTCBenefitsCenterButton />
          </FooterActions>
        </CardFooter>
    </Card>
  )
}

export const Wrapper = styled.div`
  margin-bottom: 1.5rem;
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
  margin-left: 16px;
  margin-bottom: 16px;
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
  margin: 8px 0 4px 0;
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

export const ShowOnlineCardWrapper = styled.div`
  margin-top: 8px;
  padding: 19px 16px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  background: #fff;
  cursor: pointer;
`;

export const ShopOnlineTitle = styled.h4`
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.13;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
`;

export const ShopOnlineIcon = styled.img`
  position: absolute;
  top: 16px;
  right: 16px;
`;

export const Paragraph = styled.div`
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  display: flex;
`;

export const Img = styled.img`
  width: ${props => props.width && props.width};
  height: ${props => props.height && props.height};
  margin: ${props => props.margin && props.margin};
`;

export const TryAgainBtn = styled.span`
  font-weight: bold;
  color: #008bbf;
  margin-left: 3px;
  cursor: pointer;
`;

export default UnknownCard;