import React, { useState, useEffect } from "react";
import Spinner from "../common/spinner";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { requestPhysicalIdCard } from '../../store/actions/index';
import { requestMailMemberIDCardStatus } from '../../store/actions/index';
import { useHistory, useLocation } from "react-router-dom";
import { SHOW_MEMBER_ID_CARD } from "../../constants/splits";
import DependentBlock from '../common/dependentBlock'
import DigitalId from "./digitalId";
import PhysicalIdCard from './physicalIdCard'
import MailIdCardButton from './mailIdCardButton'
import MailMemberIDCardForm from './mailMemberIDCardForm'
import { FeatureTreatment, FeatureFactory } from "../../libs/featureFlags";
import { getFeatureFlagList } from "../../constants/splits";
import Toaster from "../common/toaster";
import { useAppContext } from "../../AppContext"
import { MainContentContainer } from "../common/styles";
import GlobalError from "../common/globalErrors/globalErrors";

const MemberIDCardPage = (props) => {

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const physicalIdCard = useSelector((state) => state.physicalIdCard.idCard);
  const physicalIdCardLoading = useSelector((state) => state.physicalIdCard.loading);
  const mailMemberIDCardStatus = useSelector((state) => state.correspondenceStatus);
  const submitMailMemberIDCardFormResponse = useSelector((state) => state.correspondence);
  const [renderNotification, setRenderNotification] = useState(false);

  const customerInfo = useSelector((state) => state.customerInfo);

  const [memberSelection, setMemberSelection] = useState({});
  const [renderIdCardForm, setRenderIdCardForm] = useState(false);

  const {planName,setPlanName} = useAppContext()
  const { MIX_SPLITIO_KEY } = process.env;
  const featureFlagList = getFeatureFlagList();
  const featureFlagOptions = {
    scheduler: { featuresRefreshRate: 300, metricsRefreshRate: 30 },
    sync: {
      splitFilters: [
        {
          type: "byName",
          values: featureFlagList,
        },
      ],
    },
  };

  const openForm = () => {
    setRenderIdCardForm(true);
  };

  const getDependent = (memberId) => {
    var dependentsArr = customerInfo.data.dependents;
    var selectedDependent = null;
    dependentsArr.forEach(dependent => {
      if (dependent.memberId === memberId) {
        selectedDependent = dependent;
      }
    });
    return selectedDependent;
  };

const  checkSelectedDependent  = () =>{
  let hohPlans = customerInfo.data.hohPlans;
  if(hohPlans != undefined){
    hohPlans.forEach(plan =>{
    setMemberSelection({
      ...memberSelection,
      memberId: plan.MemberId,
      planName: plan.PlanName,
      membershipStatus: plan.MembershipStatus,
      membershipEffectiveDate: plan.MembershipEffectiveDate,
      membershipExpirationDate: plan.MembershipExpirationDate,
      companyCode: plan.CompanyNumber,
      firstName: plan.FirstName,
      lastName: plan.LastName
    })
  })
  setPlanName("")
}
}
  // set default memberId on initial load
  useEffect(() => {
    if(planName != ""){
      checkSelectedDependent()
    }
    else {
      setMemberSelection({
        ...memberSelection,
        memberId: customerInfo.data.memberId,
        planName: customerInfo.data.planName,
        membershipStatus: customerInfo.data.membershipStatus,
        membershipEffectiveDate: customerInfo.data.membershipEffectiveDate,
        membershipExpirationDate: customerInfo.data.membershipExpirationDate,
        companyCode: customerInfo.data.companyCode,
        lob: customerInfo.data.sessLobCode,
        groupNumber: customerInfo.data.groupNumber,
        benefitPackage: customerInfo.data.benefitPackage,
        firstName: customerInfo.data.firstName,
        lastName: customerInfo.data.lastName
      })
    }
   
    if (customerInfo.data.dependents != undefined) {
      if (props.selectedMemberId) {
        var dependent = getDependent(props.selectedMemberId);
        setMemberSelection({
          ...memberSelection,
          memberId: props.selectedMemberId,
          planName: dependent.planName,
          membershipStatus: dependent.Status,
          membershipEffectiveDate: dependent.MembershipEffectiveDate,
          membershipExpirationDate: dependent.MembershipExpirationDate,
          companyCode: dependent.companyCode,
          lob: dependent.LobCode,
          groupNumber: dependent.groupNumber,
          benefitPackage: dependent.benefitPackage,
          firstName: dependent.firstName,
          lastName: dependent.lastName
        })
      }
    }
  }, [customerInfo]);

  useEffect(() => { //Do we need this... or can we just listen on location change in the above?
    if(location.state){
    var dependent = getDependent(location.state.dependentMemberId);  
        setMemberSelection({
          ...memberSelection,
          memberId: location.state.dependentMemberId,
          planName: dependent.planName,
          membershipStatus: dependent.Status,
          membershipEffectiveDate: dependent.MembershipEffectiveDate,
          membershipExpirationDate: dependent.MembershipExpirationDate,
          companyCode: dependent.companyCode,
          lob: dependent.LobCode,
          groupNumber: dependent.groupNumber,
          benefitPackage: dependent.benefitPackage,
          firstName: dependent.firstName,
          lastName: dependent.lastName
        })
      }
 }, [location]);

  useEffect(() => {
    if(typeof memberSelection.memberId !== "undefined"){
      dispatch(requestPhysicalIdCard(memberSelection.memberId));
    }
    sessionStorage.setItem("longLoad", false)
  }, []);

  useEffect(() => {
    if(typeof memberSelection.memberId !== "undefined"){
      dispatch(requestPhysicalIdCard(memberSelection.memberId));
      dispatch(requestMailMemberIDCardStatus(memberSelection.memberId));
    }
  }, [memberSelection]);

  useEffect(() => {
    if(typeof memberSelection.memberId !== "undefined"){
      dispatch(requestMailMemberIDCardStatus(memberSelection.memberId));
    }
  }, [submitMailMemberIDCardFormResponse]);

  const splitAttributes = {
    lob: customerInfo.data.sessLobCode,
    companyCode: customerInfo.data.companyCode,
    benefitPackage: customerInfo.data.benefitPackage,
    membershipStatus: customerInfo.data.membershipStatus,
    accountStatus: customerInfo.data.accountStatus

  }
  const backImg = physicalIdCard[memberSelection.memberId] && physicalIdCard[memberSelection.memberId].physicalIdCard.backImage
  return (
    <MemberIDCardPageContainer>
      <FeatureTreatment
        treatmentName={SHOW_MEMBER_ID_CARD}
        onLoad={() => { }}
        onTimedout={() => { }}
        attributes={splitAttributes}
      >
        {renderNotification &&
          <Toaster unmountMe={() => setRenderNotification(false)} timeout={5000} notificationText={"An example notification"} notificationType={"success"}/>
        }
        <IDCardTitle className="no-print">Member ID Card</IDCardTitle>
        <IDCardText className="no-print">This section contains all necessary information for your membership that may not exist on your physical ID card.</IDCardText>
        {memberSelection.memberId != null && memberSelection.memberId != undefined &&
          <>
            <DependentBlockWrapper className="no-print">{<DependentBlock memberSelection={memberSelection} setMemberSelection={setMemberSelection} halfWidth activeOnly={true} activeDepsOnly={true}/>}
            </DependentBlockWrapper>
            {
              physicalIdCardLoading ?
                <Container>
                  <ProgressWrapper>
                    <Spinner />
                  </ProgressWrapper>
                </Container> : (
                  physicalIdCard.length != 0 ?
                  <IDCardContainers>
                    <DigitalIdCardContainer> 
                      <DigitalId member={memberSelection} />
                    </DigitalIdCardContainer>
                    <PhysicalIdCardContainer>
                      <PhysicalIdCard memberId={memberSelection.memberId} />
                      <MailIdCardButton handleClick={openForm} disableBtn={typeof(mailMemberIDCardStatus.data) !== "undefined" && mailMemberIDCardStatus.data !== null && mailMemberIDCardStatus.data.status == true ? true : false} memberId={memberSelection.memberId} />
                      {(typeof(mailMemberIDCardStatus.data) !== "undefined" && mailMemberIDCardStatus.data !== null && mailMemberIDCardStatus.data.length != 0 ? true : false) ?
                      <RecentRequestText className="no-print">A physical Member ID Card was recently requested. A new request can be made after 14 days.</RecentRequestText>
                      :
                      null}
                    </PhysicalIdCardContainer>
                    <MailMemberIDCardForm showForm={renderIdCardForm} member={memberSelection} unmountMe={() => setRenderIdCardForm(false)}/>
                  </IDCardContainers>
                  : (
                    null
                  )
                )}
          </>

        }
      </FeatureTreatment>
      <FeatureTreatment
      treatmentName={SHOW_MEMBER_ID_CARD}
      onLoad={() => { }}
      onTimedout={() => { }}
      attributes={splitAttributes}
      invertBehavior
      >
      <GlobalError/>
      </FeatureTreatment>
    </MemberIDCardPageContainer>
  );
};
const IDCardContainers = styled.div`
      display:flex;
      column-gap:10%;
      margin-top:24px;
      flex-wrap:wrap;
    `;

