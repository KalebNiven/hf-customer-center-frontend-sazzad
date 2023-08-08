import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import moment from 'moment'; 
import { ButtonWrapper, CloseIcon, Header, ModalContent, ModalInnerWrapper, ModalWrapper } from "../../styles/commonStyles";
import { AppBar, Link, Toolbar } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { StyledButton } from '../common/styles';
import { reportError as reportErrorAction } from "../../store/actions/index";
import { AnalyticsTrack } from "../../components/common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import { useLogout } from '../../hooks/useLogout'


const HealthPlans = ({ customerInfo, activeTabForPrevPlan }) => {
  const { MIX_REACT_OKTA_API_URL } = process.env;
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(activeTabForPrevPlan);
  const [activePlans, setActivePlans] = useState([]);
  const [inactivePlans, setInactivePlans] = useState([]);
  const [activeDepPlans, setActiveDepPlans] = useState([]);
  const [inactiveDepPlans, setInactiveDepPlans] = useState([]);
  const [reportErrorModal, setReportErrorModal] = useState(false)
  const [reportErrorConfirmation, setReportErrorConfirmation] = useState({ value: false, error: false })
  const [finalReportingModal, setFinalReportingModal] = useState(false)
  const reportErrorSuccess = useSelector(state => state.settingsReducer.reportErrorSuccess)
  const [reportingError, setReportingError] = useState(false)
  const logoutApi = useLogout();

  useEffect(() => {
    splitPlans();
  }, []);

  useEffect(() => {
    if (reportErrorSuccess) {
      setReportErrorModal(false)
      setFinalReportingModal(true)
      logoutApi()
    }
  }, [reportErrorSuccess])

  const handleDate = (dateFrom, dateTo) => {
    const from = moment(dateFrom).format('LL');
    const to = moment(dateTo).format('LL');
    const expirationInUnix = moment(dateTo).format('X');
    const effectiveInUnix = moment(dateFrom).format('X');
    const todayInUnix = moment().unix();
    if (expirationInUnix > todayInUnix && effectiveInUnix <= todayInUnix) {
      return `${from} - Present`;
    } else if (expirationInUnix > todayInUnix && effectiveInUnix > todayInUnix) {
      return `${from}`;
    } else {
      return `${from} - ${to}`;
    }
  }

  const splitPlans = () => {
    let activeArr = [], inactiveArr = [], activeDepArr = [], inactiveDepArr = [];

    // This is the assumption that the previous plans only shows inactive plans for hoh
    customerInfo?.previousPlans?.map((plan) => {
      inactiveArr.push(plan);
    });

    // Split Active & Inactive Plans for Primary
    customerInfo?.hohPlans?.map((plan) => {
      if (plan.MembershipStatus === 'active' || plan.MembershipStatus === 'upcoming')
        activeArr.push(plan);
    });
    setActivePlans(activeArr);
    setInactivePlans(inactiveArr);

    // Split Active & Inactive Plans for Dependants
    customerInfo?.dependents?.map((plan) => {
      if (plan.Status === 'active' || plan.Status === 'upcoming')
        activeDepArr.push(plan);
      else
        inactiveDepArr.push(plan);
    });
    setActiveDepPlans(activeDepArr);
    setInactiveDepPlans(inactiveDepArr);
  }

  const closeReportErrorModal = () => {
    setReportErrorConfirmation({ error: false, value: false })
    setReportErrorModal(false);
  }

  const reportError = () => <Report>Not you? <Blue onClick= {() => handleSegmentBtn('Report Error')}>Report Error</Blue></Report>

  const reportErrorModalTemplete = () => {
    return (
      <FormModalWrapper visible={reportErrorModal}>
        <ModalInnerWrapper>
          <FormModalContent>
            <CloseIcon alt = "" src="/react/images/icn-close.svg" onClick={closeReportErrorModal} />
            <div>
              <Header>
                Report an Error
              </Header>
              <SubHeader>
                Don’t recognize this information as yours? Please report the error and we’ll look into it.  Do you want to continue?
              </SubHeader>
              <ReportErrorCheckboxWrapper>
                <ReportErrorCheckboxCustom className="checkbox-container" htmlFor="reportErrorCheckbox" checked={reportErrorConfirmation.value}
                  onClick={() => setReportErrorConfirmation({ value: !reportErrorConfirmation.value, error: false })}
                  error={reportErrorConfirmation.error}>
                  <CheckboxConfirmationText>Yes. I do not recognize this membership and want Healthfirst to look into it.</CheckboxConfirmationText>
                  <span><ReportErrorCheckChar checked={reportErrorConfirmation.value} error={reportErrorConfirmation.error}></ReportErrorCheckChar></span>
                </ReportErrorCheckboxCustom>
                {reportErrorConfirmation.error && <InputErrorMsg>Selection is required</InputErrorMsg>}
              </ReportErrorCheckboxWrapper>
              <FormButtonWrapper>
                <StyledButton variant="secondary" onClick={closeReportErrorModal}>
                  Cancel
                </StyledButton>
                <Spacer></Spacer>
                <StyledButton variant={"primary"} onClick={() => {
                  if (!reportErrorConfirmation.value) {
                    setReportErrorConfirmation({ ...reportErrorConfirmation, error: true })
                  } else {
                    setReportingError(true)
                    dispatch(reportErrorAction(customerInfo?.hohPlans[0]?.MembershipKey))
                    handleSegmentBtn('Widget Report Error')
                  }
                }} >
                  {reportingError ? <ProgressSpinnerWrapper><ProgressSpinner /> </ProgressSpinnerWrapper>: "Report Error"}
              </StyledButton>
            </FormButtonWrapper>
          </div>
        </FormModalContent>
      </ModalInnerWrapper>
      </FormModalWrapper >
    )
  }
  const handleSegmentBtn = (label) => {  
    if (label=== 'Report Error'){
       setReportErrorModal(true); 
    } 
    else if (label=== 'Active Plans'){  
      setActiveTab("active")
    }
    else if(label=== 'Previous Plans'){ 
      setActiveTab("inactive")
    }
    AnalyticsTrack(
      label + " " + "Clicked",
      customerInfo,
      {
        "raw_text": label,
        "destination_url": label,
        "description": label + " in HealthPlans Tab",
        "category": ANALYTICS_TRACK_CATEGORY.settings,
        "type": ANALYTICS_TRACK_TYPE.buttonClicked,
        "targetMemberId":customerInfo?.memberId,
        "location": {
          "desktop": {
            "width": 960,
            "value": "center"
          },
          "tablet": {
            "width": 768,
            "value": "center"
          },
          "mobile": {
            "width": 0,
            "value": "center"
          }
        }
      }
    );
  }

const finalReportingModalTemplete = () => {
  return (
    <GreyFormModalWrapper visible={finalReportingModal}>
      <AppBar position="sticky" className="no-print" style={{ color: 'black', zIndex: 500 }}>
        <Toolbar style={{ justifyContent: 'space-between', backgroundColor: 'white' }}>
          <img alt = "" src={`${window.location.origin}/react/images/icn-hf-logo.svg`} />
        </Toolbar>
      </AppBar>
      <ModalInnerWrapper>
        <FormModalContent>
          <div>
            <CenterHeader>
              Thank You For Reporting An Error
            </CenterHeader>
            <CenterSubHeader>
              To ensure your privacy and account security, we need to temporarily disable access to your account. You’ll receive an email once you’re able to log in within 3–5 days. We apologize for the inconvenience.
            </CenterSubHeader>
            <CenterSubHeader>
              Please <BlueLink href="https://healthfirst.org/contact">contact us</BlueLink> if you have any questions.
            </CenterSubHeader>
          </div>
        </FormModalContent>
      </ModalInnerWrapper>
    </GreyFormModalWrapper >
  )
}

const displayMainComponent = () => (
  activeTab === "active" ?
    <>
      {
        activePlans.length === 0 && activeDepPlans.length === 0 &&
        <PlanCard>
          <CenterImgBlock><ImgContent src="/img/gray/ico-plan.svg" background="#ffffff" /></CenterImgBlock>
          <Info>There are no plans to display.</Info>
        </PlanCard>
      }
      {
        activePlans.length > 0 &&
        activePlans.map((plan) => {
          return (
            <PlanCard>
              <PlanName>{plan.PlanName}</PlanName>
              <MemberName>{plan.FirstName?.toLowerCase()}  {plan.LastName?.toLowerCase()}</MemberName>
              <Member>
                <MemberTitle>MEMBER ID:</MemberTitle>
                <MemberID>{plan.MemberId}</MemberID>
              </Member>
              <PlanDuration>Active on {handleDate(plan.MembershipEffectiveDate, plan.MembershipExpirationDate)}</PlanDuration>
              <Row>
                {
                  plan.MembershipStatus === 'active' ?
                    <ActivePlan>{plan.MembershipStatus.toUpperCase()}</ActivePlan>
                    :
                    <UpcomingPlan>{plan.MembershipStatus.toUpperCase()}</UpcomingPlan>
                }
                {reportError()}
              </Row>
            </PlanCard>
          )
        })
      }
      {
        activeDepPlans.length > 0 &&
        activeDepPlans.map((plan) => {
          return (
            <PlanCard>
              <ImgBlock><PlanName>{plan.planName}</PlanName>
                <LinkIcon alt = "" src="/img/ico-linked-account.svg" />
              </ImgBlock>
              <MemberName>{plan.firstName?.toLowerCase()}  {plan.lastName?.toLowerCase()}</MemberName>
              <Member>
                <MemberTitle>MEMBER ID:</MemberTitle>
                <MemberID>{plan.memberId}</MemberID>
              </Member>
              <PlanDuration>Active on {handleDate(plan.MembershipEffectiveDate, plan.MembershipExpirationDate)}</PlanDuration>
              <Row>
                {
                  plan.Status === 'active' ?
                    <ActivePlan>{plan.Status.toUpperCase()}</ActivePlan>
                    :
                    <UpcomingPlan>{plan.Status.toUpperCase()}</UpcomingPlan>
                }
                {reportError()}
              </Row>
            </PlanCard>
          )
        })
      }
    </>
    :
    <>
      {
        inactivePlans.length === 0 && inactiveDepPlans.length === 0 &&
        <PlanCard>
          <CenterImgBlock><ImgContent src="/img/gray/ico-plan.svg" background="#ffffff" /></CenterImgBlock>
          <Info>There are no plans to display.</Info>
        </PlanCard>
      }
      {
        inactivePlans.length > 0 &&
        inactivePlans.map((plan) => {
          return (
            <PlanCard>
              <PlanName>{plan.PlanName}</PlanName>
              <MemberName>{plan.FirstName?.toLowerCase()}  {plan.LastName?.toLowerCase()}</MemberName>
              <Member>
                <MemberTitle>MEMBER ID:</MemberTitle>
                <MemberID>{plan.MemberId}</MemberID>
              </Member>
              <PlanDuration>Active on {handleDate(plan.MembershipEffectiveDate, plan.MembershipExpirationDate)}</PlanDuration>
              <Row>
                <InactivePlan>{plan.MembershipStatus.toUpperCase()}</InactivePlan>
                {reportError()}
              </Row>
            </PlanCard>
          )
        })
      }
      {
        inactiveDepPlans.length > 0 &&
        inactiveDepPlans.map((plan) => {
          return (
            <PlanCard>
              <ImgBlock><PlanName>{plan.planName}</PlanName>
                <LinkIcon alt = "" src="/img/ico-linked-account.svg" />
              </ImgBlock>
              <MemberName>{plan.firstName?.toLowerCase()}  {plan.lastName?.toLowerCase()}</MemberName>
              <Member>
                <MemberTitle>MEMBER ID:</MemberTitle>
                <MemberID>{plan.memberId}</MemberID>
              </Member>
              <PlanDuration>Active on {handleDate(plan.MembershipEffectiveDate, plan.MembershipExpirationDate)}</PlanDuration>
              <Row>
                <InactivePlan>{plan.Status.toUpperCase()}</InactivePlan>
                {reportError()}
              </Row>
            </PlanCard>
          )
        })
      }
    </>
)

return (
  <Container>
    <RightHeader>Your Healthfirst Plans</RightHeader>
    <ButtonRow>
      <Button onClick= {() => handleSegmentBtn('Active Plans')} active={activeTab === "active" ? true : false}>Active Plans</Button>
      <Button onClick={() => handleSegmentBtn('Previous Plans')} active={activeTab === "inactive" ? true : false}>Previous Plans</Button>
    </ButtonRow>
    {displayMainComponent()}
    <EndNotice>If you have any questions regarding your Healthfirst coverage, please call the Member Services
      phone number on your Member ID card or visit us at
      <Mail>member.healthfirst.org/contactus</Mail>
    </EndNotice>
    {reportErrorModal && reportErrorModalTemplete()}
    {finalReportingModal && finalReportingModalTemplete()}
  </Container>
)

}

