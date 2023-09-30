import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import HomePageCoachMarks from '../coachMarks/homePageCoachMarks/homePageCoachMarks'
import { SHOW_COACH_MARKS, SHOW_MEMBER_ID_CARD, SHOW_PAPERLESS_WIDGET} from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";
import GlobalStyle from "../../styles/GlobalStyle";
import HomeDetails from "./homeDetails";
import Spinner from "../common/spinner";
import PaperlessModal from "../common/paperlessModal";
import { useHistory } from 'react-router-dom'; 
import { AnalyticsPage, AnalyticsTrack } from "../../components/common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import { AnalyticsIdentifyNonMember, AnalyticsIdentifyMember } from "./../../components/common/segment/analytics";
import { MainContentContainer } from "../common/styles";
import { useCoachMarksContext } from "../coachMarks/homePageCoachMarks/coachMarksContext";
import { usePopperTooltip } from 'react-popper-tooltip';
import { getRecertificationDate, isEligibleForRecertDate } from '../../utils/misc.js'

const HomePage = () => {
  const { hasPassedTour } = useCoachMarksContext()
  const [openPaperLess,setOpenPaperLess] = useState(false)
  
  useEffect(() => {
    
    sessionStorage.setItem("longLoad", false)
  }, [])

  // peperless
  useEffect(() => {
    if(hasPassedTour) setOpenPaperLess(true);
  }, [hasPassedTour])

  const time = new Date().toLocaleTimeString('en-GB');
  const customerInfo = useSelector(state => state.customerInfo) 

  const { customerId, accountStatus, email, oktaId, companyCode, benefitPackage, hohPlans } = customerInfo?.data;

  const primaryPlan = customerInfo?.data?.hohPlans[0];
  const memberId = primaryPlan?.MemberId;
  const membershipStatus = primaryPlan?.MembershipStatus;
  const lastName = primaryPlan?.LastName;
  const firstName = primaryPlan ? primaryPlan?.FirstName : customerInfo?.data?.firstName;
  const planName = primaryPlan?.PlanName;

  const timeHrs = Number(time.split(":")[0])
  const history = useHistory();
  let paperlessFlag = customerInfo?.data?.preferenceCenterPaperless?.status;


  const splitAttributes = {
    lob: customerInfo.data.sessLobCode,
    companyCode: customerInfo.data.companyCode,
    benefitPackage: customerInfo.data.benefitPackage,
    membershipStatus:customerInfo.data.membershipStatus,
    accountStatus:customerInfo.data.accountStatus,
  }

  let greetingTxt = ''

  if (timeHrs >= 0 && timeHrs <= 11) {
    greetingTxt = 'Good morning,'
  }
  else if (timeHrs >= 12 && timeHrs <= 16) {
    greetingTxt = 'Good afternoon,'
  }
  else if (timeHrs >= 17) {
    greetingTxt = 'Good evening,'
  }

  const handleClickEvent = (label) =>{
    history.push(`/idcard`)
    handleSegmentBtn(label)
  }

  useEffect(() => {	 
    const identifySegmentFlag = localStorage.getItem('identifySegmentFlag'); 	
    if ((window.location.pathname === '/home') && oktaId && !identifySegmentFlag) {	
      const fullName = firstName + " " + lastName;	
      if (accountStatus === "MEMBER") {	
        localStorage.setItem('identifySegmentFlag', true)	
        AnalyticsIdentifyMember(customerId, fullName, email, oktaId, memberId)	
      }
      else {	
        localStorage.setItem('identifySegmentFlag',true)	 
        AnalyticsIdentifyNonMember(fullName, email, oktaId)	
      }	
    }	
  }, [oktaId]);	

  const handleSegmentBtn = (label) => { 
    AnalyticsPage()
    AnalyticsTrack(
      label + " " + "link clicked",
      customerInfo,
      {
        "raw_text": label,
        "destination_url": '/idcard',
        "description": label,
        "category": ANALYTICS_TRACK_CATEGORY.home,
        "type": ANALYTICS_TRACK_TYPE.linkClicked,
        "targetMemberId": customerInfo?.data?.memberId,
        "location": {
          "desktop": {
            "width": 960,
            "value": "left"
          },
          "tablet": {
            "width": 768,
            "value": "right"
          },
          "mobile": {
            "width": 0,
            "value": "right"
          }
        }
      }
    );
  }

  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({ placement: 'top' });

  return (
    
    !customerInfo.loading ? <Container>
      
      <GlobalStyle />
      <InnerContainer>
        <Banner>
       
          <GreetingContainer>
            <GreetingInnerContainer>
              <LeftContainer>
              <LeafIcon alt = "" type = {accountStatus } src="/react/images/leaf-icon@3x.png"></LeafIcon>
              <Div type = {accountStatus}>
            <Greeting>{greetingTxt}</Greeting> <br />
            <Title>{firstName}&nbsp;{lastName}</Title>
            {accountStatus === "MEMBER"  &&<>
            <MemberDetails>Member ID: {memberId}</MemberDetails>
            <PlanName>{planName}</PlanName>
            <StatusWrapper>
              <StatusContainer>
                <Status>
                  <StatusTxt status = {customerInfo.data.membershipStatus}>
                  {customerInfo.data.membershipStatus}
                  </StatusTxt>
                </Status>
                {/* {visible && <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container' })}>
                    <div {...getArrowProps({ className: 'tooltip-arrow' })} />
                    {"Active as of xx/xx/xxxx"}
                </div>} */}
                {/* <TooltipIcon ref={setTriggerRef} /> */}
              </StatusContainer>
              { isEligibleForRecertDate(hohPlans?.[0]?.CompanyNumber, hohPlans?.[0]?.BenefitPackage, hohPlans?.[0]?.renewalDate) && <RecertDate>{getRecertificationDate(hohPlans?.[0]?.CompanyNumber, hohPlans?.[0]?.BenefitPackage, hohPlans?.[0]?.renewalDate)}</RecertDate> }
            </StatusWrapper>
          <FeatureTreatment
              treatmentName={SHOW_MEMBER_ID_CARD}
              onLoad={() => {}}
              onTimedout={() => {}}
              attributes={splitAttributes}>
          <ViewMemberId className="myHealthPlan-coachmark" onClick={() =>  history.push(`/idcard`)}>
          <MemberIcon alt = "" src = "/react/images/icn-card.svg"/>
          <MemberTxt  onClick={() =>handleClickEvent('View Member ID Card')}>View Member ID Card</MemberTxt>
          </ViewMemberId>
          </FeatureTreatment>
          </>}
          </Div>
          </LeftContainer>
          <RightContainer/>
          </GreetingInnerContainer>
          </GreetingContainer>
        </Banner>
        <HomeDetails/>
        
        <FeatureTreatment
          treatmentName={SHOW_COACH_MARKS}
          onLoad={() => { }}
          onTimedout={() => { }}
          attributes={splitAttributes}
        > 
          <HomePageCoachMarks />
        </FeatureTreatment>

        <ModelContainer>
        {accountStatus ==="MEMBER" && !paperlessFlag && openPaperLess &&
        <FeatureTreatment
          treatmentName={SHOW_PAPERLESS_WIDGET}
          onLoad={() => { }}
          onTimedout={() => { }}
          attributes={splitAttributes}
        > 
          <PaperlessModal/>
          </FeatureTreatment>  }
        </ModelContainer>
        
      </InnerContainer> 
    </Container> : (<ProgressWrapper>
                 <Spinner/></ProgressWrapper> )
                 
               

  )
};
const Container = styled(MainContentContainer)`
position:relative;
color:white;
`;

