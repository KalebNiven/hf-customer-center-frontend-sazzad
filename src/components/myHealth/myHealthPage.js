import React, { useEffect, useState, Fragment } from "react";
import styled from "styled-components";
import GlobalStyle from "../../styles/GlobalStyle";
import { useSelector, useDispatch } from "react-redux";
import { requestCustomerInfo } from '../../store/actions';
import Spinner from "../common/spinner";
import { getHraStatuses } from '../../store/saga/apis'
import { SHOW_HEALTH_ASSESMENT_SURVEY, SHOW_MYHEALTH, SHOW_NOW_POW } from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";
import { getFeatureFlagList } from "../../constants/splits";
import GeneralHealthResources from "./generalHealthResources";
import DropDownContent from "./dropDownContent";
import HealthResources from './healthResources'
import HealthResourcesChevron from './healthResourcesChevron'
import { useHealthResourcesContext } from './healthResourcesContext'
import { HRA_RESOURCES_COMPANY_CODES } from './const'
import { isValidCompanyCode } from './utils'
import NowPowSection from './nowPowSection'
import { useHistory } from 'react-router-dom'
import { AnalyticsTrack } from "../common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";
import GlobalError from "../common/globalErrors/globalErrors";
const LINK_TYPE = { external: "External", cc: "CC" }

