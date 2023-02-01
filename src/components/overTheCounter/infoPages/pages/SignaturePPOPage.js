import React, { useState } from 'react'
import { Wrapper, Hero, HeroContentWrapper, HeroLeftSection, HeroTitle, HeroDescription, HeroRightSection, HeroCard, HeroCardHeading, HeroCardBalanceWrapper, HeroCardBalance, HeroCardBalanceFrequency, HeroCardPlanName, HeroCardNote, ModalParagraph, Body, Heading, BodyDescription, HowItWorksContentWrapper, StepsToActiveList, StepsToActiveListItem, StepsToActiveListItemItemNumberWrapper, StepsToActiveListItemItemNumber, StepsToActiveListItemHeading, Paragraph, StepsToActiveListItemNote, WaysToSpendWrapper, WaysToSpendCards, WaysToSpendCard, WaysToSpendCardIcon, WaysToSpendCardTitle, WaysToSpendCardDescription, WaysToSpendCardButton, LimitationSectionWrapper, LimitationSectionTitle, StepsToActiveListItemContent, LimitationsContent, LimitationsListItem, LimitationsList, PhoneBold, WaysToSpendOutOfPocket } from '../styles';
import Modal from '../components/modal'
import CoverageNote from '../components/coverageNote'
import ActivateOTCCardLink from '../components/activateOTCCardLink'
import { evidenceOfCoverageURL } from '../../config'
const planName = "Signature (PPO)"

