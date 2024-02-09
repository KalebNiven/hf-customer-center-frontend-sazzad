import React, { useEffect, useState } from "react";
import styled from "styled-components";
import moment from "moment"; 
import { useLocation } from "react-router";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { requestPcpHousehold } from '../../store/actions/index';
import GlobalError from "../common/globalErrors/globalErrors";
import Spinner from "../common/spinner"; 
import { useSurveyContext } from "../../context/surveyContext";
import Cookies from "js-cookie";

const DETAILS = "DETAILS";

const FindCareDetails = (props) => {
    const { digitalSurveyWidget, triggerDigitalSurveyByEventName, DIGITAL_SURVEY_EVENTS } = useSurveyContext();
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const customerInfo = useSelector((state) => state.customerInfo.data);
    const { MIX_REACT_APP_PROVIDER_API_KEY } = process.env;
    const [isGlobalError,setGlobalError] = useState(false);
    const language = localStorage.getItem('selectedLang');

    const pcpHousehold = useSelector(state => state.pcpHousehold)

    useEffect(() => {
        if(pcpHousehold.data) return;
        dispatch(requestPcpHousehold())
    }, [])

    const handleBackClicked = () => {
        history.push({
            pathname: "/search",
        })
    };

    const getMountProps = (result) => {
        const dependentsObj = customerInfo?.dependents
        .map(dep => {
            return {
              memberId: dep.memberId, 
              age: dep.Age,
              benefitPackage: dep.benefitPackage,
              groupNumber: dep.groupNumber,
              year: dep.year,
              firstName: dep.firstName,
              lastName: dep.lastName,
              pcpId: pcpHousehold?.data?.dependents[dep?.memberId] ?? null,
              disablePcpUpdate: dep.Status === "active" ? false : true,
              membershipEffectiveDate: moment(dep.MembershipEffectiveDate).format('MM-DD-YYYY')
            }
          }) || [];

        const hohPlans = customerInfo?.hohPlans
        .map(plan => {
            return {
              memberId: plan.MemberId, 
              age: plan.age,
              benefitPackage: plan.BenefitPackage,
              groupNumber: plan.GroupNumber,
              year: plan.memberYear,
              firstName: plan.FirstName,
              lastName: plan.LastName,
              pcpId: pcpHousehold?.data?.hohPlans[plan?.MemberId]?.id ?? null,
              disablePcpUpdate: plan.MembershipStatus === "active" ? false : true,
              membershipEffectiveDate: moment(plan.MembershipEffectiveDate).format('MM-DD-YYYY')
            }
          }) || [];

        const memberDetailsObj = [
            ...hohPlans,
            ...dependentsObj
        ];
        
        if(customerInfo.accountStatus !== "NON-MEMBER") {
            const mountProps = {
                parentElement: "#findcareDetailsWrapper",
                widget: "DETAILS",
                memberId: customerInfo.memberId,
                channel: "customer-center",
                memberDetails: memberDetailsObj,
                token: customerInfo.id_token,
                apiKey: MIX_REACT_APP_PROVIDER_API_KEY,
                locationId: result,
                lang: language || "en",
                onOtherLocClicked: handleOtherLocClicked,
                onBackClicked: handleBackClicked,
                onMakePCP: () => {},
                onPcpUpdateComplete: () => {
                  Cookies.set('ChangeYourPCP','true',{expires:1}) 
                  if(digitalSurveyWidget) triggerDigitalSurveyByEventName(digitalSurveyWidget, DIGITAL_SURVEY_EVENTS.PCP_UPDATE)
                  dispatch(requestPcpHousehold()); 
                }
            }
            return mountProps
        } else {
            setGlobalError(true);
        }
    }

    const handleOtherLocClicked = (result) => {
        ProviderDirectoryWidget.unmount(getMountProps(location.result).widget);
        ProviderDirectoryWidget.mount(getMountProps(result));
      };
    
    /** Adding Widget script for provider details and Mounting the widget on page load */
    useEffect(() => {
        if(pcpHousehold.loading || !pcpHousehold.data) return;

        if(!location.result) {
            history.push('/search')
        }
            
        if (
            customerInfo.memberId &&
            ProviderDirectoryWidget
          ) {
            const mProps = getMountProps(location.result);
            if (!ProviderDirectoryWidget.isMounted(DETAILS)) {
              ProviderDirectoryWidget.mount(mProps);
            }
          }

          return () => {
            if (ProviderDirectoryWidget.isMounted(DETAILS)) {
                    ProviderDirectoryWidget.unmount(DETAILS);
            }
          }
    }, [customerInfo, location.result, pcpHousehold, digitalSurveyWidget]);

    // useEffect(() => () => {
    //     if (ProviderDirectoryWidget.isMounted(DETAILS)) {
    //       ProviderDirectoryWidget.unmount(DETAILS);
    //     }
    //   });

    if (pcpHousehold.loading) return  <Wrapper><Spinner /></Wrapper>

    return (
        <>
            <div id="findcareDetailsWrapper"></div>
            {isGlobalError && <GlobalError/>}
        </>
    );
};

export default FindCareDetails;

export const Wrapper = styled.div`
    height: 100%;
`;