const MyHealthPage = () => {
  useEffect(()=>{ 
    sessionStorage.setItem("longLoad", false)
  },[])
  const dispatch = useDispatch();
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const { dependents } = customerInfo;
  const history = useHistory()

  const splitAttributes = {
    lob: customerInfo.sessLobCode,
    companyCode: customerInfo.companyCode,
    benefitPackage: customerInfo.benefitPackage,
    membershipStatus: customerInfo.membershipStatus,
    accountStatus: customerInfo.accountStatus,
  }
  const featureFlagList = getFeatureFlagList();

  // useEffect(() => {
  //   dispatch(requestCustomerInfo());
  // }, []);

  const [surveyStatuses, setSurveyStatuses] = useState(null);
  const { surveyLocalStatuses, currentResources, resoucesVisible, generalResources, generalResourcesLoader } = useHealthResourcesContext()

  // get hra statuses from both Mulesoft & local db
  useEffect(() => {
    if (!dependents) return;
    getHraStatuses(customerInfo.memberId, customerInfo.dependents)
    .then(data => {
      const statuses = {};
      data.forEach(item => {
        const data = JSON.parse(item.data)
        statuses[data.memberId] = data.status
      })
      setSurveyStatuses(statuses)
    })
  }, [dependents])


  const getAssessmentLink = (eachDependent) => {
    let hrefLink;
    let checkObj = !eachDependent ? customerInfo : eachDependent;
    if (checkObj.companyCode == "30" && ["SIGD", "SIGO", "SIGT"].some(x => x == checkObj.benefitPackage)) {
      hrefLink = { type: LINK_TYPE.external, link: "https://myhfsignaturesurvey.com/healthfirst/hralogin/" }
    }
    else if (checkObj.companyCode == "45" && ["PPOM"].some(x => x == checkObj.benefitPackage)) {
      hrefLink = { type: LINK_TYPE.external, link: "https://myhfsignaturesurvey.com/healthfirst/hralogin/" }
    }
    else if (checkObj.companyCode == "30" && ["NY65", "IBP1", "CBP1", "LIP1", "DMCR"].some(x => x == checkObj.benefitPackage)) {
      hrefLink = { type: LINK_TYPE.external, link: "https://myhfhealthsurvey.com/" }
    }
    else {
      hrefLink = { type: LINK_TYPE.cc, link: `/hra/${checkObj?.memberId}` }
    }
    return hrefLink

  }

  const atleastOneMemberComplete = (obj) => {
    if(!obj) return false;
    let complete = Object.values(obj).find(item => item === "COMPLETE");
    return complete ? true : false;
  }

  const atleastOneMemberValid = (customerInfo) => {
    if(!customerInfo) return;
    let isValid = false;
    const companyCodes = [ ...new Set([customerInfo.companyCode, ...customerInfo.dependents.map(dep => dep.companyCode)]) ]
    isValid = companyCodes.some(code => isValidCompanyCode(code, HRA_RESOURCES_COMPANY_CODES))
    return isValid;
  }

  const handleTakeAssessmentBtn = (e, assessmentLink, targetMemberId) => {
    // Segment Track
    AnalyticsTrack(
      "Take Assessment Button Clicked", 
      { data: {...customerInfo} },
      {
          "raw_text": e.target.textContent, 
          "description": e.target.textContent, 
          "destination_url": assessmentLink.type === LINK_TYPE.cc ? window.location.origin + assessmentLink.link : assessmentLink.link, 
          "category": ANALYTICS_TRACK_CATEGORY.myHealth, 
          "type": ANALYTICS_TRACK_TYPE.buttonClicked, 
          "targetMemberId": targetMemberId,
          "location": {
              "desktop":{
                  "width": 1024,
                  "value": "top right"
              },
              "tablet":{
                  "width": 768,
                  "value": "top right"
              },
              "mobile":{
                  "width": 0,
                  "value": "top right"
              }
          }
      }
    );

    if(assessmentLink.type === LINK_TYPE.cc) {
      history.push({ pathname: `${assessmentLink.link}` })
    } else {
      window.location.href = assessmentLink.link
    }
  }
  return (
  
    <ReactAppWrapper>
      <FeatureTreatment
            treatmentName={SHOW_MYHEALTH}
            onLoad={() => { }}
            onTimedout={() => { }}
            attributes={splitAttributes}
          >
      { 
        customerInfo.companyCode !== null && !["34", "02"].some(x => x == customerInfo.companyCode) && (
          <FeatureTreatment
            treatmentName={SHOW_HEALTH_ASSESMENT_SURVEY}
            onLoad={() => { }}
            onTimedout={() => { }}
            attributes={splitAttributes}
          >
            <Container>
              <GlobalStyle />
              <Header>Annual Health Assessment</Header>
              {surveyStatuses ? <HRAWrapper>
                <CardMain>
                  <CardNav>
                    <IconContainer>
                      <ImgIcon src="react/images/icn-hra.svg" />
                    </IconContainer>
                    <InlineInnerContainer>
                      <InnerHeader>Take your Annual Health Assessment!</InnerHeader>
                      <Content>Please complete this voluntary Health Questionnaire.
                            This will help us to meet your health care needs.
                            This survey is confidential and will NOT affect your healthcare coverage. If you have any other questions about this Health Questionnaire, please call Member Services.
                      </Content>
                    </InlineInnerContainer>
                  </CardNav>
                    <HorizontalDivider />
                    {atleastOneMemberValid(customerInfo) && <HealthResources customerInfo={customerInfo} />}
                    <Main>
                      {surveyStatuses[customerInfo?.memberId] === "COMPLETE" ? <StatusImg src="react/images/icn-green-tick.svg" /> : <StatusImg src="react/images/icn-grey-checkmark.svg" />}
                      <Name>{customerInfo?.firstName} {customerInfo?.lastName}</Name>
                      {surveyStatuses[customerInfo.memberId] === "COMPLETE" ? <Complete>COMPLETE</Complete> : <Assessment onClick={(e) => handleTakeAssessmentBtn(e, getAssessmentLink(), customerInfo.memberId)}>Take Assessment</Assessment>}
                      <HealthResourcesChevron currentMemberInfo={customerInfo} />
                    </Main>
                      { resoucesVisible.includes(customerInfo.memberId) && <DropDownContent content={currentResources[customerInfo.memberId] ? currentResources[customerInfo.memberId] : []} /> }
                  {
                    customerInfo?.dependents && customerInfo?.dependents.length > 0 && customerInfo?.dependents.map((eachDependent, idx) => {
                      return (
                        <Fragment key={idx}>
                          <HorizontalDivider />
                          <Main>
                            {surveyStatuses[eachDependent.memberId] === "COMPLETE" ? <StatusImg src="react/images/icn-green-tick.svg" /> : <StatusImg src="react/images/icn-grey-checkmark.svg" />}
                            <Name>{eachDependent?.firstName} {eachDependent?.lastName}</Name>
                            {surveyStatuses[eachDependent.memberId] === "COMPLETE" ? <Complete>COMPLETE</Complete> : <Assessment onClick={(e) => handleTakeAssessmentBtn(e, getAssessmentLink(eachDependent), eachDependent.memberId)}>Take Assessment</Assessment>}
                            <HealthResourcesChevron currentMemberInfo={eachDependent} />
                          </Main>
                            { resoucesVisible.includes(eachDependent.memberId) && <DropDownContent content={currentResources[eachDependent.memberId] ? currentResources[eachDependent.memberId] : []} /> }
                        </Fragment>
                      )
                    })
                  }
                </CardMain>
                { (atleastOneMemberComplete(surveyLocalStatuses) && generalResources?.length > 0) ? <GeneralHealthResources content={generalResources} /> : generalResourcesLoader ? <SpinnerWrapper><Spinner /></SpinnerWrapper> : null }
              </HRAWrapper> : <SpinnerWrapper><Spinner /></SpinnerWrapper>}
            </Container>
          </FeatureTreatment>
        )
      }
        <FeatureTreatment
          treatmentName={SHOW_NOW_POW}
          onLoad={() => { }}
          onTimedout={() => { }}
          attributes={splitAttributes}
        >
          <NowPowSection />
        </FeatureTreatment>
        </FeatureTreatment>
        <FeatureTreatment
          treatmentName={SHOW_MYHEALTH}
          onLoad={() => { }}
          onTimedout={() => { }}
          attributes={splitAttributes}
          invertBehavior
        >
          <GlobalError/>
        </FeatureTreatment>
    </ReactAppWrapper> 
  )
};

