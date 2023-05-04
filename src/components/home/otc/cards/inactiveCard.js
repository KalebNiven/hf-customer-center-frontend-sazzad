import React from "react";
import styled from "styled-components";
import {
    CardFooter,
    Card,
    FooterActions,
    FooterBody,
    TooltipIcon,
} from "./styles.js";
import ActivateButton from "./activateButton";
import LearnMoreButton from "./learnMoreButton";
import { usePopperTooltip } from "react-popper-tooltip";

const InactiveCard = ({ handleActivate, handleLearnMore }) => {
    const {
        getArrowProps,
        getTooltipProps,
        setTooltipRef,
        setTriggerRef,
        visible,
    } = usePopperTooltip({ placement: "top" });

    return (
        <Card>
            <CardFooter>
                <FooterBody>
                    <ActivateCTATitleWrapper>
                        <ActivateCTATitle>
                            Activate Your OTC Card
                        </ActivateCTATitle>
                        {visible && (
                            <Align
                                ref={setTooltipRef}
                                {...getTooltipProps({
                                    className: "tooltip-container",
                                })}
                            >
                                <div
                                    {...getArrowProps({
                                        className: "tooltip-arrow",
                                    })}
                                />
                                Click “Activate Card” below to activate your card. For any questions please call Member Services at 1 (888) 260-1010.
                            </Align>
                        )}
                        <CustomTooltipIcon ref={setTriggerRef} />
                    </ActivateCTATitleWrapper>
                    <ActivateCTADesc>
                        Activate your Healthfirst OTC card to start using your
                        allowance.
                    </ActivateCTADesc>
                </FooterBody>
                <FooterActions>
                    <LearnMoreButton handleLearnMore={handleLearnMore} />
                    <ActivateButton handleActivate={handleActivate} />
                </FooterActions>
            </CardFooter>
        </Card>
    );
};

export const Wrapper = styled.div`
    margin-bottom: 1.5rem;
`;

export const ActivateCTATitleWrapper = styled.div`
    position: relative;
    display: flex;
`;


const Align = styled.div`
text-align:left;
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

export const CustomTooltipIcon = styled(TooltipIcon)`
margin :0px 0px 0px 9.33px;
`

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
  margin-bottom:8px;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
`;

export default InactiveCard;