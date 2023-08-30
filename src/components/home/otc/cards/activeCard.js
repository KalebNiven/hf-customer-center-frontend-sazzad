import React, { useState } from "react";
import styled from "styled-components";
import {
    CardHeader,
    CardBody,
    CardFooter,
    Card,
    FooterActions,
} from "./styles.js";
import Spinner from "../../../common/spinner";
import { useSelector } from "react-redux";
import moment from "moment";
import OTCBenefitsCenterButton from "./otcBenefitsCenterButton";
import LearnMoreButton from "./learnMoreButton";
import OTCReimbursementButton from "./otcReimbursementButton";
import ClaimsCard from "./claimsCard.js";
import ManageOTCWidgetCard from "./manageOTCWidgetCard.js";

const ActiveCard = ({ handleLearnMore, planCode }) => {
    const otcProfile = useSelector((state) => state.otcCard.profile);
    const [showClaimCard, setShowClaimCard] = useState(false);

    return (
        <>
            {showClaimCard && (
                <ClaimsCard isVisible={setShowClaimCard} />
            )}
            {otcProfile.loading ? (
                <Spinner />
            ) : (
                // <Card>
                //     <OTCIcon alt="" src="/react/images/otc-icon.svg" />
                //     <CardHeader>
                //         <BalanceTitle>Remaining Balance</BalanceTitle>
                //     </CardHeader>
                //     <CardBody>
                //         <Balance>${otcProfile?.data?.balance}</Balance>
                //         <Paragraph>
                //             Allowance resets in{" "}
                //             {moment(otcProfile?.data?.balanceReloadDate,"MM-Do-YYYY").format(
                //                 "MMMM YYYY"
                //             )}
                //         </Paragraph>
                //         <ButtonWrapper onClick={() => setShowClaimCard(true)}>
                //             <OTCReimbursementButton />
                //         </ButtonWrapper>
                //     </CardBody>
                //     <CardFooter>
                //         <FooterActions>
                //             <LearnMoreButton
                //                 handleLearnMore={handleLearnMore}
                //             />
                //             <OTCBenefitsCenterButton />
                //         </FooterActions>
                //     </CardFooter>
                // </Card>
                <ManageOTCWidgetCard />
            )}
        </>
    );
};

const ButtonWrapper = styled.div``;
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

export const Paragraph = styled.div`
    font-size: 12px;
    margin-bottom: 8px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: left;
    color: #474b55;
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

export default ActiveCard;