const ModelContainer = styled.div`
z-index:500;
position:fixed;
transition: opacity 300ms ease-in-out;`;

const Div = styled.div`
margin-top : ${props => props.type === "MEMBER" ? '0px':'40px'};
`;

const GreetingContainer = styled.div`

position:absolute;
padding-top: 40px;
margin: 3px 0 0px 0px;
width:100%;
@media only screen and (max-width: 960px) {
  margin-top: 21px;
  padding-top: 20px;
};
@media only screen and (max-width: 768px) {
  margin-top: 21px;
  padding-top: 20px;
};
@media only screen and (max-width: 480px) {
  // margin-top: -34px;
  margin-left: 0px;
  // padding-top:20px
}

`;



const ViewMemberId = styled.button`
width:calc(100% - 32px);
position:absolute;
display: inline-flex;
align-items: center;
justify-content: center;
margin: 20px 0px;
display:flex;
height:40px;
background-color:#ffffff;
border-radius: 5px;
border: 1px solid #ffffff;
padding: 8px;
box-shadow:  0 0 8px 0 rgba(0, 0, 0, 0.23);
@media only screen and (min-width: 481px) {
 width: 188px;
}
&:hover{
  cursor:pointer;
  background-color:#F2F9FC;
}
&:hover p{
  color:#008BBF
}
`;


