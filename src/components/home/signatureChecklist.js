import styled from "styled-components";
import React from "react";
import GlobalStyle from "../../styles/GlobalStyle";
import { useSelector } from "react-redux";
import { SHOW_SIGNATURE_CHECKLIST } from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";
import GlobalError from "../common/globalErrors/globalErrors";
import { getSplitAttributes } from "../../utils/misc";

const SignatureChecklist = () => {
  const customerInfo = useSelector((state) => state.customerInfo);
  const splitAttributes = getSplitAttributes(customerInfo?.data);

  return (
    <>
      <FeatureTreatment
        treatmentName={SHOW_SIGNATURE_CHECKLIST}
        onLoad={() => {}}
        onTimedout={() => {}}
        attributes={splitAttributes}
      >
        <GlobalStyle />

        <WelcomeChecklistTxt>
          My Healthfirst Welcome Checklist
        </WelcomeChecklistTxt>
        <Description>
          Completing the checklist will help ensure a smooth start to your
          Healthfirst coverage when it begins. For more details, please contact
          your Member Services team at <PhoneNumber>1-855-771-1081</PhoneNumber>{" "}
          (TTY 1-888-542-3821), 7 days a week, 8am–8pm; or review the Welcome
          booklet that has been mailed to you.
        </Description>
        <Container>
          <LeftContainer>
            <LeftCards>
              <SerialNo>1</SerialNo>
              <Content>
                <StepHeading>
                  Congratulations on setting up your Healthfirst online
                  account*!{" "}
                </StepHeading>
                <StepDesc>
                  Conveniently manage your plan benefits 24/7, right from your
                  mobile device or computer.
                </StepDesc>
                <SpecialNote>
                  *Full online features available once your coverage begins.
                </SpecialNote>
                <RewardAmnt>Reward amount $2</RewardAmnt>
              </Content>
            </LeftCards>
            <LeftCards>
              <SerialNo>2</SerialNo>
              <Content>
                <StepHeading>
                  Complete the 10-minute New Member Questionnaire{" "}
                </StepHeading>
                <StepDesc>
                  so we can connect you to services and programs that are right
                  for your health needs.
                </StepDesc>
                <Details>
                  How: Visit{" "}
                  <Link
                    onClick={() => {
                      window.open("https://MyHFSignatureSurvey.com");
                    }}
                  >
                    MyHFSignatureSurvey.com{" "}
                  </Link>{" "}
                  or complete and return the form enclosed in the Welcome packet
                  that has been mailed to you.
                </Details>
                <RewardAmnt>Reward amount $5</RewardAmnt>
              </Content>
            </LeftCards>
            <LeftCards>
              <SerialNo>3</SerialNo>
              <Content>
                <StepHeading>
                  Confirm that your pharmacy is in-network.
                </StepHeading>
                <Details>
                  How: Visit{" "}
                  <Link
                    onClick={() => {
                      window.open("https://HFDocFinder.org");
                    }}
                  >
                    HFDocFinder.org
                  </Link>
                  .
                </Details>
                <RewardAmnt>Reward amount $1</RewardAmnt>
              </Content>
            </LeftCards>
            <LeftCards>
              <SerialNo>4</SerialNo>
              <Content>
                <StepHeading>
                  Check if your prescriptions are covered on the Formulary (List
                  of Covered Drugs).
                </StepHeading>
                <Details>
                  How: Simply search for your drug at{" "}
                  <Link
                    onClick={() => {
                      window.open("https://HFMedicareMaterials.org");
                    }}
                  >
                    HFMedicareMaterials.org
                  </Link>
                  .
                </Details>
                <RewardAmnt>Reward amount $1</RewardAmnt>
              </Content>
            </LeftCards>
            <LeftCards>
              <SerialNo>5</SerialNo>
              <Content>
                <StepHeading>
                  Schedule your first doctor (primary care provider) visit.
                </StepHeading>
                <Details>
                  How: Call them today to make an appointment. To change a
                  provider or search for a new one, visit{" "}
                  <Link
                    onClick={() => {
                      window.open("https://HFDocFinder.org");
                    }}
                  >
                    HFDocFinder.org
                  </Link>
                  .
                </Details>
                <RewardAmnt>Reward amount $1</RewardAmnt>
              </Content>
            </LeftCards>
          </LeftContainer>
          <RightContainer>
            <RightCard>
              <ExpectTxt>What to Expect in the Coming Months</ExpectTxt>
              <TeamDescription>
                <MeetTeam>Meet Your Member Services Team:</MeetTeam>
                Your dedicated Member Services team will call you within 30
                business days to welcome you to the plan. They are your primary
                Healthfirst contact and will personally help support you
                throughout your membership by:
              </TeamDescription>
              <Dot />
              <AboutTeam>
                Explaining your Healthfirst benefits and how health insurance
                works.
              </AboutTeam>
              <Dot />
              <AboutTeam>
                Supporting you on general inquiries, including how to manage
                your bills, claims, and costs.
              </AboutTeam>
              <Dot />
              <AboutTeam>
                Understanding your situation to best support you in achieving
                your health goals.
              </AboutTeam>
              <Dot />
              <AboutTeam>
                Connecting you to doctors, pharmacies, and resources you need,
                even beyond healthcare.
              </AboutTeam>
              <Dot />
              <AboutTeam>
                Helping you get set up with Healthfirst, whether online or
                otherwise!
              </AboutTeam>
            </RightCard>
            <ImportantNote>
              *Full online features available once your coverage begins
            </ImportantNote>
          </RightContainer>
        </Container>
      </FeatureTreatment>
      <FeatureTreatment
        treatmentName={SHOW_SIGNATURE_CHECKLIST}
        onLoad={() => {}}
        onTimedout={() => {}}
        attributes={splitAttributes}
        invertBehavior
      >
        <ErrorContainer>
          <GlobalError />
        </ErrorContainer>
      </FeatureTreatment>
    </>
  );
};

