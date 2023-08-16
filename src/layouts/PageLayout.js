import React, { useState, useEffect } from "react";
import { useClient } from "@splitsoftware/splitio-react";
import { useSelector } from "react-redux";
import PermissionDenied from "../components/common/PermissionDenied";
import { getSplitAttributesForHOHPlan } from "../utils/misc";

const PageLayout = ({ children, splitFeatureName, ignoreSplit }) => {
    if(ignoreSplit) return children;

    const customerInfo = useSelector((state) => state.customerInfo.data);
    const [denyPermission,setDenyPermission] = useState(true)
    const splitHookClient = useClient();
    const [treatment,setTreatment] = useState("")
    const customerInfoData = {
        ...customerInfo,
        companyCode: customerInfo?.hohPlans?.map(plan => plan.CompanyNumber),              
        benefitPackage: customerInfo?.hohPlans?.map(plan => plan.BenefitPackage)
        // ! todo: map dependents?...
    }
    useEffect(() => {
        customerInfoData.companyCode.map((value, index) =>{ 
          let enableTreatment = splitHookClient.getTreatmentWithConfig( splitFeatureName, getSplitAttributesForHOHPlan(customerInfoData, index)  ); 
          enableTreatment.treatment === "on" ? setDenyPermission(false) : setTreatment(enableTreatment.treatment)
      })
    });

    switch(denyPermission) {
        case true:
            if(treatment === "off") { return <PermissionDenied/>} 
        case false:
            return children;
        case "control":
            return <></>;
        default:
            return <></>;
    }
}

export default PageLayout