const Title = styled.span`
  height: 60px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  font-size: 48px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: normal;
  color: white;text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: block;
  @media only screen and (max-width: 768px) {
    font-size: 48px;
  };
`;
const MemberDetails = styled.div`
  height: 24px;
  font-size: 16px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  font-stretch: normal;
  font-style: normal;
  line-height: 24px;
  letter-spacing: normal;
  color: #ffffff;
`;

const PlanName = styled.div`
height: 20px;
font-size: 14px;
font-weight: 400;
font-stretch: normal;
font-style: normal;
line-height: 1.29;
letter-spacing: normal;
color: #ffffff;
text-transform:capitalize;
text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const Status = styled.div`
width:90px;
height: 20px;
padding: 4px 6px;
background-color:#ffffff;
border-radius: 5px;
display:inline-block;
`;

const StatusTxt = styled.p`
  font-size: 12px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 1.5px;
  text-align: center;
  text-transform:uppercase;
  color: ${props => props.status === 'inactive' ? '#d43900' :  props.status === 'upcoming' ? '#529535' :'#3e7128'};
`;



const MemberIcon = styled.img`
width: 20px;
height: 20px;
flex-grow: 0;
object-fit: contain;
`;

const MemberTxt = styled.p`
flex-grow: 0;
font-size: 14px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: normal;
letter-spacing: normal;
color: #008bbf;
margin-left: 2px;
`;

const Greeting = styled.span`

  width: 128px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  font-size: 16px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: white;
  @media only screen and (max-width: 480px) {
    font-size: 16px;
  }

  `;
const Banner = styled.div`
  height: 240px;
  margin: auto;
  @media only screen and (max-width: 480px) {
    height: 240px;
  }
  background-image: linear-gradient(to bottom,#003863, rgba(238, 238, 238, 0)),linear-gradient(
  101deg, #0377a3, #0377a3, #367c19);
`;


const InnerContainer = styled.div`
  overflow: hidden;
  // height:240px;
  // @media only screen and (max-width: 480px) {
  //   height:178px;
  // }
`;



const ProgressWrapper = styled.div`
    width:100%;
    position: absolute;
    margin-top: 50px;
`;





const LeftContainer = styled.div`
 
  display: block;
  width:950px;
    @media only screen and (max-width: 960px) {
      margin: 0 86px;
      width: calc(100% - 172px);
    };

    @media only screen and (max-width: 668px) {
      margin: 0 16px;
      width:calc(100% - 32px);
    };
   
`;

const LeafIcon = styled.img`
  width: 240px; 
  float: left;
  margin-left: -144px;
  object-fit: contain;
  position:absolute;
  margin-top :0px;
  @media only screen and (max-width: 960px) {
     margin-left: -144px;
     float:right;
    position:relative;
    margin-top : ${props => props.type === "MEMBER" ? '-20px':'-60px'};
  }
  @media only screen and (max-width: 480px) {
    padding-right:8px;
    width:240px;
    height:240px;
    padding-top:0;
    top:0px;
    margin-top : ${props => props.type ? '-15px':'-30px'};
  }
`;

const GreetingInnerContainer = styled.div`
  display: flex;
  margin: 0 144px;
  width:calc(100% - 288px);
  gap:35px;
  flex: 1 1 auto;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  @media only screen and (max-width: 1200px) {
    margin: 0 86px;
    width:calc(100% - 172px);
  };
  @media only screen and (max-width: 960px) {
    display: contents;
    margin: 0;
    width:100%;
  };
`;

const RightContainer = styled.div`
  display: block;
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;

  @media only screen and (max-width: 481px) {
    flex-direction: column;
    align-items: start;
  };
`;

const RecertDate = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #FFFFFF;
  margin-left: 12px;
  padding-top: 2px;

  @media only screen and (max-width: 481px) {
    margin-left: 0px;
    margin-top: 7px;
  };
`;

export const TooltipIcon = styled.div`
  margin-left: 8px;
  content: "";
  background-image: url("/react/images/info-circle-icon-white.svg");
  background-position: center;
  background-size: cover;
  width: 16px;
  height: 16px;
  cursor: pointer;

  /* &:hover {
    background-image: url("/react/images/info-circle-icon-blue.svg");
  } */
`;

export const StatusContainer = styled.div`
  display: flex;
  align-items: center;
`;

export default HomePage;
