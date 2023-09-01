import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { requestPcpStatus, requestSelectedMember , requestPCPDetails} from '../../store/actions';
import GlobalError from "../common/globalErrors/globalErrors";
import Spinner from "../common/spinner";
import { Wrapper } from "./findCarePCP";
import moment from 'moment'

const FindCareSearch = (props) => {
  const { MIX_REACT_APP_PROVIDER_API_KEY } = process.env;
  const dispatch = useDispatch();
  const history = useHistory();
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const currentMemberId = useSelector((state) => state.selectedMember.dependentPcpId);
  const currentOrigMemberId = customerInfo.memberId;
  const jwt_token = customerInfo.id_token
  const [isGlobalError,setGlobalError] = useState(false); 
  const pcp = useSelector((state) => state.pcp);

  useEffect(() => {
    if(customerInfo.customerId && customerInfo.membershipStatus === "active"){
      dispatch(requestPCPDetails(customerInfo.memberId, customerInfo.membershipEffectiveDate));
    }
  }, []);


  useEffect(() => {
    // Here we will have to check if the member has dependencies, 
    // If the current member Id is null use id 
    if(currentMemberId === null){
      dispatch(requestPcpStatus(currentOrigMemberId)); 
    }else{
      dispatch(requestPcpStatus(currentMemberId)); 
    }
  }, [currentMemberId]);

  const handleResultClicked = (resultId) => {
    history.push({
      pathname: "/details",
      result: resultId,
    })
  };

  const handleMemberChanged = (id, details) => {
    dispatch(requestPcpStatus(id));
    dispatch(requestSelectedMember(id));
    sessionStorage.setItem("currentMemberId", id)
  };

  /** Adding Widget script for  provider search and Mounting the widget on page load */
  const memberDependents = customerInfo?.dependents.map(dep => {
    return {
      memberId: dep.memberId, 
      age: dep.Age,
      benefitPackage: dep.benefitPackage,
      groupNumber: dep.groupNumber,
      year: dep.year,
      firstName: dep.firstName,
      lastName: dep.lastName,
      pcpId: dep.pcpId,
      disablePcpUpdate: dep.Status === "active" ? false : true,
      membershipEffectiveDate: moment(dep.MembershipEffectiveDate).format('MM-DD-YYYY')
    }
  }) || [];

  const hohPlans = customerInfo?.hohPlans.map(plan => {
    return {
      memberId: plan.MemberId, 
      age: plan.age,
      benefitPackage: plan.BenefitPackage,
      groupNumber: plan.GroupNumber,
      year: plan.memberYear,
      firstName: plan.FirstName,
      lastName: plan.LastName,
      pcpId: plan.pcpId,
      disablePcpUpdate: plan.MembershipStatus === "active" ? false : true,
      membershipEffectiveDate: moment(plan.MembershipEffectiveDate).format('MM-DD-YYYY')
    }
  }) || [];

  
  useEffect(() => {
    if(pcp.pcpLoading) return;
    const memberDetails = [
      ...hohPlans,
      ...memberDependents
    ];

    if(customerInfo.accountStatus !=="NON-MEMBER"){
    const mountProps = {
      parentElement: "#findcareSearchWrapper",
      widget: "SEARCH",
      memberId: customerInfo.memberId,
      channel: "customer-center",
      companyCode: customerInfo.companyCode,
      lob: customerInfo.sessLobCode,
      zipcode: customerInfo.zipcode,
      planName: customerInfo.planName,
      benefitPackage: customerInfo.benefitPackage,
      groupNumber: customerInfo.groupNumber,
      year: customerInfo.memberYear,
      memberDetails: [...memberDetails],
      token: jwt_token,
      apiKey: MIX_REACT_APP_PROVIDER_API_KEY,
      lang: customerInfo.language || "en",
      pcpId: customerInfo.pcpId,
      onMemberChanged: handleMemberChanged,
      onResultClicked: handleResultClicked,
    };
    if (customerInfo.memberId) {
      try {
        ProviderDirectoryWidget.mount(mountProps);
      } catch (e) {
        ProviderDirectoryWidget.unmount(mountProps.widget);
        ProviderDirectoryWidget.mount(mountProps);
      }
    }
  }
  else{
    setGlobalError(true);
  }
  }, [customerInfo, pcp])

  if (pcp.pcpLoading) return  <Wrapper><Spinner /></Wrapper>

  return (
    <>
    <div id="findcareSearchWrapper" /> 
    {isGlobalError && <GlobalError/>}</>
  );
};

export default FindCareSearch;