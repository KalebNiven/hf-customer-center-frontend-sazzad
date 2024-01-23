import React from 'react';
import { useClient } from "@splitsoftware/splitio-react";
import { useSelector } from "react-redux";

export const useSplitEval = () => {
    const customerInfo = useSelector((state) => state.customerInfo);
    const splitHookClient = useClient(customerInfo?.data?.customerId === null ? 'Anonymous' : customerInfo?.data?.customerId);
    
    /*  Takes split name and evaluates it against hohPlans list.
        If any of the plans match the split requirement - return true aka. show the feature. */
    const evaluateSplitByName = (splitFeatureName) => {
        if(!splitFeatureName) return false;

        let showFeature = false;
        customerInfo.data.hohPlans.forEach((plan) => {
            // ! Be careful changing this, it may affect other components. You better append to it rather than change.
            let splitAttributes = {
                memberId: plan?.MemberId,
                customerId: plan?.CustomerId,
                lob: plan?.LOBCode,
                companyCode: plan?.CompanyNumber,
                benefitPackage: plan?.BenefitPackage,
                membershipStatus: plan?.MembershipStatus,
                accountStatus: plan?.CustomerId ? "MEMBER" : "NON-MEMBER"
            };
            let { treatment } = splitHookClient.getTreatmentWithConfig(splitFeatureName, splitAttributes);
            showFeature = (showFeature || treatment === "on");
        if(splitFeatureName === "CustomerCenter_ShowHealthAssesmentSurvey_UserCard") console.log('CustomerCenter_ShowHealthAssesmentSurvey_UserCard', treatment)
        });

        return showFeature;
    }

    return { evaluateSplitByName }
}
