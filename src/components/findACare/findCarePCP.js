import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { requestSelectedMember } from "../../store/actions";
import { requestPCPDetails } from "../../store/actions/index";
import Spinner from "../common/spinner";
import styled from "styled-components";

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
                }));
                return dependents;
            }
            return [];
        };

        const memberDependents = custDependents();
        const memberDetails = [
            {
                memberId: customerInfo.memberId,
                age: customerInfo.age,
                benefitPackage: customerInfo.benefitPackage,
                groupNumber: customerInfo.groupNumber,
                year: customerInfo.memberYear,
                firstName: customerInfo.firstName,
                lastName: customerInfo.lastName,
                pcpId:  getPcpIdFromHoh(customerInfo.memberId),
                disablePcpUpdate:
                    customerInfo.membershipStatus === "active" ? false : true,
            },
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