export default HealthPlans;
const Container = styled.div`
  // padding: 0 16px;
  @media only screen and (max-width: 1024px) {
    padding:0;
  };
  @media only screen and (max-width: 767px) {
    padding:0 16px
  };
`;
const Button = styled.button`
  margin-top: 32px;
  display: block;
  gap: 10px;
  padding: 2px 12px;
  border-radius: 14px;
  border: none;
  background-color: ${(props) => props.active ? '#3e7128' : '#f4f4f4'};
  color: ${(props) => props.active ? '#ffffff' : '#474b55'};
  margin-right: 10px;
  cursor: pointer;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`;

const PlanCard = styled.div`
  padding: 16px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
  margin: 24px 0px 16px;
`;

const PlanName = styled.div`
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.13;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
`;

const Member = styled.div`
  display: flex;
  margin-top: 4px;
`;
const MemberTitle = styled.div`
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.2px;
  text-align: left;
  color: #757575;
`;

const MemberID = styled.div`
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  margin-left: 15px;
`;

const MemberName = styled.div`
  text-transform: capitalize;
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  margin-top: 4px;
`

const PlanDuration = styled.div`
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  margin-top: 4px;
`;

const ActivePlan = styled.div`
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 1.5px;
  text-align: center;
  color: #ffffff;
  padding: 4px 6px;
  background-color: #3e7128;
  border-radius: 4px;
  width: 100px;
  float: left;
`;

