import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { requestPCPDetails, requestSelectedMember } from '../../store/actions'; 
import GlobalError from "../common/globalErrors/globalErrors";
import Spinner from "../common/spinner";
import { Wrapper } from "./findCarePCP";
import moment from 'moment'


const FindCare = (props) => {
  const { MIX_REACT_APP_PROVIDER_API_KEY } = process.env;
  const history = useHistory();
  const dispatch = useDispatch();
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const jwt_token = customerInfo.id_token;
  const pcp = useSelector((state) => state.pcp);
  
  const [isGlobalError,setGlobalError] = useState(false);  
  useEffect(() => {
    if(jwt_token) {sessionStorage.setItem("longLoad", false)}
  }, []);

  const handleSearchClicked = () => {
    history.push({
      pathname: "/search",
    })
  }

  const handleResultClicked = (resultId) => {
    history.push({
      pathname: "/details",
      result: resultId,
    })
  };

  /** Adding Widget script for  provider search for care  and Mounting the widget on page load
   */

  const handleMemberChanged = (id, details) => {
    dispatch(requestSelectedMember(id));
    sessionStorage.setItem("currentMemberId", id)
  };


  useEffect(() => {
    if(customerInfo.customerId && customerInfo.membershipStatus === "active"){
      dispatch(requestPCPDetails(customerInfo.memberId, customerInfo.membershipEffectiveDate));
    }
  }, []);

  useEffect(() => { 
    if(pcp.pcpLoading) return;

    const dependents = customerInfo?.dependents.map(dep => {
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

    const memberDetails = [
      ...hohPlans,
      ...dependents
    ];
    
    if(customerInfo.accountStatus !=="NON-MEMBER"){
    const mountProps = {
      parentElement: "#findCareHomeWrapper",
      widget: "SEARCH_FOR_CARE",
      memberId: customerInfo.memberId,
      channel: "customer-center",
      companyCode: customerInfo.companyCode,
      lob: customerInfo.sessLobCode,
      zipcode: customerInfo.zipcode,
      benefitPackage: customerInfo.benefitPackage,
      year: customerInfo.memberYear,
      memberDetails: memberDetails,
      groupNumber: customerInfo.groupNumber,
      lang: customerInfo.language || "en",
      token: jwt_token,
      apiKey: MIX_REACT_APP_PROVIDER_API_KEY,
      onSearchClicked: handleSearchClicked,
      onMemberChanged: handleMemberChanged,
      onResultClicked: handleResultClicked,
    };

    if (customerInfo.memberId && dependents && jwt_token) {
      try {
        const currentMemberId = sessionStorage.getItem("currentMemberId")
        sessionStorage.setItem("currentMemberId", currentMemberId ? currentMemberId : customerInfo.memberId)
        dispatch(requestSelectedMember(currentMemberId));
        ProviderDirectoryWidget.mount(mountProps);
      } catch (e) {
        ProviderDirectoryWidget.unmount(mountProps.widget);
        ProviderDirectoryWidget.mount(mountProps);
      }
    }}
    else{
      setGlobalError(true);
    }
  }, [jwt_token,customerInfo, pcp])

  if (pcp.pcpLoading) return  <Wrapper><Spinner /></Wrapper>

  return (
    <div>
      <Widget id="findCareHomeWrapper" />
      {isGlobalError && <GlobalError/>}
    </div>
  );
};

export default FindCare;

const Widget = styled.div` 
`
