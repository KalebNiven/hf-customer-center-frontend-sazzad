import styled from 'styled-components';

export const Wrapper = styled.div`
`;

export const HeroContentWrapper = styled.div`
  display: flex;
  justify-content: center;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    position: relative;
  }
`;

export const Hero = styled.div`
    padding: 56px 144px;
    background-image: linear-gradient(to bottom, #003863 0%, rgba(0, 56, 99, 0) 49%), linear-gradient(103deg, #003863 -7%, #008bbf 111%);

    @media only screen and (max-width: 768px) {
      padding: 40px 86px;
      padding-bottom: 140px;
    }

    @media only screen and (max-width: 480px) {
      padding: 40px 16px;
      padding-bottom: 140px;
    }
`;

export const HeroLeftSection = styled.div`
  width: 480px;
  margin-right: 32px;

  @media only screen and (max-width: 768px) {
    width: auto;
    margin-right: 0;
  }
`;

export const HeroTitle = styled.h1`
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.23);
  font-size: 32px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
`;

export const HeroDescription = styled.p`
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.23);
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
  margin-top: 16px;
`;

export const HeroRightSection = styled.div`
  width: 480px;
  
  @media only screen and (max-width: 768px) {
    position: absolute;
    width: 100%;
    bottom: -250px;
  }
`;

export const HeroCard = styled.div`
  padding: 24px;
  border-radius: 6px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.23);
  background-color: #fff;
`;

export const HeroCardHeading = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: 0.6px;
  text-align: left;
  color: #757575;
  margin-bottom: 12px;
  text-transform: uppercase;
`;

export const HeroCardBalanceWrapper = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
  margin-bottom: 8px;
`;

export const HeroCardBalance = styled.span`
  font-size: 36px;
  font-weight: bold;
`;

export const HeroCardBalanceFrequency = styled.span`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
  margin-left: 5px;
`;

export const HeroCardPlanName = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
`;

export const HeroCardNote = styled.p`
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.67;
  letter-spacing: normal;
  text-align: left;
  color: #757575;
  margin-top: 12px;
`;

export const ModalWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 42, 74, 0.72);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
`;

export const ModalCard = styled.div`
  width: 440px;
  padding: 24px;
  border-radius: 4px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.23);
  background-color: #fff;
  position: relative;
  max-height: 90%;
  margin: 0 8px;
  /* overflow-y: auto; */
  display: flex;
  flex-direction: column;
`;

export const ModalCardTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
  margin: 24px 0 0px 0;
`;

export const ModalCardBody = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  height: 100%;
  overflow-y: auto;
`;

export const ModalCloseIcon = styled.img`
  position: absolute;
  right: 18px;
  top: 18px;
  cursor: pointer;
`;

export const ModalControlsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

export const ModalCloseBtn = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #3e7128;
  border: none;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: -0.08px;
  text-align: center;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #517f3d;
  }

  @media only screen and (max-width: 480px) {
    width: 100%;
  }
`;

export const ModalParagraph = styled.p`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  margin: ${props => props.isExtraMargin ? props.isExtraMargin :  "13px 0px"};
`;

export const Body = styled.div`
  max-width: 1280px;  
  padding: 56px 144px;
  margin: 0 auto;

  @media only screen and (max-width: 768px) {
    padding: 0 86px;
    margin-top: 140px;
    padding-bottom: 56px;
  }
  
  @media only screen and (max-width: 480px) {
    padding: 0;
    padding-bottom: 56px;
  }
`;

export const Heading = styled.h2`
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
  margin: ${props => props.margin && props.margin };

  @media only screen and (max-width: 480px) {
    padding: ${props => props.padding && props.padding };
  }
`;

export const BodyDescription = styled.p`
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  margin: 16px 0 32px 0;

  @media only screen and (max-width: 1280px) {
    margin-left: 0;
  }

  @media only screen and (max-width: 480px) {
    padding: 0 20px;
  }
`;

export const HowItWorksContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

export const StepsToActiveList = styled.div`
  max-width: 50%;

  @media only screen and (max-width: 480px) {
    padding: 0 20px;
  }

  @media only screen and (max-width: 768px) {
    max-width: 100%;
  }
`;

export const StepsToActiveListItem = styled.div`
  position: relative;
  margin-bottom: 40px;
  margin: ${props => props.margin};
`;

export const StepsToActiveListItemHeading = styled.h3`
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
  margin-bottom: 4px;
`;


export const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  margin-bottom: 12px;
`;

export const StepsToActiveListItemNote = styled.p`
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  margin-top: 16px;
  margin: ${props => props.margin && props.margin};
`;

