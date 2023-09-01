import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { requestSelectedMember } from "../../store/actions";
import { requestPCPDetails } from "../../store/actions/index";
import Spinner from "../common/spinner";
import styled from "styled-components";
import moment from 'moment'

const FindCarePCP = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const customerInfo = useSelector((state) => state.customerInfo.data);
    const { MIX_REACT_APP_PROVIDER_API_KEY } = process.env;
    const jwt_token = customerInfo.id_token;
    const [isGlobalError, setGlobalError] = useState(false);
    const pcp = useSelector((state) => state.pcp);

    useEffect(() => {
        // dispatch(requestCustomerInfo());
        sessionStorage.setItem("longLoad", false);

        if (
            customerInfo.customerId &&
            customerInfo.membershipStatus === "active"
        ) {
            dispatch(
                requestPCPDetails(
                    customerInfo.memberId,
                    customerInfo.membershipEffectiveDate
                )
            );
        }
    }, []);

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
        dispatch(requestSelectedMember(id));
        sessionStorage.setItem("currentMemberId", id);
    };

   const getPcpIdFromHoh = (memberId) => {
    let CurrentPcpId = "";
        customerInfo.hohPlans.map((hoh, index) => {
            if (hoh.MemberId === memberId) {
                CurrentPcpId =  customerInfo.hohPlans[index].pcpId;
            }
        });
        return CurrentPcpId;
    };

    useEffect(() => {
        if (pcp.pcpLoading) return;
        
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

        const memberDetails = [
            ...hohPlans,
            ...memberDependents,
        ];
        
        let mountProps;
        if (
            customerInfo.accountStatus !== "NON-MEMBER" &&
            customerInfo.membershipStatus !== "inactive"
        ) {
            mountProps = {
                parentElement: "#findcarePCPWrapper",
                widget: "PRIMARY_CARE_PROVIDER",
                memberId: customerInfo.memberId,
                channel: "customer-center",
                memberDetails: memberDetails,
                token: jwt_token,
                apiKey: MIX_REACT_APP_PROVIDER_API_KEY,
                lang: customerInfo.language || "en",
                onOtherLocClicked: handleOtherLocClicked,
                onMemberChanged: handleMemberChanged,
                onChangePCP: handleChangePCP,
            };
            if (customerInfo.memberId) {
                try {
                    const currentMemberId = sessionStorage.getItem(
                        "currentMemberId"
                    );
                    sessionStorage.setItem(
                        "currentMemberId",
                        currentMemberId
                            ? currentMemberId
                            : customerInfo.memberId
                    );
                    // dispatch(requestSelectedMember(currentMemberId));
                    try {
                        ProviderDirectoryWidget.invalidateStore();
                    } catch (e) {
                        console.log("Nothing to invalidate");
                    }
                    ProviderDirectoryWidget.mount(mountProps);
                } catch (e) {
                    ProviderDirectoryWidget.unmount(mountProps.widget);
                    ProviderDirectoryWidget.invalidateStore();
                    ProviderDirectoryWidget.mount(mountProps);
                }
            }
        } else {
            setGlobalError(true);
        }


    }, [pcp]);

    return (
        <Wrapper>
            {pcp.pcpLoading && <Spinner />}
            {!pcp.pcpLoading && (
                <>
                    <div id="findcarePCPWrapper" />
                </>
            )}
        </Wrapper>
    );
};

export const Wrapper = styled.div`
    height: 100%;
`;

export default FindCarePCP;