const UpcomingPlan = styled.div`
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 1.5px;
  text-align: center;
  color: #3e7128;
  padding: 4px 6px;
  border: solid 1px #3e7128;
  border-radius: 4px;
  width: 100px;
  float: left;
`;

const InactivePlan = styled.div`
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 1.5px;
  text-align: center;
  color: #ffffff;
  padding: 4px 6px;
  background-color: #d43900;
  border-radius: 4px;
  width: 100px;
  float: left;
`;

const Row = styled.div`
  display: inline-block;
  margin-top: 16px;
  width: 100%;
`;

const Report = styled.div`
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  float: right;
`;

const Blue = styled.span`
  color: #008bbf;
  cursor: pointer;
  &:hover{
    color: #2A6A9E;
    text-decoration: underline;
  }
`;

const Info = styled.div`
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: center;
  color: #474b55;
`;

const EndNotice = styled.div`
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: center;
  color: #474b55;
  margin-top: 50px;
`;

const Mail = styled.div`
  font-weight: bold;
  color: #3e7128
`;

const LinkIcon = styled.img`
  margin-left: 8px;
`;

const RightHeader = styled.div`
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
  margin-top: 24px;
`;

const SubHeader = styled.div`
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  margin-top: 8px;
`;

const ImgBlock = styled.span`
  display: flex;
`;

