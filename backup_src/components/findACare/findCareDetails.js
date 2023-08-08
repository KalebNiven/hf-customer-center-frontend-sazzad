import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { requestPcpDetails } from '../../store/actions/index';
import { useQualtrics , qualtricsAction} from '../../hooks/useQualtrics';
import Spinner from "../common/spinner";
import styled from "styled-components";
import moment from "moment"; 
import GlobalError from "../common/globalErrors/globalErrors";
import Cookies from 'js-cookie';
import { requestPCPDetails } from "../../store/actions/index";

const FindCareDetails = (props) => {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const updateStatus = useSelector((state) => state.pcpDetails.pcpDetails);
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

    const memberDetails = [
        {
            memberId: customerInfo.memberId,
            age: customerInfo.age,
            benefitPackage: customerInfo.benefitPackage,
            MembershipEffectiveDate: moment(customerInfo.membershipEffectiveDate).format('YYYY-MM-DD'),
            groupNumber: customerInfo.groupNumber,
            year: customerInfo.memberYear,
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName,
            pcpId: customerInfo.pcpId,
            disablePcpUpdate : customerInfo.membershipStatus === "active" ? false: true
        },
        ...dependents
    ]

    const getEffectiveDates = (memberId) =>{
        const memberDetailsCopy = [...memberDetails]   
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
        const memberDetailsCopy = [...memberDetails] 
        if (PcpStatusFlag === true) {
            setCallbackState(() => callback) 
            const pcpDetails = {
                memberId: memberId,
                effectiveDate:  getEffectiveDates(memberId),
                pcpId: pcpId,
                csrf: customerInfo.csrf,
            }
            dispatch(requestPcpDetails(pcpDetails))
        }
        else {
            callback("error", BUS_FAILURE)
        }
    }

    useQualtrics(qualtricsAction.CHANGE_PCP)
    
    useEffect(() => {
        if (callbackState && (updateStatus === "Success" || updateStatus === undefined || (!!updateStatus) )) {

            if(updateStatus === "Success") {
                callbackState("success", SUCCESS)
                dispatch(requestPCPDetails(customerInfo.memberId, customerInfo.membershipEffectiveDate));
                Cookies.set('ChangeYourPCP','true',{expires:1}) 
            } else {
                callbackState("error", SYS_FAILURE)
            }
        }
    }, [updateStatus]);

    const handleBackClicked = () => {
        history.push({
            pathname: "/search",
        })
    };

    const getMountProps = (result) => {
        if(customerInfo.accountStatus !=="NON-MEMBER" ){
        const mountProps = {
            parentElement: "#findcareDetailsWrapper",
            widget: "DETAILS",
            memberId: customerInfo.memberId,
            channel: "customer-center",
            memberDetails: [...memberDetails],
            token: jwt_token,
            apiKey: MIX_REACT_APP_PROVIDER_API_KEY,
            locationId: result,
            lang: customerInfo.language || "en",
            onOtherLocClicked: handleOtherLocClicked,
            onBackClicked: handleBackClicked,
            onMakePCP: handleChangePCP,
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
        if (customerInfo.memberId) {
            try {
                ProviderDirectoryWidget.mount(getMountProps(location.result));
            } catch (e) {
                ProviderDirectoryWidget.unmount(getMountProps(location.result).widget);
                ProviderDirectoryWidget.mount(getMountProps(location.result));
            }
        }
    }, [customerInfo, location.result]);

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