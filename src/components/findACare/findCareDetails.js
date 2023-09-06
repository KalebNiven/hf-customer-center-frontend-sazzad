import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { requestPcpDetails,requestUpdatedPCPID ,requestResetPcpDetails, requestCustomerInfo} from '../../store/actions/index';
import { useQualtrics , qualtricsAction} from '../../hooks/useQualtrics';
import Spinner from "../common/spinner";
import styled from "styled-components";
import moment from "moment"; 
import GlobalError from "../common/globalErrors/globalErrors";
import Cookies from 'js-cookie';
import { requestPCPDetails } from "../../store/actions/index";
import { Wrapper } from "./findCarePCP";

const FindCareDetails = (props) => {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const updateStatus = useSelector((state) => state.pcpDetails.pcpDetails);
    const resetStatus = useSelector((state) => state.pcpDetails.stateStatus);
    const [callbackState, setCallbackState] = useState();
    const customerInfo = useSelector((state) => state.customerInfo.data);
    const changePcpLoading = useSelector((state) => state.pcpDetails.loading);
    const PcpStatusFlag = useSelector((state) => state.pcpStatus.pcpStatus);
    const { MIX_REACT_APP_PROVIDER_API_KEY } = process.env;
    const SUCCESS = "Primary Care Provider has been changed";
    const BUS_FAILURE = "Changes to your Primary Care Provider can only be made every 48 hours.";
    const SYS_FAILURE = "Unable to process request, Please Try again later ";
    const dependents = customerInfo.dependents || []
    const jwt_token = customerInfo.id_token 
    const [isGlobalError,setGlobalError] = useState(false);
    const pcp = useSelector((state) => state.pcp);
    const [pcpinfo, setPcpInfo] = useState();

    const getEffectiveDates = (memberId) =>{  
        if (dependents.length === 0){ 
            return  moment(customerInfo.membershipEffectiveDate).format('MM-DD-YYYY')
        }
        else {
            for(var i =0; i<=dependents.length;i++){
            if(memberId === dependents[i].memberId){  
                return moment(dependents[i].MembershipEffectiveDate).format('MM-DD-YYYY') 
            } 
            if(memberId === customerInfo.memberId){
                return  moment(customerInfo.membershipEffectiveDate).format('MM-DD-YYYY')
            }
        }
    }
    }

    const handleChangePCP = (memberId, pcpId, callback) => { 
        if (PcpStatusFlag === true) {
            setCallbackState(() => callback) 
            const pcpDetails = {
                memberId: memberId,
                effectiveDate:  getEffectiveDates(memberId),
                pcpId: pcpId,
                csrf: customerInfo.csrf,
            }
            dispatch(requestPcpDetails(pcpDetails))
            setPcpInfo(pcpDetails)
        }
        else {
            callback("error", BUS_FAILURE)
        }
    }

    useQualtrics(qualtricsAction.CHANGE_PCP)

    useEffect(() => {
        if(customerInfo.customerId && customerInfo.membershipStatus === "active"){
            dispatch(requestPCPDetails(customerInfo.memberId, customerInfo.membershipEffectiveDate));
        }
      }, []);
    
    useEffect(() => {
        if (callbackState && (updateStatus === "Success" || updateStatus === undefined || (!!updateStatus) )) {

            if(updateStatus === "Success") {
                callbackState("success", SUCCESS)
                dispatch(requestPCPDetails(customerInfo.memberId, customerInfo.membershipEffectiveDate));
                updateCustomerInfo(pcpinfo.memberId, pcpinfo.pcpId)
                Cookies.set('ChangeYourPCP','true',{expires:1}) 
                dispatch(requestResetPcpDetails())
            } else  {
                if(resetStatus !=="Reset"){
                    callbackState("error", SYS_FAILURE)
                }
            }
        }
    }, [updateStatus]);
    
    const updateCustomerInfo= (memberId, pcpId) => {
        customerInfo.hohPlans.map((hoh, index) => {
     
            if (hoh.MemberId === memberId) { 
                const customerInfoUpdatedPcp = { ...customerInfo };
                customerInfoUpdatedPcp.hohPlans[index].PcpId = pcpId;
                dispatch(requestUpdatedPCPID(customerInfoUpdatedPcp));
            } else {
                customerInfo.dependents.map((dependent, index) => {
                    if (dependent.memberId === memberId) { 
                        const customerInfoUpdatedPcp = { ...customerInfo };
                        customerInfoUpdatedPcp.dependents[index].pcpId = pcpId;
                        dispatch(
                            requestUpdatedPCPID(customerInfoUpdatedPcp)
                        );
                    }
                });
            }
        });
    }

    const handleBackClicked = () => {
        history.push({
            pathname: "/search",
        })
    };

    const getMountProps = (result) => {
        const dependentsObj = customerInfo?.dependents.map(dep => {
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

        const memberDetailsObj = [
            ...hohPlans,
            ...dependentsObj
        ];
        
        if(customerInfo.accountStatus !=="NON-MEMBER" ){
        const mountProps = {
            parentElement: "#findcareDetailsWrapper",
            widget: "DETAILS",
            memberId: customerInfo.memberId,
            channel: "customer-center",
            memberDetails: memberDetailsObj,
            token: jwt_token,
            apiKey: MIX_REACT_APP_PROVIDER_API_KEY,
            locationId: result,
            lang: customerInfo.language || "en",
            onOtherLocClicked: handleOtherLocClicked,
            onBackClicked: handleBackClicked,
            onMakePCP: () => {},
            onPcpUpdateComplete: () => {
                dispatch(requestCustomerInfo()); 
            }
        }
        return mountProps
    }
else{
    setGlobalError(true);
}}

    const handleOtherLocClicked = (result) => {
        ProviderDirectoryWidget.unmount(getMountProps(location.result).widget);
        ProviderDirectoryWidget.mount(getMountProps(result));
    };
    /** Adding Widget script for provider details and Mounting the widget on page load */
    useEffect(() => {
        if(!location.result) {
            history.push('/search')
        }
        
    if(pcp.pcpLoading) return;
        if (customerInfo.memberId) {
            const mProps = getMountProps(location.result);
            try {
                ProviderDirectoryWidget.mount(mProps);
            } catch (e) {
                ProviderDirectoryWidget.unmount(mProps.widget);
                ProviderDirectoryWidget.mount(mProps);
            }
        }
    }, [customerInfo, location.result, pcp]);

    if (pcp.pcpLoading) return  <Wrapper><Spinner /></Wrapper>

    return (
        <>
            <div id="findcareDetailsWrapper" />
            {changePcpLoading && <SpinnerContainer><Spinner /></SpinnerContainer>}
            {isGlobalError && <GlobalError/>}
        </>
    );
};

export default FindCareDetails;

const SpinnerContainer = styled.div`
position: fixed;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
background-color: rgba(0,42,74, 0.72);
padding-top: calc(50vh - 50px);
`;