const CenterImgBlock = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const ImgContent = styled.div`
  width: 42px;
  height: 42px;
  background: ${(props) => props.background ? `url(${props.src}) no-repeat ${props.background} 4px`
    : `url(${props.src}) no-repeat #ffffff`};
  border-radius: 4px;
  padding: 4px;
`;

const Spacer = styled.div`
width:20px;
`;
const FormButtonWrapper = styled(ButtonWrapper)`
margin-top: 4rem;
margin-bottom: 0.5rem;
display: flex;
 justify-content: end;
  @media only screen and (max-width: 375px) {
	width:100%;
  display:flex;
	flex-direction:column-reverse;
    gap:8px;
    >button{
        margin:0
    }
}
`;

const FormModalWrapper = styled(ModalWrapper)`
    transition: opacity 300ms ease-in-out;
    opacity: ${props => props.visible ? "1" : "0"};
`
const GreyFormModalWrapper = styled(FormModalWrapper)`
  background-color:#f4f4f4;
`

const FormModalContent = styled(ModalContent)`
    transition: opacity 300ms ease-in-out;
    top: 50%;
    transform: translateY(-50%);
    border:none;
    width: 440px;
    height:fit-content;
    padding:18px;
    @media only screen and (max-width: 768px) {
      width:95%;
    };
    @media only screen and (max-width: 375px) {
      padding:12px;
    };