export default SignatureChecklist;

const WelcomeChecklistTxt = styled.div`
  margin: 32px auto 8px;
  @media only screen and (max-width: 960px) {
    margin: 32px 86px 8px;
    width: calc(100% - 172px);
  }
  @media only screen and (max-width: 668px) {
    margin: 32px 16px 8px;
    width: calc(100% - 32px);
  }
  width: 870px;
  display: flex;
  justify-content: flex-start;
  font-size: 18px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #003863;
`;

const Description = styled.div`
  @media only screen and (max-width: 960px) {
    margin: 8px 86px 24px;
    width: calc(100% - 172px);
  }
  @media only screen and (max-width: 668px) {
    margin: 8px 16px 24px;
    width: calc(100% - 32px);
  }
  display: block;
  width: 870px;
  margin: 8px auto 24px;
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
`;

const PhoneNumber = styled.span`
  font-weight: bold;
`;

const Content = styled.span`
  display: block;
  overflow: hidden;
`;
const LeftCards = styled.div`
  width: 100%;
  padding: 16px;
  border-radius: 4px;
  background-color: #ffffff;
  margin-bottom: 12px;
`;

const SerialNo = styled.span`
  border: solid 1px #a8abac;
  height: 24px;
  width: 24px;
  background-color: white;
  border-radius: 50%;
  display: inline-block;
  color: #474b55;
  text-align: center;
  font-weight: bold;
  float: left;
`;

const StepHeading = styled.div`
  margin: 0 0 4px 12px;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #474b55;
`;

const StepDesc = styled.div`
  margin: 4px 0 4px 12px;
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #474b55;
`;

const RewardAmnt = styled.div`
  margin: 16px 0 0 12px;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #474b55;
`;

const Container = styled.div`
  // @media only screen and (max-width: 820px) {
  //   display: contents;
  // };
  width: calc(100% - 400px);
  margin: 0 200px;
  @media only screen and (max-width: 1200px) {
    margin: 0 86px;
    width: calc(100% - 172px);
  }
  @media only screen and (max-width: 960px) {
    margin: 0 86px;
    width: calc(100% - 172px);
  }
  @media only screen and (max-width: 668px) {
    display: block;
    margin: 0 16px;
    width: calc(100% - 32px);
  }
  display: flex;
  gap: 35px;
  flex: 1 1 auto;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
`;

const LeftContainer = styled.div`
  // @media only screen and (max-width: 1180px) {
  //   margin-left: 120px;
  // };
  // @media only screen and (max-width: 820px) {
  //   width:100%;
  //   margin: 0px;
  //   padding-right: 8px;
  // };
  @media only screen and (max-width: 668px) {
    width: 100%;
  }
  display: block;
  width: 500px;
`;

const RightContainer = styled.div`
  // @media only screen and (max-width: 1180px) {
  //   margin-right: 120px;
  // };
  // @media only screen and (max-width: 820px) {
  //   width:100%;
  //   padding-left: 8px;
  //   margin:0px;
  // };
  @media only screen and (max-width: 668px) {
    width: 100%;
  }
  width: 348px;
  display: block;
`;

const RightCard = styled.div`
  padding: 24px;
  border-radius: 4px;
  background-color: #ffffff;
`;

const SpecialNote = styled.div`
  margin: 4px 0 16px 12px;
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: normal;
  color: #474b55;
`;

const TeamDescription = styled.div`
  margin: 16px 0 24px;
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #474b55;
`;

const Details = styled.div`
  margin: 8px 0 16px 12px;
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
`;

const Link = styled.span`
  font-weight: 500;
  color: #008bbf;
  &:hover {
    cursor: pointer;
    color: #2a6a9e;
    text-decoration: underline;
  }
`;

const ExpectTxt = styled.div`
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #003863;
`;

const MeetTeam = styled.span`
  font-weight: bold;
`;

const Dot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #474b55;
  float: left;
  margin-top: 6px;
`;

const AboutTeam = styled.span`
  display: block;
  overflow: hidden;
  margin: 0 0 17px 12px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #474b55;
`;

const ImportantNote = styled.div`
  margin: 16px 12px 16px 27px;
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #474b55;
`;

const ErrorContainer = styled.div`
  width: 1024px;
  margin: auto;
`;
