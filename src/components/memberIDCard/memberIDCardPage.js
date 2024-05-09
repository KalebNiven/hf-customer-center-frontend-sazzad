import React, { useState, useEffect } from "react";
import Spinner from "../common/spinner";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { requestPhysicalIdCard } from '../../store/actions/index';
import { requestMailMemberIDCardStatus, requestCustomerDemographicsInfo } from '../../store/actions/index';
import { useHistory, useLocation } from "react-router-dom";
import { SHOW_MEMBER_ID_CARD } from "../../constants/splits";
import DependentBlock from '../common/dependentBlock'
import DigitalId from "./digitalId";
import PhysicalIdCard from './physicalIdCard'
import { FeatureTreatment } from "../../libs/featureFlags";
import { getFeatureFlagList } from "../../constants/splits";
import Toaster from "../common/toaster";
import { useAppContext } from "../../AppContext"
import { MainContentContainer } from "../common/styles";
import GlobalError from "../common/globalErrors/globalErrors";
import MailIdCard from "./mailIdCard";

const DUMMY_PACKAGES = [ "RK", "SU", "OC", "WC", "NY", "LI" ];
const MemberIDCardPage = (props) => {

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const physicalIdCard = useSelector((state) => state.physicalIdCard.idCard);
  const physicalIdCardLoading = useSelector((state) => state.physicalIdCard.loading);
  const digitalIdCardLoading = useSelector((state) => state.digitalIdCard.loading);
  const mailMemberIDCardStatus = useSelector((state) => state.correspondenceStatus);
  const submitMailMemberIDCardFormResponse = useSelector((state) => state.correspondence);
  const [renderNotification, setRenderNotification] = useState(false);
  const [isNonMemberHOH, setIsNonMemberHOH] = useState()

  const customerInfo = useSelector((state) => state.customerInfo);
  const customerDemographicsInfo = useSelector( (state) => state.customerDemographicsInfo.data);
  const [memberSelection, setMemberSelection] = useState({});

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

  const getHOH = (memberId) => {
    var planArr = customerInfo.data.hohPlans;
    var selectedPlan = null;
    planArr.forEach(plan => {
      if (plan.memberId === memberId && plan.status === 'active') {
        selectedPlan = plan;
      }
    });
    return selectedPlan;
  };

  const getDependent = (memberId) => {
    var dependentsArr = customerInfo.data.dependents;
    var selectedDependent = null;
    dependentsArr.forEach(dependent => {
      if (dependent.memberId === memberId && dependent.Status === 'active') {
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
      lastName: plan.LastName,
      groupNumber: plan.GroupNumber,
      lob: plan.LOBCode,
      benefitPackage: plan.BenefitPackage,
      relationshipCode: plan.RelationshipCode
    })
  })
  setPlanName("")
}
}

const checkNonMemberHOH = (companyCode, benefitPackage, relationshipCode) => {
  if(companyCode === '01' && DUMMY_PACKAGES.includes(benefitPackage)){
      return true;
  }
  else if(companyCode === '20' && relationshipCode === 'SELF'){
      return true;
  }
  else{
      return false;
  }
}

useEffect(() => {
  dispatch(requestCustomerDemographicsInfo(customerInfo.data.customerId));
}, []);

  // set default memberId on initial load
  useEffect(() => {
    if(planName != ""){
      checkSelectedDependent()
    }
    else {
      setMemberSelection({
        ...memberSelection,
        memberId: customerInfo.data.hohPlans[0]?.MemberId,
        planName: customerInfo.data.hohPlans[0]?.PlanName,
        membershipStatus: customerInfo.data.hohPlans[0]?.MembershipStatus,
        membershipEffectiveDate: customerInfo.data.hohPlans[0]?.MembershipEffectiveDate,
        membershipExpirationDate: customerInfo.data.hohPlans[0]?.MembershipExpirationDate,
        companyCode: customerInfo.data.hohPlans[0]?.CompanyNumber,
        lob: customerInfo.data.hohPlans[0]?.LOBCode,
        groupNumber: customerInfo.data.hohPlans[0]?.GroupNumber,
        benefitPackage: customerInfo.data.hohPlans[0]?.BenefitPackage,
        firstName: customerInfo.data.hohPlans[0]?.FirstName,
        lastName: customerInfo.data.hohPlans[0]?.LastName,
        relationshipCode: customerInfo.data.hohPlans[0]?.RelationshipCode
      })
    }

    if (customerInfo.data.hohPlans != undefined) {
      if (props.selectedMemberId) {
        var plan = getHOH(props.selectedMemberId);
        setMemberSelection({
          ...memberSelection,
          memberId: props.selectedMemberId,
          planName: plan.planName,
          membershipStatus: plan.Status,
          membershipEffectiveDate: plan.MembershipEffectiveDate,
          membershipExpirationDate: plan.MembershipExpirationDate,
          companyCode: plan.companyCode,
          lob: plan.LOBCode,
          groupNumber: plan.groupNumber,
          benefitPackage: plan.benefitPackage,
          firstName: plan.firstName,
          lastName: plan.lastName,
          relationshipCode: plan.relationshipCode
        })
      }
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
    setIsNonMemberHOH(checkNonMemberHOH(memberSelection.companyCode, memberSelection.benefitPackage, memberSelection.relationshipCode));
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
              (physicalIdCardLoading) ?
                <Container>
                  <ProgressWrapper>
                    <Spinner />
                  </ProgressWrapper>
                </Container> : (
                  physicalIdCard.length != 0  && !isNonMemberHOH?
                  <IDCardContainers>
                    <DigitalIdCardContainer> 
                      <DigitalId member={memberSelection} />
                    </DigitalIdCardContainer>
                    <PhysicalIdCardContainer>
                      <PhysicalIdCard memberId={memberSelection.memberId} />
                    </PhysicalIdCardContainer>
                    <MailIdCardContainer>
                      <MailIdCard memberSelection={memberSelection} />
                    </MailIdCardContainer>
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
      column-gap:2%;
      margin-top:24px;
      flex-wrap:wrap;
    `;

const DigitalIdCardContainer = styled.div`
  width:100%;
  margin-bottom:1.5rem;
`;

const PhysicalIdCardContainer = styled.div`
@media only screen and (max-width: 820px) {
  width:100%;
  max-width:100%;
  padding: 16px;
}
@media print {
  width:100%;
  max-width:100%;
}
  width:49%;
`;

const MailIdCardContainer = styled.div`
  @media only screen and (max-width: 820px) {
    width:100%;
    max-width:100%;
    padding: 16px;
  }
  @media print {
    width:100%;
    max-width:100%;
  }
    width:49%;
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const MemberIDCardPageContainer = styled(MainContentContainer)`
max-width: 1024px;
position: relative;
margin:auto; 
margin-bottom:1.5rem;
width:100%;
@media only screen and (min-width: 480px) and (max-width: 820px) {
  width:auto;
  margin-left:3rem;
  margin-right:3rem;
}
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
@media only screen  and (max-width: 820px) {
  max-width: 100%;
  margin-right: 6px;
}
  margin-left: 15px;
`;

export default MemberIDCardPage;
