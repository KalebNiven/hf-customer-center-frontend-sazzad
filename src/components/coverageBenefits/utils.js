import React from 'react';
import { CostData, DataBlock, SubCategory } from './styles';

export const getFormattedCopay = ({ isPercent, total, coinsurance, hasAdmission = null, hasDeductible = null, hasFirst3Visits = null }) => {
    if(hasFirst3Visits) {
        return <CostData>
        {!isPercent && "$"}{total}{isPercent && "%"} {coinsurance ? "coinsurance" : "copay"}
        {  hasFirst3Visits &&
            <DataBlock>
                <SubCategory>Not subject to deductible for first 3 visits</SubCategory>
            </DataBlock> }
        </CostData>;
    }

    return <CostData>
        {!isPercent && "$"}{total}{isPercent && "%"} {coinsurance ? "coinsurance" : "copay"}
        { hasAdmission &&
            <DataBlock>
                <SubCategory deductible>Per admission</SubCategory>
            </DataBlock> }
        { hasDeductible &&
            <DataBlock>
                <SubCategory deductible>After deductible</SubCategory>
            </DataBlock> }
        </CostData>;
}

export  const isActivePlan = (plan) => {
    if(plan.MembershipStatus){
      //HOH
      return plan.MembershipStatus !== 'inactive';
    }
    else {
      //Dependent
      plan.Status !== 'inactive';
    }
};