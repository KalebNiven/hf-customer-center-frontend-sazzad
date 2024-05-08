import React from "react";
import styled from "styled-components";
import {
  CardHeader,
  CardBody,
  CardFooter,
  Card,
  FooterActions,
  TooltipIcon,
} from "./styles.js";
import { usePopperTooltip } from "react-popper-tooltip";
import "../../../../styles/tooltipStyles.css";
import OTCBenefitsCenterButton from "./otcBenefitsCenterButton";
import LearnMoreButton from "./learnMoreButton";
import OTCReimbursementButton from "./otcReimbursementButton.js";

const ActivatingCard = ({ handleLearnMore }) => {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({ placement: "top" });

  return (
    <Card>
      <OTCIcon alt="" src="/react/images/otc-icon.svg" />
      <CardHeader>
        <BalanceTitle>Account Status</BalanceTitle>
      </CardHeader>
      <CardBody>
        <BalanceWrapper>
          <BalanceTitleWrapper>
            <Balance>Activate Your OTC Card</Balance>
          </BalanceTitleWrapper>
          {visible && (
            <div
              ref={setTooltipRef}
              {...getTooltipProps({ className: "tooltip-container" })}
            >
              <div {...getArrowProps({ className: "tooltip-arrow" })} />
              Click “Activate Card” below to activate your card. For any
              questions please call Member Services at 1 (888) 260-1010.{" "}
            </div>
          )}
          <TooltipIcon ref={setTriggerRef} />
        </BalanceWrapper>
        <Paragraph>
          Activate your Healthfirst OTC card to start using your allowance.
        </Paragraph>
      </CardBody>
      <CardFooter>
        <FooterActions>
          <LearnMoreButton handleLearnMore={handleLearnMore} />
          <OTCBenefitsCenterButton />
        </FooterActions>
      </CardFooter>
    </Card>
  );
};

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

export const HeaderLeft = styled.div``;

export const HeaderRight = styled.div``;

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
  font-size: 18px;
  font-weight: 600;
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
  margin-bottom: 8px;
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

export const BalanceTitleWrapper = styled.div``;

export const TooltipCloud = styled.div`
  padding: 12px 16px;
  border-radius: 4px;
  background-color: #003863;
  color: #fff;
  position: absolute;
  min-width: 300px;
  top: -84px;
  left: -145px;
  display: ${(props) => !props.visible && "none"};
  z-index: 1;
`;

export const TooltipCloudTriangle = styled.div`
  width: 0;
  height: 0;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-top: 9px solid #003863;
  position: absolute;
  bottom: -9px;
  right: 138px;
`;

export default ActivatingCard;
