import moment from 'moment'

export const getRecertificationDate = (companyCode, benefitPackage, renewalDate, dateformat = "MM/DD/YYYY", postfix = ' is') => {
    const isMedicaid = (companyCode, benefitPackage) => {
        switch(companyCode) {
        case '30':
            return ['LIP1'].includes(benefitPackage) ? true : false;
        case '34':
            return ['CC01', 'CC02'].includes(benefitPackage) ? true : false;
        case '01':
            return true;
        default:
            return false;
        }
    }
    // return isMedicaid(companyCode, benefitPackage) ? 'Medicaid' + ' is ' + moment(customerInfo.data.renewalDate).format("MM/DD/YYYY") : null;
    return `${isMedicaid(companyCode, benefitPackage) ? 'Medicaid' : ''} Renewal Date${postfix} ${moment(renewalDate).format(dateformat)}`;
}

export const isEligibleForRecertDate = (companyCode, benefitPackage, renewalDate) => {
    if(!renewalDate) return false;

    switch(companyCode) {
        case '30':
        return ['LIP1'].includes(benefitPackage) ? true : false;
        case '34':
        return true;
        case '01':
        return true;
        case '42':
        return ['EPS1', 'EPN1', 'EPS2', 'EPN2', 'EPS3', 'EPS4'].includes(benefitPackage) ? true : false;
        case '20':
        return true;
        default:
        return false;
    }
}
export const getSplitAttributesForHOHPlan = (customerInfoData,index) =>{
    let attributes = {
        customerId: customerInfoData.customerId,
        accountStatus: customerInfoData.accountStatus,
        memberId: customerInfoData.memberId,
        lob: customerInfoData.sessLobCode,
        membershipStatus:customerInfoData.membershipStatus,
        companyCode: customerInfoData.hohPlans[index].CompanyNumber ,
        benefitPackage: customerInfoData.hohPlans[index].BenefitPackage
      };
      return attributes;
}
