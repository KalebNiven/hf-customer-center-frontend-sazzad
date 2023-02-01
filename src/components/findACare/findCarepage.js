import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { requestSelectedMember } from '../../store/actions'; 
import GlobalError from "../common/globalErrors/globalErrors";


const FindCare = (props) => {
  const { MIX_REACT_APP_PROVIDER_API_KEY } = process.env;
  const history = useHistory();
  const dispatch = useDispatch();
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const jwt_token = customerInfo.id_token
  
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
  const dependents = customerInfo.dependents || []
  const memberDetails = [
    {
      memberId: customerInfo.memberId, 
      age: customerInfo.age,
      benefitPackage: customerInfo.benefitPackage,
      groupNumber: customerInfo.groupNumber,
      year: customerInfo.memberYear,
      firstName: customerInfo.firstName,
      lastName: customerInfo.lastName,
      pcpId: customerInfo.pcpId,
      disablePcpUpdate: customerInfo.membershipStatus === "active" ? false : true,
    },
    ...dependents
  ];

  const handleMemberChanged = (id, details) => {
    dispatch(requestSelectedMember(id));
    sessionStorage.setItem("currentMemberId", id)
  };

  useEffect(() => { 
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
      lang: customerInfo.language,
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
  }, [jwt_token,customerInfo, dependents])


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
