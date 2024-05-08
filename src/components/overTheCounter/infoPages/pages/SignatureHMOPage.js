import React, { useState } from "react";
import {
  Wrapper,
  Hero,
  HeroContentWrapper,
  HeroLeftSection,
  HeroTitle,
  HeroDescription,
  HeroRightSection,
  HeroCard,
  HeroCardHeading,
  HeroCardBalanceWrapper,
  HeroCardBalance,
  HeroCardBalanceFrequency,
  HeroCardPlanName,
  HeroCardNote,
  ModalParagraph,
  Body,
  Heading,
  BodyDescription,
  HowItWorksContentWrapper,
  StepsToActiveList,
  StepsToActiveListItem,
  StepsToActiveListItemItemNumberWrapper,
  StepsToActiveListItemItemNumber,
  StepsToActiveListItemHeading,
  Paragraph,
  StepsToActiveListItemNote,
  ParticipatingLocationsWrapper,
  ParticipatingLocationsTitle,
  ParticipatingLocationsSubTitle,
  ParticipatingLocationsLogosWrapper,
  ParticipatingLocationsNote,
  WaysToSpendWrapper,
  WaysToSpendCards,
  WaysToSpendCard,
  WaysToSpendCardIcon,
  WaysToSpendCardTitle,
  WaysToSpendCardDescription,
  WaysToSpendCardButton,
  LimitationSectionWrapper,
  LimitationSectionTitle,
  StepsToActiveListItemContent,
  LimitationsContent,
  LimitationsListItem,
  LimitationsList,
  PhoneBold,
} from "../styles";
import Modal from "../components/modal";
import CoverageNote from "../components/coverageNote";
import ParticipatingLocations from "../components/participatingLocations.js";
import ActivateOTCCardLink from "../components/activateOTCCardLink";
import ExternalSiteLinkSSO from "../../../common/externalSiteLinkSSO";
import { participatingLocationsURL, evidenceOfCoverageURL } from "../../config";
import { cardTypes } from "../../const";
const {
  cvs,
  duanereade,
  walmart,
  familyDollar,
  walgreens,
  riteAid,
  dollarGeneral,
  nations,
  otcNetwork,
} = participatingLocationsURL;
const planName = "Signature (HMO)";

