import React, { useEffect, useState } from "react";
import styled from "styled-components";
import moment from 'moment'
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { requestPcpHousehold } from '../../store/actions'; 
import GlobalError from "../common/globalErrors/globalErrors";
import Spinner from "../common/spinner";
import useLogError from "../../hooks/useLogError";

const FindCare = (props) => {
  const { MIX_REACT_APP_PROVIDER_API_KEY } = process.env;
  const history = useHistory();
  const dispatch = useDispatch();
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const pcpHousehold = useSelector(state => state.pcpHousehold);
  const { logError } = useLogError();

  useEffect(() => {
    if(pcpHousehold.data) return;
    dispatch(requestPcpHousehold())
  }, [])
  
  const [isGlobalError,setGlobalError] = useState(false);  

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

  const handleMemberChanged = (id, details) => {
    sessionStorage.setItem("currentMemberId", id)
  };
  
  useEffect(() => { 
    if(pcpHousehold.loading || !pcpHousehold.data) return;

    const dependents = customerInfo?.dependents
    .filter(dep => dep.Status === 'active')
    .map(dep => {
      return {
        memberId: dep.memberId, 
        age: dep.Age,
        benefitPackage: dep.benefitPackage,
        groupNumber: dep.groupNumber,
        year: dep.year,
        firstName: dep.firstName,
        lastName: dep.lastName,
        pcpId: pcpHousehold?.data?.dependents[dep?.memberId].id,
        disablePcpUpdate: dep.Status === "active" ? false : true,
        membershipEffectiveDate: moment(dep.MembershipEffectiveDate).format('MM-DD-YYYY')
      }
    }) || [];

    const hohPlans = customerInfo?.hohPlans
    .filter(plan => plan.MembershipStatus === 'active')
    .map(plan => {
      return {
        memberId: plan.MemberId, 
        age: plan.age,
        benefitPackage: plan.BenefitPackage,
        groupNumber: plan.GroupNumber,
        year: plan.memberYear,  
        firstName: plan.FirstName,
        lastName: plan.LastName,
        pcpId: pcpHousehold?.data?.hohPlans[plan?.MemberId]?.id,
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
      token: customerInfo.id_token,
      apiKey: MIX_REACT_APP_PROVIDER_API_KEY,
      onSearchClicked: handleSearchClicked,
      onMemberChanged: handleMemberChanged,
      onResultClicked: handleResultClicked,
    };

    if (customerInfo.memberId && dependents) {
      try {
        const currentMemberId = sessionStorage.getItem("currentMemberId")
        sessionStorage.setItem("currentMemberId", currentMemberId ? currentMemberId : customerInfo.memberId)

        ProviderDirectoryWidget.mount(mountProps);
      } catch (error) {
        (async () => {
          try {
              await logError(error);
          } catch (err) {
              console.error('Error caught: ', err.message);
          }
        })()
        try {
          ProviderDirectoryWidget.unmount(mountProps.widget);
          ProviderDirectoryWidget.mount(mountProps);
        } catch (error) {
          (async () => {
              try {
                  await logError(error);
              } catch (err) {
                  console.error('Error caught: ', err.message);
              }
          })()
        }
      }
    }}
    else{
      setGlobalError(true);
    }

    () => {
      if(ProviderDirectoryWidget.isMounted()) {
          ProviderDirectoryWidget.unmount(mountProps.widget);
      }
    }
  }, [customerInfo, pcpHousehold])

  if (pcpHousehold.loading) return  <Wrapper><Spinner /></Wrapper>

  return (
    <div>
      <Widget id="findCareHomeWrapper" />
      {isGlobalError && <GlobalError/>}
    </div>
  );
};

export default FindCare;

export const Widget = styled.div` 
`

export const Wrapper = styled.div`
    height: 100%;
`;