export const StepsToActiveListItemActivateButton = styled.div`
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: left;
  color: #008bbf;
  cursor: ${props => props.disabled ? "default" : "pointer"};
  margin: 12px 0 8px 0;
`;

export const StepsToActiveListItemContent = styled.div`
  margin-left: 50px;

  @media only screen and (max-width: 767px) {
    margin-left: 0;
    margin-top: 16px;
  }
`;

export const LimitationsContent = styled.div`
  @media only screen and (max-width: 1280px) {
    /* margin-left: 0; */
    /* margin-top: 16px; */
  }
`;

export const LimitationsList = styled.ul`
  list-style: disc;
  margin: 15px 0;
  padding-left: 25px;

  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
`;

export const LimitationsListItem = styled.li`
  margin: 5px 0;
`;

export const StepsToActiveListItemItemNumberWrapper = styled.div`
  position: absolute;
  width: 32px;
  height: 32px;
  padding: 4px 0;
  background-color: #003863;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  left: 0;

  @media only screen and (max-width: 767px) {
    position: relative;
  }
`;

export const StepsToActiveListItemItemNumber = styled.span`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
`;

export const ParticipatingLocationsWrapper = styled.ul`
  width: 40%;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  margin-left: 48px;
  padding: 24px;
  border-radius: 6px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  height: fit-content;

  @media only screen and (max-width: 768px) {
    width: 100%;
    margin-left: 0px;
    margin-top: 56px;
  }

  @media only screen and (max-width: 480px) {
    padding: 16px 24px;
  }
`;

export const ParticipatingLocationsTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
`;

export const ParticipatingLocationsSubTitle = styled.h2`
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: 1.2px;
  text-align: left;
  color: #a8abac;
  margin: ${props => props.margin ? props.margin : "24px 0"};
  text-transform: uppercase;
`;

export const ParticipatingLocationsLogosWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px 0;
`;

export const ParticipatingLocationsLogo = styled.img`
  max-width: 130px;
`;

export const ParticipatingLocationsNote = styled.div`
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  margin-top: 24px;
`;

export const WaysToSpendWrapper = styled.div`
  margin: 56px 0;

  @media only screen and (max-width: 480px) {
    padding: 0;
  }
`;

export const WaysToSpendCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;

  @media only screen and (max-width: 768px) {
    gap: 16px;
  }
`;

export const WaysToSpendCard = styled.div`
  width: calc(50% - 16px);
  min-height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
  padding: 24px;
  border-radius: 6px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }

  @media only screen and (max-width: 480px) {
    padding: 24px 16px;
    min-height: 300px;
  }
`;

export const WaysToSpendCardIcon = styled.img`
  
`;

export const WaysToSpendCardTitle = styled.h4`
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
  margin: 0 0 8px 0;
`;

export const WaysToSpendCardDescription = styled.p`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  flex: 1;
  overflow: hidden;
  margin: ${props => props.margin && props.margin };
`;

export const WaysToSpendCardButton = styled.span`
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: left;
  color: #008bbf;
  text-transform: capitalize;
  cursor: pointer;
`;

export const WaysToSpendOutOfPocket = styled.div`
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 20px;
  letter-spacing: normal;
  text-align: left;
  color:#474B55;
`;

export const LimitationSectionWrapper = styled.div`

  @media only screen and (max-width: 480px) {
    padding: 0 20px;
  }
`;

export const LimitationSectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
  margin-bottom: 16px;
  margin-top: 40px;
`;

export const LimitationSectionParagraph = styled.p`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
`;

export const CoverageNoteWrapper = styled.div`
  margin-top: 56px;

  @media only screen and (max-width: 480px) {
    padding: 0 20px;
  }
`;

export const CoverageNoteParagraph = styled.p`
  font-size: 12px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  margin: ${props => props.margin ? props.margin : "10px 0"};
`;

export const CoverageNoteHeading = styled.p`
  font-size: 18px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
`;

export const CoverageNoteDesc = styled.p`
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
`;

export const ParticipatingLocationsLogoItem = styled.div`
  width: 100%;
  flex: 50%;

  @media only screen and (max-width: 1280px) {
    flex: 33%;
  }

  @media only screen and (max-width: 480px) {
    flex: 50%;
  }
`;

export const externalLinkStyles = `
  width: 100%;
  flex: 50%;
  cursor: pointer;

  @media only screen and (max-width: 1280px) {
    flex: 33%;
  }

  @media only screen and (max-width: 480px) {
    flex: 50%;
  }
`
export const PhoneBold = styled.span`
  white-space: nowrap;
  font-weight: 700;
`;