const Header = styled.div`
font-family: "museo-sans", san-serif;
font-size: 24px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1.33;
letter-spacing: normal;
color: #003863;
@media only screen and (max-width: 480px) {
  margin: 0 15px;
}
`;

const Container = styled.div`
* {
  box-sizing: content-box;
}
background-color:#f4f4f4;
margin: 40px 0 0 0;
@media only screen and (min-width: 481px) and (max-width: 769px) {
  margin: 40px 100px 0 100px;
}
`;

const ReactAppWrapper = styled.div`
max-width: 1024px;
position: relative;
margin: auto;
`;

const CardMain = styled.div`
border-radius: 4px;
box-shadow: 0 2px 8px 0 #d8d8d8;
background-color: #ffffff;
margin: 25px 0 56px 0;
`;

const IconContainer = styled.div`
width: 100px;
height: 100px;
margin-right: 10px;
display: list-item;
border-radius: 50%;
text-align: -webkit-center;
::marker {
  color: transparent;
}
@media only screen and (max-width: 480px) {
  display: block;
  margin: auto;
}
`;

const ImgIcon = styled.img`
width: 100px;
height: 100px;
display: list-item;
border-radius: 50%;
object-fit: scale-down;
position: relative;
overflow: hidden;
background-color: #f4f4f4;
`;

const InlineInnerContainer = styled.div`
display: table-cell;
width: 80%;
padding-top: 10px;
padding-left: 10px;

@media only screen and (max-width: 769px) {
  width: 100%;
  padding-left: 0;
}

@media only screen and (max-width: 480px) {
  text-align: center;
}
`;

const HorizontalDivider = styled.div`
height: 1px;
background-color: #d8d8d8  ;
width:100%
`;

const CardNav = styled.div`
display: flex;
cursor: pointer;
background-color: #ffffff;
padding: 25px;

@media only screen and (max-width: 480px) {
  display: block;
  padding: 20px;
}
`;

const InnerHeader = styled.div`
font-family: "museo-sans", san-serif;
font-size: 18px;
font-weight: 500;
font-stretch: normal;
font-style: normal;
line-height: 1.33;
letter-spacing: normal;
color: #003863;
`;

