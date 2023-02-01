import React from 'react'
import styled from 'styled-components';
import { CardHeader, CardBody, CardFooter, Card, FooterActions } from './styles.js'
import { usePopperTooltip } from 'react-popper-tooltip';
import '../../../../styles/tooltipStyles.css';
import OTCBenefitsCenterButton from './otcBenefitsCenterButton'
import LearnMoreButton from './learnMoreButton'

const HoldCard = ({ handleLearnMore, statusId }) => {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({ placement: 'top' });

  const generateTooltipMessage = (statusId) => {
    let message = "";
    if(statusId === 12) {
      message = "Your OTC Card has been put on hold upon your request. You can reactivate your card by managing your OTC Benefits Center account. Or you can call Member Services."
    }
    if(statusId === 13) {
      message = "Your OTC Card has been put on hold. This usually happens due to an error within the system. If the issue is not resolved, please, call Member Services at 1 (888) 260-1010 for assistance."
    }
    return message;
  }

  return (
    <Card>
        <OTCIcon src="react/images/otc-icon.svg" />
        <CardHeader>
        <BalanceTitle>Account Status</BalanceTitle>
        </CardHeader>
        <CardBody>
        <BalanceWrapper>
          <BalanceTitleWrapper>
            <Balance>On Hold</Balance>
          </BalanceTitleWrapper>
          {visible && <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container' })}>
              <div {...getArrowProps({ className: 'tooltip-arrow' })} />
              {generateTooltipMessage(statusId)}
          </div>}
          <IconWrapper>
            <TooltipIcon ref={setTriggerRef} />
          </IconWrapper>
        </BalanceWrapper>
        <Paragraph>Please, call Member Services at <b>1 (888) 260-1010</b> to reactivate your card.</Paragraph>
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
`;

export const BalanceWrapper = styled.div`
  position: relative;
  display: flex;
`;

export const BalanceTitleWrapper = styled.div`
`;

export const IconWrapper = styled.div`
  margin-left: 8px;
  position: relative;
`;

export const TooltipIcon = styled.div`
  content: "";
  background-image: url("react/images/info-circle-icon.svg");
  background-position: center;
  background-size: cover;
  width: 16px;
  height: 16px;
  cursor: pointer;

  &:hover {
    background-image: url("react/images/info-circle-icon-blue.svg");
  }
`;

export default HoldCard;