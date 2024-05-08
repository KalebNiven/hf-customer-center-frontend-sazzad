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
import ExternalSiteLink from "../../../common/externalSiteLink";
import ExternalSiteLinkSSO from "../../../common/externalSiteLinkSSO";
import {
  participatingLocationsURL,
  evidenceOfCoverageURL,
  reimbursementFormsURL,
} from "../../config";
import { cardTypes } from "../../const";
import { handleSegmentClick } from "../../../../libs/segment";
import { useSelector } from "react-redux";
const {
  cvs,
  duanereade,
  walmart,
  familyDollar,
  shopShop,
  riteAid,
  dollarGeneral,
  nations,
  momsMeals,
  growNYC,
  otcNetwork,
} = participatingLocationsURL;
const planName = "CompleteCare (HMO D-SNP)";

const CompleteCareHMOPage = () => {
  const customerInfo = useSelector((state) => state.customerInfo);

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
      title: "OTC Plus and Health-Related Items",
      content: () => (
        <>
          <ModalParagraph>
            <b>
              Buy OTC Plus items online with no-cost delivery at NationsOTC.
            </b>
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
    HealthyFoods: {
      title: "Healthy Foods",
      content: () => (
        <>
          <ModalParagraph>
            <b>
              Save on fresh fruits, vegetables and more at GrowNYC locations
            </b>
          </ModalParagraph>
          <ModalParagraph>
            As a CompleteCare member, you can use your OTC Plus card at
            Greenmarkets, Farmstands, or Fresh Food Box locations in GrowNYC’s
            network.
          </ModalParagraph>
          <ModalParagraph>
            Visit{" "}
            <ExternalSiteLink
              label="GrowNYC food retail site"
              link={growNYC.url}
              target="_blank"
              styles={{ color: "#008bbf", cursor: "pointer", fontWeight: 700 }}
            >
              {growNYC.url.slice(8)}
            </ExternalSiteLink>{" "}
            to locate a GrowNYC food retail site near you{" "}
          </ModalParagraph>
          <ModalParagraph>
            Go to the administrative tent at these locations and the GrowNYC
            attendant will show you how to use your OTC Plus card.
          </ModalParagraph>
          <ModalParagraph>
            Depending on the GrowNYC location, you will either be able to:
          </ModalParagraph>
          <LimitationsList>
            <LimitationsListItem>
              Swipe your card to purchase fresh produce, meats, seafood, dairy,
              and more or;
            </LimitationsListItem>
            <LimitationsListItem>
              You will receive <b>“Healthfirst-GrowNYC Greenmarket Bucks”</b>,
              which can then be exchanged for healthy foods.
            </LimitationsListItem>
          </LimitationsList>
          <br />
          <ModalParagraph>
            <b>Buy Healthy foods online with no-cost delivery at NationsOTC</b>
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
            to go to NationsOTC to place an order online or call{" "}
            <PhoneBold>1-877-236-7027 (TTY 711)</PhoneBold>. 24 hours per day, 7
            days a week.
          </ModalParagraph>
          <ModalParagraph>
            Order convenient fresh produce or pantry boxes and stock up on
            approved food items such as fruits, vegetables, meats, poultry,
            seafood, eggs, dairy, dried pasta, rice, beans, and more.
          </ModalParagraph>
        </>
      ),
    },
    ExerciseEquipmentAndActivityTrackers: {
      title: "Exercise Equipment and Activity Trackers",
      content: () => (
        <>
          <ModalParagraph>
            Buy Exercise Equipment and Activity Trackers online with no-cost
            delivery at NationsOTC.
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
            to go to NationsOTC to place an order online or call{" "}
            <PhoneBold>1-877-236-7027</PhoneBold> (TTY 711).
          </ModalParagraph>
        </>
      ),
    },
    HomeInternetService: {
      title: "Home Utilities",
      content: () => (
        <>
          <ModalParagraph>
            To pay for your home utility bills (gas, electric, water and
            internet service):
          </ModalParagraph>
          <ModalParagraph>
            1.{" "}
            <ExternalSiteLinkSSO
              link={otcNetwork.url}
              label="OTC Network"
              target="_blank"
              styles={{ color: "#008bbf", cursor: "pointer", fontWeight: 700 }}
            >
              Click here
            </ExternalSiteLinkSSO>
            ; you will then be automatically logged into your
            mybenefitscenter.com* account.
          </ModalParagraph>
          <ModalParagraph>
            2. Click “Locations” from the top header section
          </ModalParagraph>
          <ModalParagraph>3. Select location type: "Online."</ModalParagraph>
          <ModalParagraph>
            4. A pop-up will appear listing services/items that you can use your
            OTC Plus card to pay for; including your home utilities and internet
            service, please select "Bill Pay."
          </ModalParagraph>
          <ModalParagraph>
            *mybenefitscenter.com allows you to view and manage all of your OTC
            Plus card benefits conveniently in one portal.
          </ModalParagraph>
          <ModalParagraph>
            Please be sure to have your utility account number available as you
            will need to enter it.
          </ModalParagraph>
          <ModalParagraph>
            If your utility provider is not listed, you may still pay your
            utility bill using your OTC Plus allowance. Just download and fill
            out the{" "}
            <a href={reimbursementFormsURL.ConnectionHMO.url} target="_blank">
              OTC Plus Reimbursement Claim Form
            </a>{" "}
            and mail it to us.
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
            OTC Plus and Health-Related Items
          </WaysToSpendCardTitle>
          <WaysToSpendCardDescription>
            Purchase non-prescription drugs and health-related items such as
            aspirin, vitamins, eye drops, laxatives, and more at participating
            pharmacies and other retailers.
          </WaysToSpendCardDescription>
          <Wrapper
            onClick={() =>
              handleSegmentClick(
                "/learn-more",
                "Learn More",
                "OTC Plus and Health-Related Items",
                "Button",
                "/learn-more",
                customerInfo,
                "otc"
              )
            }
          >
            <WaysToSpendCardButton
              onClick={() => openModal(modals.OTCAndHealthRelatedItems)}
            >
              Learn more
            </WaysToSpendCardButton>
          </Wrapper>
        </WaysToSpendCard>

        <WaysToSpendCard>
          <WaysToSpendCardIcon src="/react/images/healthy-foods-icon.svg" />
          <WaysToSpendCardTitle>Healthy Foods</WaysToSpendCardTitle>
          <WaysToSpendCardDescription>
            Purchase healthy foods from participating retailers and farmers’
            markets. Examples of approved food items are fruits, vegetables,
            meats, poultry, seafood, eggs, dairy, rice, pasta, beans, and much
            more.
          </WaysToSpendCardDescription>
          <Wrapper
            onClick={() =>
              handleSegmentClick(
                "/learn-more",
                "Learn More",
                "Healthy Foods",
                "Button",
                "/learn-more",
                customerInfo,
                "otc"
              )
            }
          >
            <WaysToSpendCardButton
              onClick={() => openModal(modals.HealthyFoods)}
            >
              Learn more
            </WaysToSpendCardButton>
          </Wrapper>
        </WaysToSpendCard>

        <WaysToSpendCard>
          <WaysToSpendCardIcon src="/react/images/exercise-icon.svg" />
          <WaysToSpendCardTitle>
            Exercise Equipment and Activity Trackers
          </WaysToSpendCardTitle>
          <WaysToSpendCardDescription>
            Purchase exercise equipment and activity trackers (such as Apple®
            Watches, pedometers, and other fitness watches) through{" "}
            <ExternalSiteLinkSSO
              link={nations.url}
              label="Nations OTC"
              target="_blank"
              styles={{ color: "#008bbf", cursor: "pointer", fontWeight: 700 }}
            >
              NationsOTC.
            </ExternalSiteLinkSSO>
          </WaysToSpendCardDescription>
          <Wrapper
            onClick={() =>
              handleSegmentClick(
                "/learn-more",
                "Learn More",
                "Exercise Equipment and Activity Trackers",
                "Button",
                "/learn-more",
                customerInfo,
                "otc"
              )
            }
          >
            <WaysToSpendCardButton
              onClick={() =>
                openModal(modals.ExerciseEquipmentAndActivityTrackers)
              }
            >
              Learn more
            </WaysToSpendCardButton>
          </Wrapper>
        </WaysToSpendCard>

        <WaysToSpendCard>
          <WaysToSpendCardIcon src="/react/images/internet-icon.svg" />
          <WaysToSpendCardTitle>Home Utilities</WaysToSpendCardTitle>
          <WaysToSpendCardDescription>
            Use your OTC Plus card to pay for most utilities, including gas,
            electric, water, and internet service.
          </WaysToSpendCardDescription>
          <Wrapper
            onClick={() =>
              handleSegmentClick(
                "/learn-more",
                "Learn More",
                "Home Utilities",
                "Button",
                "/learn-more",
                customerInfo,
                "otc"
              )
            }
          >
            <WaysToSpendCardButton
              onClick={() => openModal(modals.HomeInternetService)}
            >
              Learn more
            </WaysToSpendCardButton>
          </Wrapper>
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
            <HeroTitle>Understanding Your OTC Plus Card</HeroTitle>
            <HeroDescription>
              As a <b>Healthfirst {planName}</b> member, staying healthy is
              easier with your OTC Plus card. Save on items you use every day,
              such as toothpaste, eye drops, aspirin, and more, when you shop at
              participating neighborhood and online stores, with no-cost
              home-delivery options available. In addition, you can save on OTC
              non-prescription drugs, healthy foods, exercise equipment,
              activity trackers, and home utilities.*
            </HeroDescription>
            <HeroDescription>
              *Home utilities include: gas, electric, water, and internet
              service.
            </HeroDescription>
          </HeroLeftSection>
          <HeroRightSection>
            <HeroCard>
              <HeroCardHeading>Your Allowance</HeroCardHeading>
              <HeroCardBalanceWrapper>
                <HeroCardBalance>$180</HeroCardBalance>
                <HeroCardBalanceFrequency>per month*</HeroCardBalanceFrequency>
              </HeroCardBalanceWrapper>
              <HeroCardPlanName>{planName}</HeroCardPlanName>
              <HeroCardNote>
                *Any unused balance will automatically expire at the end of each
                month or upon disenrollment from the plan.
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
          With your OTC Plus card, you have the flexibility to spend your
          benefit in more ways and at more places. Save at your neighborhood
          pharmacy, farmers’ markets, online, and other participating stores.
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
                  Activate your Healthfirst OTC Plus card before its first use.
                </Paragraph>
                <ActivateOTCCardLink />
                <StepsToActiveListItemNote margin="8px 0 0 0">
                  You can also activate your OTC Plus card by calling Card
                  Services at <b>1-833-684-8472</b> (24 hours a day, 7 days a
                  week).
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
                  Take your activated Healthfirst OTC Plus card to a
                  participating store and select the approved items you want to
                  purchase.
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
                  or call Member Services at{" "}
                  <PhoneBold>1-888-260-1010</PhoneBold> (TTY 1-888-542-3821), 7
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
                  Pay For Your Items
                </StepsToActiveListItemHeading>
                <Paragraph>
                  At local stores, take your items to the checkout lanes. When
                  you check out, swipe your OTC Plus card for payment. Purchases
                  of approved items are automatically deducted from your card
                  balance.
                </Paragraph>
                <Paragraph>
                  For guidance on using your OTC Plus card at farmers’ markets,
                  visit the information stand on site.
                </Paragraph>
                <Paragraph>
                  Bring your OTC Plus card with you, as you cannot use your
                  Healthfirst Member ID card, Medicare card, or Medicaid card to
                  purchase approved OTC Plus items.
                </Paragraph>
                <Paragraph>
                  When you shop online, remember to enter your OTC Plus card’s
                  19-digit number.
                </Paragraph>
                <StepsToActiveListItemNote>
                  *OTC Plus items are subject to the plan’s list of eligible
                  items and the plan’s participating network of retail and
                  online providers.
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
                  shopShop,
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
            <ParticipatingLocationsSubTitle margin="24px 0 24px 0">
              Farmer’s Markets & Produce Stands
            </ParticipatingLocationsSubTitle>
            <ParticipatingLocationsLogosWrapper>
              <ParticipatingLocations locations={[growNYC]} />
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
            Maximum Limits on OTC Plus Card
          </LimitationSectionTitle>
          <LimitationsContent>
            <Paragraph>
              As a {planName} member, your OTC Plus card has a maximum limit for
              purchasing the following approved items:
            </Paragraph>
            <LimitationsList>
              <LimitationsListItem>
                OTC non-prescription drugs
              </LimitationsListItem>
              <LimitationsListItem>Health-related items</LimitationsListItem>
              <LimitationsListItem>Healthy foods</LimitationsListItem>
              <LimitationsListItem>Home utilities</LimitationsListItem>
              <LimitationsListItem>
                Exercise equipment and activity trackers
              </LimitationsListItem>
            </LimitationsList>
            <Paragraph>
              For more information, view your{" "}
              <a
                onClick={() =>
                  handleSegmentClick(
                    "/learn-more",
                    "Evidence of Coverage",
                    "Evidence of Coverage",
                    "Button",
                    "/learn-more",
                    customerInfo,
                    "otc"
                  )
                }
                href={evidenceOfCoverageURL.CompleteCare.url}
                target="_blank"
              >
                Evidence of Coverage
              </a>{" "}
              or contact Member Services.
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
                Please activate your OTC Plus card before using to receive your
                allowance
              </LimitationsListItem>
              <LimitationsListItem>
                Eligible items may be purchased only for the enrollee, not for
                family members or friends
              </LimitationsListItem>
              <LimitationsListItem>
                The OTC Plus card cannot be converted to cash
              </LimitationsListItem>
              <LimitationsListItem>
                The OTC Plus card cannot be used to purchase Part B or Part D
                prescription drugs
              </LimitationsListItem>
              <LimitationsListItem>
                Any unused balances will automatically expire at the end of each
                month or upon disenrollment or transfer to another Healthfirst
                plan
              </LimitationsListItem>
              <LimitationsListItem>
                You cannot use your Healthfirst Member ID card, Medicare card,
                or Medicaid card to pay for non-prescription drugs,
                health-related items, healthy foods, produce, or home utilities
              </LimitationsListItem>
            </LimitationsList>
          </LimitationsContent>
        </LimitationSectionWrapper>
        <CoverageNote cardType={cardTypes.otcPlus} resetPeriod="month" />
      </Body>
    </Wrapper>
  );
};

export default CompleteCareHMOPage;