const DigitalIdCardContainer = styled.div`
@media only screen and (max-width: 768px) {
  width:100%;
}
  width:50%;
`;

const PhysicalIdCardContainer = styled.div`
@media only screen and (max-width: 768px) {
  width:100%;
  max-width:100%;
  padding: 16px;
}
@media print {
  width:100%;
  max-width:100%;
}
  width:40%;
  max-width:290px;
`;


const MemberIDCardPageContainer = styled(MainContentContainer)`
max-width: 1024px;
position: relative;
margin:auto; 
margin-bottom:1.5rem;
width:100%;
`;

const Container = styled.div`
* {
  box-sizing: content-box;
}
padding-top: 2rem;
overflow:hidden;
background-color:#f4f4f4;
height: 100%;
`;

const IDCardTitle = styled.div`
@media only screen and (min-width: 769px) {
}
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  padding-top: 2rem;
  letter-spacing: normal;
  color:#003863;
  margin: 0px 15px;
  margin-bottom: 1.5rem
`;

const IDCardText = styled.div`
@media only screen and (min-width: 769px) {
}
  font-size: 16px;
  color: #474B55;
  line-height: 25px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  margin: 8px 16px 16px;
`;

const RecentRequestText = styled.p`
  font-size: 14px;
  color: #474b55;
  line-height: 1.43;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
`;

const ProgressWrapper = styled.div`
  width:100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const DependentBlockWrapper = styled.div`
max-width: 48%;
@media only screen  and (max-width: 768px) {
  max-width: 100%;
  margin-right: 6px;
}
  margin-left: 15px;
`;

export default MemberIDCardPage;
