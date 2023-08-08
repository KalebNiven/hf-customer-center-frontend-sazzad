import React from 'react'
import { useClient } from "@splitsoftware/splitio-react";
import { useSelector } from "react-redux";
import PermissionDenied from "../components/common/PermissionDenied";

const PageLayout = ({ children, splitFeatureName, ignoreSplit }) => {
    if(ignoreSplit) return children;

    const customerInfo = useSelector((state) => state.customerInfo.data);
    const splitHookClient = useClient();
    const customerInfoData = {
        ...customerInfo,
        companyCode: customerInfo?.hohPlans?.map(plan => plan.CompanyNumber),              
        benefitPackage: customerInfo?.hohPlans?.map(plan => plan.BenefitPackage)
        // ! todo: map dependents?...
    }
    const feature = splitHookClient.getTreatmentWithConfig(splitFeatureName, customerInfoData);

    switch(feature.treatment) {
        case "on":
            return children;
        case "off":
            return <PermissionDenied />;
        case "control":
            return <></>;
        default:
            return <></>;
    }
}

export default PageLayout
