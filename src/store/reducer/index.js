import { combineReducers } from "redux";
import claim from "./claimReducer";
import claimDetails from "./claimDetailsReducer";
import authorization from "./authorizationReducer";
import authorizationDetails from "./authorizationDetailsReducer";
import oop from "./oopReducer";
import coverageBenefits from "./coverageBenefitsReducer";
import customerInfo from "./customerInfoReducer";
import customerDemographicsInfo from "./customerDemographicsInfoReducer";
import pcpDetails from "./pcpDetailsReducer"
import pcpStatus from "./pcpStatusReducer"
import hra from "./hraReducer";
import physicalIdCard from "./physicalIdCardReducer";
import digitalIdCard from "./digitalIdCardReducer";
import correspondence from "./correspondenceReducer";
import correspondenceStatus from "./correspondenceStatusReducer";
import selectedMember from "./selectedMemberReducer";
import settingsReducer from "./settingsReducer";
import myHealth from './myHealthReducer';
import homeDetails from "./homeReducer";
import addMembership from "./addMembershipReducer";
import submitClaimDetails from "./submitClaimDetailsReducer"; 
import submitContactInfoPayload from "./updateContactInfoReducer"; 
import submitAttestationAgreement from "./submitAttestationAgreementReducer";
import preferenceCenterInfo from "./preferenceCenterInfoReducer";
import preferredContactInfoSubmit from "./preferredContactInfoSubmitReducer";
import mfaCode from "./mfaCodeReducer";
import mfaVerify from "./mfaVerifyReducer";
import globalAlerts from './globalAlertsReducer';
import otcCard from "./OTCCardReducer";
import mfaFactors from "./mfaFactors";
import memberRegister from "./memberRegister";
import createUsernamePassword from "./createUsernamePasswordReducer";


export default combineReducers({
  claim,
  claimDetails,
  authorization,
  authorizationDetails,
  oop,
  coverageBenefits,
  customerInfo,
  customerDemographicsInfo,
  pcpStatus,
  pcpDetails,
  hra,
  physicalIdCard,
  digitalIdCard,
  settingsReducer,
  correspondence,
  selectedMember,
  myHealth,
  homeDetails,
  addMembership,
  submitAttestationAgreement,
  submitClaimDetails, 
  correspondenceStatus,
  submitContactInfoPayload,
  submitAttestationAgreement,
  correspondenceStatus,
  preferenceCenterInfo,
  preferredContactInfoSubmit,
  mfaCode,
  mfaVerify,
  mfaFactors,
  globalAlerts,
  otcCard,
  memberRegister,
  createUsernamePassword
});
