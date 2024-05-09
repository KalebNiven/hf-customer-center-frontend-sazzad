import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MemberDropDownSelect, MemberDropDownSelectWrapper } from "./styles";
import { AnalyticsTrack } from "../common/segment/analytics";
import {
  ANALYTICS_TRACK_TYPE,
  ANALYTICS_TRACK_CATEGORY,
} from "../../constants/segment";
import { isActivePlan } from "./utils";

const DependentBlock = ({
  memberSelection,
  setMemberSelection,
  halfWidth,
  displayInactiveMembers = true,
}) => {
  const customerInfo = useSelector((state) => state.customerInfo);
  const {
    data: { dependents, hohPlans },
  } = customerInfo;

  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (
      !customerInfo.loading &&
      customerInfo.data &&
      customerInfo.data.firstName
    ) {
      formatMemberDDList(customerInfo.data);
    }
  }, [customerInfo]);

  const formatNameCapitalize = (name = "placeholder") => {
    name = name.toLowerCase();
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const formatMemberDDList = (data) => {
    var members = [];

    hohPlans.forEach((plan) => {
      if (
        displayInactiveMembers ||
        (!displayInactiveMembers && isActivePlan(plan))
      ) {
        var hohplan = {
          label:
            formatNameCapitalize(plan.FirstName) +
            " " +
            formatNameCapitalize(plan.LastName),
          value: plan.MemberId,
          planName: formatNameCapitalize(plan.PlanName),
          membershipStatus: plan.MembershipStatus,
          membershipEffectiveDate: plan.MembershipEffectiveDate,
          membershipExpirationDate: plan.MembershipExpirationDate,
          companyCode: plan.CompanyNumber,
          benefitPackage: plan.BenefitPackage,
          firstName: plan.FirstName,
          lastName: plan.LastName,
        };
        members.push(hohplan);
      }
    });

    dependents.forEach((dependent) => {
      if (
        displayInactiveMembers ||
        (!displayInactiveMembers && isActivePlan(dependent))
      ) {
        var member = {
          label:
            formatNameCapitalize(dependent.firstName) +
            " " +
            formatNameCapitalize(dependent.lastName),
          value: dependent.memberId,
          planName: dependent.planName,
          membershipStatus: dependent.Status,
          membershipEffectiveDate: dependent.MembershipEffectiveDate,
          membershipExpirationDate: dependent.MembershipExpirationDate,
          companyCode: dependent.companyCode,
          benefitPackage: dependent.benefitPackage,
          firstName: dependent.firstName,
          lastName: dependent.lastName,
        };
        members.push(member);
      }
    });
    setMembers(members);
  };

  const handleMemberSelection = (memberInfo) => {
    const {
      planName,
      membershipStatus,
      membershipEffectiveDate,
      membershipExpirationDate,
      companyCode,
      benefitPackage,
      firstName,
      lastName,
      value,
    } = memberInfo;
    setMemberSelection({
      ...memberSelection,
      memberId: value,
      planName,
      membershipStatus,
      membershipEffectiveDate,
      membershipExpirationDate,
      companyCode,
      benefitPackage,
      firstName,
      lastName,
    });
  };

  return (
    <>
      {members && members.length > 1 && (
        <MemberDropDownSelectWrapper halfWidth>
          <MemberDropDownSelect
            selected={{
              ...memberSelection,
              label:
                formatNameCapitalize(memberSelection.firstName) +
                " " +
                formatNameCapitalize(memberSelection.lastName),
            }}
            values={members}
            onSelect={handleMemberSelection}
            errorMessage="Please select an option."
          />
        </MemberDropDownSelectWrapper>
      )}
    </>
  );
};

export default DependentBlock;