const SignatureHMOPage = () => {
  const [modal, setModal] = useState({ isVisible: false, info: null });

  const closeModal = () => {
    setModal({ ...modal, isVisible: false, info: null });
  };

  const openModal = (modal) => {
    setModal({
      ...modal,
      isVisible: true,
      info: { title: modal.title, content: modal.content() },
    });
  };

  const modals = {
    OTCAndHealthRelatedItems: {
      title: "OTC and Health-Related Items",
      content: () => (
        <>
          <ModalParagraph>
            <b>Buy OTC items online with no-cost delivery at NationsOTC.</b>
          </ModalParagraph>
          <ModalParagraph>
            <ExternalSiteLinkSSO
              link={nations.url}
              label="Nations OTC"
              target="_blank"
              styles={{ color: "#008bbf", cursor: "pointer", fontWeight: 700 }}
            >
              Click here
            </ExternalSiteLinkSSO>{" "}
            to go to your NationsOTC to place an order online or call{" "}
            <PhoneBold>1-877-236-7027 (TTY 711)</PhoneBold>. 24 hours per day, 7
            days a week.
          </ModalParagraph>
        </>
      ),
    },
  };

  const getWaysToSpendCards = () => {
    return (
      <>
        <WaysToSpendCard>
          <WaysToSpendCardIcon src="/react/images/otc-bottles-icon.svg" />
          <WaysToSpendCardTitle>
            OTC and Health-Related Items
          </WaysToSpendCardTitle>
          <WaysToSpendCardDescription>
            Purchase non-prescription drugs and health-related items such as
            aspirin, vitamins, eye drops, laxatives, and more at participating
            pharmacies and other retailers.
          </WaysToSpendCardDescription>
          <WaysToSpendCardButton
            onClick={() => openModal(modals.OTCAndHealthRelatedItems)}
          >
            Learn more
          </WaysToSpendCardButton>
        </WaysToSpendCard>
      </>
    );
  };

  return (
    <Wrapper>
      <Modal closeModal={closeModal} modal={modal} />
      <Hero>
        <HeroContentWrapper>
          <HeroLeftSection>
            <HeroTitle>Understanding Your OTC Card</HeroTitle>
            <HeroDescription>
              As a <b>Healthfirst {planName}</b> member, staying healthy is
              easier with your OTC card. Save on items you use every day, such
              as toothpaste, eye drops, aspirin, and more, when you shop at
              participating neighborhood and online retailers, with no-cost
              home-delivery options available.
            </HeroDescription>
          </HeroLeftSection>
          <HeroRightSection>
            <HeroCard>
              <HeroCardHeading>Your Allowance</HeroCardHeading>
              <HeroCardBalanceWrapper>
                <HeroCardBalance>$70</HeroCardBalance>
                <HeroCardBalanceFrequency>
                  per quarter*
                </HeroCardBalanceFrequency>
              </HeroCardBalanceWrapper>
              <HeroCardPlanName>{planName}</HeroCardPlanName>
              <HeroCardNote>
                *Any unused balance will automatically expire at the end of each
                quarter or upon disenrollment from the plan.
              </HeroCardNote>
            </HeroCard>
          </HeroRightSection>
        </HeroContentWrapper>
      </Hero>
      <Body>
        <Heading margin="0 0 16px 0" padding="0 20px">
          How It Works
        </Heading>
        <BodyDescription>
          Use your OTC card to shop for non-prescription drugs and
          health-related items that help you save money and stay healthy.
        </BodyDescription>
        <HowItWorksContentWrapper>
          <StepsToActiveList>
            <StepsToActiveListItem>
              <StepsToActiveListItemItemNumberWrapper>
                <StepsToActiveListItemItemNumber>
                  1
                </StepsToActiveListItemItemNumber>
              </StepsToActiveListItemItemNumberWrapper>
              <StepsToActiveListItemContent>
                <StepsToActiveListItemHeading>
                  Activate Your Card
                </StepsToActiveListItemHeading>
                <Paragraph>
                  Activate your OTC card and bring it with you to participating
                  pharmacies and other retailers.
                </Paragraph>
                <ActivateOTCCardLink />
                <StepsToActiveListItemNote margin="8px 0 0 0">
                  You can also activate your OTC card by calling{" "}
                  <b>1-833-684-8472</b> (24 hours a day, 7 days a week).
                </StepsToActiveListItemNote>
              </StepsToActiveListItemContent>
            </StepsToActiveListItem>

            <StepsToActiveListItem>
              <StepsToActiveListItemItemNumberWrapper>
                <StepsToActiveListItemItemNumber>
                  2
                </StepsToActiveListItemItemNumber>
              </StepsToActiveListItemItemNumberWrapper>
              <StepsToActiveListItemContent>
                <StepsToActiveListItemHeading>
                  Visit a Participating Location
                </StepsToActiveListItemHeading>
                <Paragraph>
                  Take your activated Healthfirst OTC card to a participating
                  store and select the approved items you want to purchase.
                </Paragraph>
                <StepsToActiveListItemNote>
                  For a complete list of participating pharmacies and retailers,{" "}
                  <ExternalSiteLinkSSO
                    link={otcNetwork.url}
                    label="OTC Network"
                    target="_blank"
                    styles={{
                      color: "#008bbf",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    click here
                  </ExternalSiteLinkSSO>{" "}
                  or call your Member Services team at{" "}
                  <PhoneBold>1-855-771-1081</PhoneBold> (TTY 1-888-542-3821), 7
                  days a week, 8am–8pm (October through March), and Monday to
                  Friday, 8am–8pm (April through September).
                </StepsToActiveListItemNote>
              </StepsToActiveListItemContent>
            </StepsToActiveListItem>

            <StepsToActiveListItem margin="0">
              <StepsToActiveListItemItemNumberWrapper>
                <StepsToActiveListItemItemNumber>
                  3
                </StepsToActiveListItemItemNumber>
              </StepsToActiveListItemItemNumberWrapper>
              <StepsToActiveListItemContent>
                <StepsToActiveListItemHeading>
                  Pay for Your Items
                </StepsToActiveListItemHeading>
                <Paragraph>
                  At local stores, take your items to the checkout lanes. When
                  you check out, swipe your OTC card for payment. Purchases of
                  approved items are automatically deducted from your card
                  balance.
                </Paragraph>
                <Paragraph>
                  Bring your OTC card with you, as you cannot use your
                  Healthfirst Member ID card or Medicare card to purchase
                  approved OTC items.
                </Paragraph>
                <Paragraph>
                  When you shop online, remember to enter your OTC card’s
                  19-digit number.
                </Paragraph>
                <StepsToActiveListItemNote>
                  *OTC items are subject to the plan’s list of eligible items
                  and the plan’s participating network of retail and online
                  providers.
                </StepsToActiveListItemNote>
              </StepsToActiveListItemContent>
            </StepsToActiveListItem>
          </StepsToActiveList>
          <ParticipatingLocationsWrapper>
            <ParticipatingLocationsTitle>
              Participating Locations
            </ParticipatingLocationsTitle>
            <ParticipatingLocationsSubTitle>
              Retailers
            </ParticipatingLocationsSubTitle>
            <ParticipatingLocationsLogosWrapper>
              <ParticipatingLocations
                locations={[
                  cvs,
                  duanereade,
                  walmart,
                  familyDollar,
                  walgreens,
                  riteAid,
                  dollarGeneral,
                ]}
              />
            </ParticipatingLocationsLogosWrapper>
            <ParticipatingLocationsSubTitle>
              Home Delivery
            </ParticipatingLocationsSubTitle>
            <ParticipatingLocationsLogosWrapper>
              <ParticipatingLocations locations={[nations]} />
            </ParticipatingLocationsLogosWrapper>
            <ParticipatingLocationsNote>
              Plus, many local independent pharmacies
            </ParticipatingLocationsNote>
          </ParticipatingLocationsWrapper>
        </HowItWorksContentWrapper>
        <WaysToSpendWrapper>
          <Heading margin="0 0 32px 0" padding="0 20px">
            Ways to Spend Your Allowance
          </Heading>
          <WaysToSpendCards>{getWaysToSpendCards()}</WaysToSpendCards>
        </WaysToSpendWrapper>
        <LimitationSectionWrapper>
          <Heading>Limitations</Heading>
          <LimitationSectionTitle>
            Maximum Limits on OTC Card
          </LimitationSectionTitle>
          <LimitationsContent>
            <Paragraph>
              As a {planName} member, your OTC card has a maximum limit for
              purchasing the following approved items:
            </Paragraph>
            <LimitationsList>
              <LimitationsListItem>
                OTC non-prescription drugs
              </LimitationsListItem>
              <LimitationsListItem>Health-related items</LimitationsListItem>
            </LimitationsList>
            <Paragraph>
              For more information, view your{" "}
              <a
                onClick={() =>
                  segment(
                    "/learn-more",
                    "Evidence of Coverage",
                    "Evidence of Coverage",
                    "Button",
                    "/learn-more",
                    customerInfo,
                    "otc"
                  )
                }
                href={evidenceOfCoverageURL.SignatureHMO.url}
                target="_blank"
              >
                Evidence of Coverage
              </a>{" "}
              or contact your dedicated Member Services team.
            </Paragraph>
            <Paragraph>
              <b>
                Some items can be purchased only after a discussion with your
                provider.
              </b>
            </Paragraph>
            <Paragraph>
              While no prescription is needed before purchasing approved OTC
              non-prescription drugs and health-related items, some dual-purpose
              items* can be purchased only after a discussion with your
              provider, who will recommend the right OTC items for a specific
              diagnosis/condition.
            </Paragraph>
            <StepsToActiveListItemNote>
              *Dual-purpose items may include vitamins, minerals, supplements,
              herbal and Chinese medicines, hormone replacements, and diagnostic
              tools like blood pressure monitors.
            </StepsToActiveListItemNote>
          </LimitationsContent>
          <LimitationSectionTitle>
            Important Points to Remember
          </LimitationSectionTitle>
          <LimitationsContent>
            <LimitationsList>
              <LimitationsListItem>
                Please activate your card before using to receive your allowance
              </LimitationsListItem>
              <LimitationsListItem>
                Eligible items may be purchased only for the enrollee, not for
                family members or friends
              </LimitationsListItem>
              <LimitationsListItem>
                The OTC card cannot be converted to cash
              </LimitationsListItem>
              <LimitationsListItem>
                The OTC card cannot be used to purchase Part B or Part D
                prescription drugs
              </LimitationsListItem>
              <LimitationsListItem>
                Any unused balances will automatically expire at the end of each
                quarter or upon disenrollment or transfer to another Healthfirst
                plan
              </LimitationsListItem>
              <LimitationsListItem>
                You cannot use your Healthfirst Member ID card or Medicare card
                to pay for non-prescription drugs and health-related items
              </LimitationsListItem>
            </LimitationsList>
          </LimitationsContent>
        </LimitationSectionWrapper>
        <CoverageNote cardType={cardTypes.otc} resetPeriod="quarter" />
      </Body>
    </Wrapper>
  );
};

export default SignatureHMOPage;