const Content = styled.div`
font-size: 14px;
font-weight: 500;
font-stretch: normal;
font-style: normal;
line-height: 1.29;
letter-spacing: normal;
color: #474b55;
@media only screen and (max-width: 480px) {
  margin-top: 10px;
}
`;

const StatusImg = styled.img`
width: 24px;
height: 24px;
position: relative;
overflow: hidden;
`;

const Name = styled.div`
margin-left: 20px;
margin-right: 20px;
font-size: 18px;
font-weight: 500;
font-stretch: normal;
font-style: normal;
line-height: 1.33;
letter-spacing: normal;
color: #474b55;
flex: 1;
color: #003863;
`;

const Main = styled.div`
display: flex;
padding: 1rem;
align-items: center;
`;

const Assessment = styled.div`
font-size: 14px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: normal;
letter-spacing: normal;
text-align: right;
color: #008bbf;
right: 15px;
cursor: pointer;
@media only screen and (min-width: 481px) and (max-width: 769px) {
  right: 115px;
}
`;

const SubText = styled.div`
font-size: 14px;
font-weight: normal;
font-stretch: normal;
font-style: italic;
line-height: 1.14;
letter-spacing: normal;
color: #474b55;
margin: 24px 0px;
@media only screen and (max-width: 480px) {
  margin: 24px 15px;
}
`;

const SubHeader = styled.div`
font-size: 18px;
font-weight: 500;
font-stretch: normal;
font-style: normal;
line-height: 1.33;
letter-spacing: normal;
color: #003863;
@media only screen and (max-width: 480px) {
  margin: 0 15px;
}
`;

const Browse = styled.div`
font-size: 18px;
font-weight: 500;
font-stretch: normal;
font-style: normal;
line-height: 1.33;
letter-spacing: normal;
color: #003863;
margin: 45px 0 20px 0;
@media only screen and (max-width: 480px) {
  margin: 45px 15px 20px;
}
`;

const InputOuter = styled.div`
border-radius: 4px;
border: solid 1px #a8abac;
background-color: #ffffff;
display:flex;
height: 40px;
margin: 20px 0px;
max-width: 338px;
@media only screen and (max-width: 480px) {
  margin: 0 15px;
}
`;

const MapImg = styled.img`
width: 16px;
height: 16px;
padding: 10px;
`;

const InputBox = styled.input`
background-color: #ffffff;
height: 38px;
border: none;
font-size: 16px;
font-weight: 300;
font-stretch: normal;
font-style: normal;
line-height: 1.5;
letter-spacing: normal;
color: #474b55;
`;

const CardRow = styled.div`
display: flex;
margin-bottom: 15px;
@media only screen and (max-width: 480px) {
  margin: 0 15px 15px;
}
`;

const Card = styled.div`
padding: 16px 8px 26px;
border-radius: 4px;
box-shadow: 0 2px 8px 0 #d8d8d8;
background-color: #ffffff;
width: 33%;
${props => !props.noMargin && 'margin-left: 15px'};
@media only screen and (max-width: 480px) {
  width: 45%;
}
`;

const CardImg = styled.img`
width: 32px;
height: 32px;
display: block;
margin-left: auto;
margin-right: auto;
`;

const Text = styled.div`
font-size: 14px;
font-weight: 500;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #474b55;
margin-top: 10px;
`;

const ShowMore = styled.div`
font-size: 14px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: normal;
letter-spacing: normal;
text-align: center;
color: #008bbf;
cursor: pointer;
`;

const Complete = styled.div`
padding: 4px 6px;
background-color: #529535;
font-size: 12px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: 1.5px;
text-align: center;
color: white;
border-radius: 4px;
right: 15px;
/* position: absolute; */
@media only screen and (min-width: 481px) and (max-width: 769px) {
  right: 115px;
}
`;

const HRAWrapper = styled.div`
`;

const SpinnerWrapper = styled.div`
  text-align: center;
  width: 100%;
`;

export default MyHealthPage;
