import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { MemberDropDownSelect, MemberDropDownSelectWrapper } from './styles';

const DependentBlock = ({ memberSelection, setMemberSelection, halfWidth, activeOnly}) => {

    const customerInfo = useSelector((state) => state.customerInfo);
    const { data: { dependents } } = customerInfo;

    const [memberships, setMemberships] = useState([]);

    useEffect(() => {
      if(!customerInfo.loading && customerInfo.data && customerInfo.data.firstName) {
        formatMemberDDList(customerInfo.data);
      }
    }, [customerInfo]);

    const formatNameCapitalize = (name = 'placeholder') => {
      name = name.toLowerCase();
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
  
    const formatMemberDDList = (data) => {
      var memberships = [];
      data.hohPlans.forEach(plan => {
        var hohplan = { label: formatNameCapitalize(plan.FirstName)+" "+formatNameCapitalize(plan.LastName), value: plan.MemberId, planName: formatNameCapitalize(plan.PlanName), membershipStatus: plan.MembershipStatus, membershipEffectiveDate: plan.MembershipEffectiveDate, membershipExpirationDate: plan.MembershipExpirationDate, companyCode: plan.CompanyCode, firstName: plan.FirstName, lastName: plan.LastName };
        if(!activeOnly){
          memberships.push(hohplan);
        }
        else if(hohplan.membershipStatus == "active"){
          memberships.push(hohplan);
        }
      });

      data.dependents.forEach(dependent => {
        var member = { label: formatNameCapitalize(dependent.firstName)+" "+formatNameCapitalize(dependent.lastName), value: dependent.memberId, planName: dependent.planName, membershipStatus: dependent.Status, membershipEffectiveDate: dependent.MembershipEffectiveDate, membershipExpirationDate: dependent.MembershipExpirationDate, companyCode: dependent.companyCode, firstName: dependent.firstName, lastName: dependent.lastName };
        if(!activeOnly){
          memberships.push(member);
        }
        else if(member.membershipStatus == "active"){
          memberships.push(member);
        }
      });
      setMemberships(memberships);
    }

    const handleMemberSelection = (memberInfo) => {
      const { planName, membershipStatus, membershipEffectiveDate, membershipExpirationDate, companyCode, firstName, lastName, value } = memberInfo;
      setMemberSelection({
        ...memberSelection,
        memberId: value,
        planName,
        membershipStatus,
        membershipEffectiveDate,
        membershipExpirationDate,
        companyCode,
        firstName,
        lastName
      });
    }

    return (
        <>
            { memberships && memberships.length > 1 && <MemberDropDownSelectWrapper halfWidth>
            <MemberDropDownSelect
              selected={{...memberSelection, label: formatNameCapitalize(memberSelection.firstName)+" "+formatNameCapitalize(memberSelection.lastName) }}
              values={memberships}
              onSelect={handleMemberSelection}
              errorMessage="Please select an option."
            />
          </MemberDropDownSelectWrapper> } 
        </>
    )
}

export default DependentBlock
