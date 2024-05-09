import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  MemberDropDownSelect,
  MemberDropDownSelectWrapper,
  MinorText,
} from "./styles";

const DependentBlock = ({
  memberSelection,
  setMemberSelection,
  halfWidth,
  activeOnly,
  callback,
  minorsOnly,
  prevPlans,
  activeDepsOnly,
}) => {
  const customerInfo = useSelector((state) => state.customerInfo);
  const {
    data: { dependents },
  } = customerInfo;
  const [memberships, setMemberships] = useState([]);

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
    var memberships = [];
    if (data.hohPlans) {
      data.hohPlans.forEach((plan) => {
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
          firstName: plan.FirstName,
          lastName: plan.LastName,
          benefitPackage: plan.BenefitPackage,
          lob: plan.LOBCode,
          groupNumber: plan.GroupNumber,
          relationshipType: "SELF",
          relationshipCode: plan.RelationshipCode,
        };

        if (!activeOnly) {
          memberships.push(hohplan);
        } else if (hohplan.membershipStatus == "active") {
          memberships.push(hohplan);
        }
      });
    }

    if (data.dependents) {
      data.dependents.forEach((dependent) => {
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
          firstName: dependent.firstName,
          lastName: dependent.lastName,
          benefitPackage: dependent.benefitPackage,
          lob: dependent.LobCode,
          groupNumber: dependent.groupNumber,
          relationshipType: dependent.RelationshipType,
        };

        let isValidDependent = false;

        isValidDependent = activeDepsOnly
          ? member.membershipStatus == "active"
          : true;

        if (isValidDependent)
          isValidDependent = minorsOnly ? dependent.Age < 18 : true;

        if (isValidDependent) {
          memberships.push(member);
        }
      });
    }

    if (prevPlans) {
      if (data.previousPlans) {
        data.previousPlans.forEach((prevPlan) => {
          var member = {
            label:
              formatNameCapitalize(prevPlan.FirstName) +
              " " +
              formatNameCapitalize(prevPlan.LastName),
            value: prevPlan.MemberId,
            planName: formatNameCapitalize(prevPlan.PlanName),
            membershipStatus: prevPlan.MembershipStatus,
            membershipEffectiveDate: prevPlan.MembershipEffectiveDate,
            membershipExpirationDate: prevPlan.MembershipExpirationDate,
            companyCode: prevPlan.CompanyNumber,
            firstName: prevPlan.FirstName,
            lastName: prevPlan.LastName,
            benefitPackage: prevPlan.BenefitPackage,
            lob: prevPlan.LOBCode,
            groupNumber: prevPlan.GroupNumber,
          };
          memberships.push(member);
        });
      }
    }
    setMemberships(memberships);
  };

  const handleMemberSelection = (memberInfo) => {
    if (typeof callback === "function") callback(memberInfo);
    const {
      planName,
      membershipStatus,
      membershipEffectiveDate,
      membershipExpirationDate,
      companyCode,
      firstName,
      lastName,
      value,
      benefitPackage,
      groupNumber,
      lob,
      relationshipType,
      relationshipCode,
    } = memberInfo;
    setMemberSelection({
      ...memberSelection,
      memberId: value,
      planName,
      membershipStatus,
      membershipEffectiveDate,
      membershipExpirationDate,
      companyCode,
      firstName,
      lastName,
      benefitPackage,
      groupNumber,
      lob,
      relationshipType,
      relationshipCode,
    });
  };

  return (
    <>
      {memberships && memberships.length > 1 && (
        <MemberDropDownSelectWrapper halfWidth>
          <MemberDropDownSelect
            selected={{
              ...memberSelection,
              label:
                formatNameCapitalize(memberSelection.firstName) +
                " " +
                formatNameCapitalize(memberSelection.lastName),
            }}
            values={memberships}
            onSelect={handleMemberSelection}
            errorMessage="Please select an option."
          />
        </MemberDropDownSelectWrapper>
      )}
      {memberships && memberships.length > 1 && minorsOnly && (
        <MinorText>
          <img alt="" src="/react/images/icn-note-warning.svg" />

          <span>NOTE: Dependents 18 years or older will not be shown</span>
        </MinorText>
      )}
    </>
  );
};

export default DependentBlock;