const SignaturePPOPage = () => {
    const [modal, setModal] = useState({ isVisible: false, info: null })

    const closeModal = () => {
      setModal({ ...modal, isVisible: false, info: null })
    }

    const openModal = (modal) => {
      setModal({ ...modal, isVisible: true, info: { title: modal.title, content: modal.content() } })
    }

    const modals = { 
        OutOfPocketItem: { 
        title: "Out-of-Pocket Costs",
        content: () => (
          <>
            <ModalParagraph>Use your $700/year Flex card toward dental, vision, and hearing out-of-pocket costs.</ModalParagraph>
            <ModalParagraph>Be sure to give your Healthfirst Member ID card to your dental, vision, or hearing provider first to use your full benefits. Then, you choose to use your Flex card towards any out-of-pocket costs you may have, after Healthfirst pays our share of the costs.</ModalParagraph>
            <ModalParagraph>For example, the Flex card could be used to get designer glasses that are a bit more expensive than your $250 benefit eyewear allowance, or for your copays for crowns or dentures for an out-of-network dentist. You have the flexibility to choose how you want to spend your Flex card allowance. But you should use it all before the end of 2023, or before you switch to another Healthfirst plan as you cannot rollover your card balance.</ModalParagraph>
          </>
        )
      }
    }

    const getWaysToSpendCards = () => {
      return (
        <>
          <WaysToSpendCard>
            <WaysToSpendCardIcon src="/react/images/otc-cash-icon.svg" />
            <WaysToSpendCardTitle>Out-of-Pockets Costs</WaysToSpendCardTitle>
            <WaysToSpendOutOfPocket><b>Vision:</b> Eyewear (above the $250/two years allowance already included in your plan)</WaysToSpendOutOfPocket>
            <WaysToSpendOutOfPocket><b>Dental:</b> Copays for out-of-network services*</WaysToSpendOutOfPocket>
            <WaysToSpendOutOfPocket><b>Hearing:</b> Hearing aids purchased through NationsHearing</WaysToSpendOutOfPocket>
            <WaysToSpendCardDescription margin="10px 0 0 0">*Covered dental services at participating dental providers have no cost-sharing under your plan!</WaysToSpendCardDescription>
            <WaysToSpendCardButton onClick={() => openModal(modals.OutOfPocketItem)}>Learn more</WaysToSpendCardButton>
          </WaysToSpendCard>
        </>
      )
    }

    return (
        <Wrapper>
              <Modal closeModal={closeModal} modal={modal} />
              <Hero>
                <HeroContentWrapper>
                    <HeroLeftSection>
                        <HeroTitle>Understanding Your Flex Card</HeroTitle>
                        <HeroDescription>As a <b>Healthfirst {planName}</b> member,  you can use your Flex card to pay for dental, vision and hearing out-of-pocket costs.</HeroDescription>
                    </HeroLeftSection>
                    <HeroRightSection>
                        <HeroCard>
                            <HeroCardHeading>Your Allowance</HeroCardHeading>
                            <HeroCardBalanceWrapper>
                                <HeroCardBalance>$700</HeroCardBalance><HeroCardBalanceFrequency>per year*</HeroCardBalanceFrequency>
                            </HeroCardBalanceWrapper>
                            <HeroCardPlanName>{planName}</HeroCardPlanName>
                            <HeroCardNote>*Any unused balance will automatically expire at the end of each year or upon disenrollment from the plan.</HeroCardNote>
                        </HeroCard>
                    </HeroRightSection>
                  </HeroContentWrapper>
              </Hero>
              <Body>
                <Heading margin="0 0 16px 0" padding="0 20px">How It Works</Heading>
                <BodyDescription>Use your Flex card to pay for your dental, vision, and hearing out-of-pocket costs.</BodyDescription>
                <HowItWorksContentWrapper>
                  <StepsToActiveList>
                    <StepsToActiveListItem>
                      <StepsToActiveListItemItemNumberWrapper>
                        <StepsToActiveListItemItemNumber>1</StepsToActiveListItemItemNumber>
                      </StepsToActiveListItemItemNumberWrapper>
                      <StepsToActiveListItemContent>
                        <StepsToActiveListItemHeading>Activate Your Card</StepsToActiveListItemHeading>
                        <Paragraph>Activate your Flex card and bring it with you to dental, vision and hearing providers.</Paragraph>
                        <ActivateOTCCardLink />
                        <StepsToActiveListItemNote margin="8px 0 0 0">You can also activate your OTC Plus card by calling <b>1-833-684-8472</b> (24 hours a day, 7 days a week).</StepsToActiveListItemNote>
                      </StepsToActiveListItemContent>
                    </StepsToActiveListItem>

                    <StepsToActiveListItem>
                      <StepsToActiveListItemItemNumberWrapper>
                        <StepsToActiveListItemItemNumber>2</StepsToActiveListItemItemNumber>
                      </StepsToActiveListItemItemNumberWrapper>
                      <StepsToActiveListItemContent>
                        <StepsToActiveListItemHeading>Visit a Dental, Vision, and Hearing Providers</StepsToActiveListItemHeading>
                        <Paragraph>Take your activated Healthfirst Flex card to a dental, vision and hearing providers.</Paragraph>
                        <StepsToActiveListItemNote>For a complete list of participating providers, <a href="https://healthfirst.org/find-a-doctor" target="_blank">click here</a> or call your Member Services team at <PhoneBold>1-833-350-2910</PhoneBold> (TTY 1-888-542-3821), 7 days a week, 8am–8pm (October through March), and Monday to Friday, 8am–8pm (April through September).</StepsToActiveListItemNote>
                      </StepsToActiveListItemContent>
                    </StepsToActiveListItem>

                    <StepsToActiveListItem margin="0">
                      <StepsToActiveListItemItemNumberWrapper>
                        <StepsToActiveListItemItemNumber>3</StepsToActiveListItemItemNumber>
                      </StepsToActiveListItemItemNumberWrapper>
                      <StepsToActiveListItemContent>
                        <StepsToActiveListItemHeading>Using Your Flex Card</StepsToActiveListItemHeading>
                        <Paragraph>Bring your Flex card with you, as you cannot use your Healthfirst Member ID card or Medicare card to pay for out-of-pocket expenses at in-network dental, vision and hearing providers.</Paragraph>
                        <Paragraph>It’s important to first show your provider your Healthfirst Member ID card to use all of your regular dental, vision, and hearing benefits; then use your Flex card for any out-of pocket costs!</Paragraph>
                      </StepsToActiveListItemContent>
                    </StepsToActiveListItem>
                  </StepsToActiveList>
                </HowItWorksContentWrapper>
                <WaysToSpendWrapper>
                  <Heading margin="0 0 32px 0" padding="0 20px">Ways to Spend Your Allowance</Heading>
                  <WaysToSpendCards>
                    { getWaysToSpendCards() }
                  </WaysToSpendCards>
                </WaysToSpendWrapper>
                <LimitationSectionWrapper>
                  <Heading>Limitations</Heading>
                  <LimitationSectionTitle>Maximum Limits on Flex Card</LimitationSectionTitle>
                  <LimitationsContent>
                    <Paragraph>As a {planName} member, your Flex card has a maximum limit for purchasing the following approved items/services:</Paragraph>
                    <LimitationsList>
                      <LimitationsListItem>Dental, vision, and hearing out-of-pocket costs</LimitationsListItem>
                    </LimitationsList>
                    <Paragraph>For more information, view your <a href={evidenceOfCoverageURL.SignaturePPO.url} target="_blank">Evidence of Coverage</a> or contact your dedicated Member Services team.</Paragraph>
                  </LimitationsContent>
                  <LimitationSectionTitle>Important Points to Remember</LimitationSectionTitle>
                  <LimitationsContent>
                    <LimitationsList>
                      <LimitationsListItem>Please activate your card before using to receive your allowance</LimitationsListItem>
                      <LimitationsListItem>The Flex card cannot be converted to cash</LimitationsListItem>
                      <LimitationsListItem>The Flex card cannot be used to purchase Part B or Part D prescription drugs</LimitationsListItem>
                      <LimitationsListItem>Any unused balances will automatically expire at the end of each year or upon disenrollment or transfer to another Healthfirst plan</LimitationsListItem>
                      <LimitationsListItem>You cannot use your Healthfirst Member ID card or Medicare card to pay for dental, vision and hearing out-of-pocket costs</LimitationsListItem>
                    </LimitationsList>
                  </LimitationsContent>
                </LimitationSectionWrapper>
                <CoverageNote cardType = "Flex" resetPeriod="year" />
              </Body>
        </Wrapper>
    )
}

export default SignaturePPOPage