`
const CenterHeader = styled(Header)`
  text-align:center;
  font-size:24px;
  font-family: "museo-sans", san-serif;
`
const CenterSubHeader = styled(SubHeader)`
  text-align:center;
  font-family: "museo-sans", san-serif;
  font-weight: 500;
`
const BlueLink = styled(Link)`
  color:#008bbf;
`

const SpinnerRotate = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
`;

const ProgressSpinnerWrapper = styled.div`
    width:125px
`
const ProgressSpinner = styled.div`
  text-align: center;
  margin: auto;
  border: .2rem solid #375225;
  border-top: .2rem solid white;
  border-radius: 50%;
  height: 1rem;
  width: 1rem;
  animation-name: ${SpinnerRotate};
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  @media only screen and (max-width: 768px) {
	margin:auto;
  };
`;

const ReportErrorCheckboxWrapper = styled.div`
	margin-top: 1rem;
	width: 100%;
`;

const CheckboxConfirmationText = styled.p`
  padding-top: 0.2rem;
  font-weight:500;
`;
const ReportErrorCheckboxCustom = styled.div`
	display: block;
    position: relative;
    padding-left: 35px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
	p{
		color: ${props => props.error ? "#ad122a" : "#474b55"};
		font-size: 14px;
		font-weight: 500;
		font-stretch: normal;
		font-style: normal;
		line-height: 1.43;
		letter-spacing: normal;
		padding-top: .5rem;
	}
	span{
		display: ${props => props.checked ? "block" : "default"};
		position: absolute;
		top: 0;
		left: 0;
		height: 20px;
		width: 20px;
		background-color: ${props => props.checked ? "#003863" : "#fff"};
		margin-top: 7px;
		border: ${props => props.error ? "1px solid #ad122a" : "1px solid #a8abac"};
		border-radius: 4px;
	}
	
	span:hover {
		background-color: ${props => props.checked ? "#003863" : "#ccc"};
	}
`;

const ReportErrorCheckChar = styled.div`
${props => props.checked && ({
    content: '',
    position: 'absolute',
    left: '7px',
    top: '4px',
    width: '5px',
    height: '10px',
    border: 'solid white',
    borderWidth: '0 3px 3px 0',
    webkitTransform: 'rotate(45deg)',
    msTransform: 'rotate(45deg)',
    transform: 'rotate(45deg)'
  })
  }
`;

const InputErrorMsg = styled.div`
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #a0252c;
  padding-top: 4px;
`;