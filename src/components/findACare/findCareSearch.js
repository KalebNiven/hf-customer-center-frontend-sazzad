import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { requestPcpStatus, requestSelectedMember } from '../../store/actions';
import GlobalError from "../common/globalErrors/globalErrors";


const FindCareSearch = (props) => {
  const { MIX_REACT_APP_PROVIDER_API_KEY } = process.env;
  const dispatch = useDispatch();
  const history = useHistory();
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const currentMemberId = useSelector((state) => state.selectedMember.dependentPcpId);
  const currentOrigMemberId = customerInfo.memberId;
  const jwt_token = customerInfo.id_token
  const [isGlobalError,setGlobalError] = useState(false); 

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
  const custDependents = () => {
    if (customerInfo.dependents != null) {
      let dependents = customerInfo.dependents.map((info) => ({
        memberId: info.memberId,
        age: info.Age,
        benefitPackage: info.benefitPackage,
        groupNumber: info.groupNumber,
        year: info.year,
        firstName: info.firstName,
        lastName: info.lastName,
        pcpId: info.pcpId,
        disablePcpUpdate: info.Status === "active" ? false : true,
      }))
      return dependents
    }
    return []
  }

  const memberDependents = custDependents();
  const memberDetails = [
    {
      memberId: customerInfo.memberId,
      benefitPackage: customerInfo.benefitPackage,
      groupNumber: customerInfo.groupNumber,
      year: customerInfo.memberYear,
      firstName: customerInfo.firstName,
      age: customerInfo.age,
      lastName: customerInfo.lastName,
      pcpId: customerInfo.pcpId,
      disablePcpUpdate: customerInfo.membershipStatus === "active" ? false : true,
    },
    ...memberDependents
  ];
  useEffect(() => {
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
  }, [customerInfo])

  return (
    <>
    <div id="findcareSearchWrapper" /> 
    {isGlobalError && <GlobalError/>}</>
  );
};

export default FindCareSearch;