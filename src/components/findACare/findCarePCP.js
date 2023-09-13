import React, { useState, useEffect } from "react";
import styled from "styled-components";
import moment from 'moment'
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { requestPcpHousehold } from "../../store/actions";
import Spinner from "../common/spinner";
import useLogError from "../../hooks/useLogError";

const FindCarePCP = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const customerInfo = useSelector((state) => state.customerInfo.data);
    const { MIX_REACT_APP_PROVIDER_API_KEY } = process.env;
    const [isGlobalError,setGlobalError] = useState(false);
    const { logError } = useLogError();

    const pcpHousehold = useSelector(state => state.pcpHousehold)
    useEffect(() => {
        if(pcpHousehold.data) return;
        dispatch(requestPcpHousehold())
    }, [])

    const handleChangePCP = () => {
        history.push({
            pathname: "/search",
        });
    };

    const handleOtherLocClicked = (result) => {
        history.push({
            pathname: "/details",
            result,
        });
    };

    const handleMemberChanged = (id, details) => {
        sessionStorage.setItem("currentMemberId", id);
    };

    useEffect(() => {
        if (pcpHousehold.loading || !pcpHousehold.data) return;
        
        const memberDependents = customerInfo?.dependents
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
            ...memberDependents,
        ];
        
        if(customerInfo.accountStatus !== "NON-MEMBER") {
            let mountProps = {
                parentElement: "#findcarePCPWrapper",
                widget: "PRIMARY_CARE_PROVIDER",
                memberId: customerInfo.memberId,
                channel: "customer-center",
                memberDetails: memberDetails,
                token: customerInfo.id_token,
                apiKey: MIX_REACT_APP_PROVIDER_API_KEY,
                lang: customerInfo.language || "en",
                onOtherLocClicked: handleOtherLocClicked,
                onMemberChanged: handleMemberChanged,
                onChangePCP: handleChangePCP,
            };
            if (customerInfo.memberId) {
                const currentMemberId = sessionStorage.getItem(
                    "currentMemberId"
                );
                sessionStorage.setItem(
                    "currentMemberId",
                    currentMemberId
                        ? currentMemberId
                        : customerInfo.memberId
                );

                try {
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
            }
        } else {
            setGlobalError(true);
        }

        () => {
            if(ProviderDirectoryWidget.isMounted()) {
                ProviderDirectoryWidget.unmount(mountProps.widget);
            }
        }
    }, [customerInfo, pcpHousehold]);

    if (pcpHousehold.loading) return  <Wrapper><Spinner /></Wrapper>

    return (
        <Wrapper>
            <div id="findcarePCPWrapper"></div>
            {isGlobalError && <GlobalError/>}
        </Wrapper>
    );
};

export default FindCarePCP;

export const Wrapper = styled.div`
    height: 100%;
`;
