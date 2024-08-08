import {
  ANALYTICS_TRACK_TYPE,
  ANALYTICS_TRACK_CATEGORY,
} from "../../constants/segment";
import { AnalyticsPage, AnalyticsTrack } from "../common/segment/analytics";
import * as splits from "../../constants/splits";

const { MIX_REACT_PAYMENTS_BASE_URL } = process.env;

export const accountTreatmentsInit = {
  [splits.PAYMENTS_ACL]: false,
  [splits.BINDER_ACL]: false,
  [splits.SHOW_PAYMENTS_REACT_APP]: false,
  [splits.SHOW_BINDER_REACT_APP]: false,
};

// purge session storage for payments
export const purgePaymentsSessionData = () =>
  sessionStorage.removeItem(`persist:${MIX_REACT_PAYMENTS_BASE_URL}`);
// removes all that was appended to the head elem while payments app was loaded
export const removeAllPaymentsResources = () => {
  const tagsToRemove = Array.from(
    document.getElementsByClassName("hf--payments--bundle"),
  );
  tagsToRemove.forEach((el) => el.remove());
};

export const getSplitpAttributes = (account, accountStatus) => {
  const {
    memberId,
    companyCode,
    benefitPackage,
    sessLobCode,
    membershipStatus,
    MemberId,
    LOBCode,
    MembershipStatus,
    BenefitPackage,
    CompanyNumber,
    MembershipKey,
  } = account;

  const splitAttributes = {
    accountId: MembershipKey || memberId || "NON-MEMBER", // not used for split
    memberId: MemberId || memberId,
    lob: LOBCode || sessLobCode,
    benefitPackage: BenefitPackage || benefitPackage,
    membershipStatus: MembershipStatus || membershipStatus,
    companyCode: CompanyNumber || companyCode,
    accountStatus,
  };
  return splitAttributes;
};

const getTreatmentsFromSplit = (splitAttrs, splitClient) => {
  const treatmentsForThisAccount = Object.keys(accountTreatmentsInit).reduce(
    (result, key) => {
      const splitConfig = splitClient.getTreatmentWithConfig(key, splitAttrs);
      result[key] = splitConfig.treatment === "on";
      return result;
    },
    {},
  );
  return treatmentsForThisAccount;
};

const isAccountEnabled = (accountTreatments) =>
  accountTreatments[splits.BINDER_ACL] ||
  accountTreatments[splits.PAYMENTS_ACL];

// returns accounts enabled on split and corresponding accountIds
export const getEnabledAccountsAndTreatments = (
  allAccountsAtributes,
  splitClient,
) => {
  // remove repeated account in favor of HoH plan
  const filteredAtributes = [];
  for (const cur of allAccountsAtributes) {
    const HoHIndex = filteredAtributes.findIndex(
      (acct) => acct.memberId === cur.memberId,
    );
    if (HoHIndex > -1) filteredAtributes.splice(HoHIndex, 1, cur);
    else filteredAtributes.push(cur);
  }

  const enabledAccountsIds = [];
  const enabledAccountsTreatments = [];
  // check which accounts are enabled and get their treatments & IDs
  filteredAtributes.forEach((attrs) => {
    const accountTreatments = getTreatmentsFromSplit(attrs, splitClient);
    // skip if no access to either experience
    if (!isAccountEnabled(accountTreatments)) return;
    enabledAccountsTreatments.push(accountTreatments);
    enabledAccountsIds.push(attrs.accountId);
  });
  return [enabledAccountsIds, enabledAccountsTreatments];
};

// emits analytics track event
export const handleSegmentBtn = (customerInfo, label, link = null) => {
  AnalyticsPage();
  AnalyticsTrack(`${label} button clicked`, customerInfo, {
    raw_text: label,
    destination_url: link,
    description: `${label} button clicked`,
    category: ANALYTICS_TRACK_CATEGORY.payments,
    type: ANALYTICS_TRACK_TYPE.buttonClicked,
    targetMemberId: customerInfo?.data?.memberId,
    location: {
      desktop: {
        width: 960,
        value: "left",
      },
      tablet: {
        width: 768,
        value: "right",
      },
      mobile: {
        width: 0,
        value: "right",
      },
    },
  });
};
