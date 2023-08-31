import { objectOf } from "prop-types";
import * as actionTypes from "./actionTypes";

/* 
  CLAIM DATA ACTIONS
*/

export const requestClaimList = () => ({
    type: actionTypes.REQUEST_CLAIM_LIST,
});

export const receiveClaimList = (data) => ({
    type: actionTypes.RECEIVE_CLAIM_LIST,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorClaimList = (error) => ({
    type: actionTypes.RECEIVE_CLAIM_LIST,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestClaimDetails = (memberId, claimId) => ({
    type: actionTypes.REQUEST_CLAIM_DETAILS,
    payload: {
        memberId: memberId,
        claimId: claimId,
    },
});

export const receiveClaimDetails = (data) => ({
    type: actionTypes.RECEIVE_CLAIM_DETAILS,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorClaimDetails = (error) => ({
    type: actionTypes.RECEIVE_CLAIM_DETAILS,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestSelectedMember = (id) => ({
    type: actionTypes.REQUEST_DD_SELECTED_MEMBER,
    payload: { id },
});

export const requestAuthorizationList = () => ({
    type: actionTypes.REQUEST_AUTHORIZATION_LIST,
});

export const receiveAuthorizationList = (data) => ({
    type: actionTypes.RECEIVE_AUTHORIZATION_LIST,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorAuthorizationList = (error) => ({
    type: actionTypes.RECEIVE_AUTHORIZATION_LIST,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestAuthorizationDetails = (authorizationId) => ({
    type: actionTypes.REQUEST_AUTHORIZATION_DETAILS,
    payload: {
        authorizationId: authorizationId,
    },
});

export const receiveAuthorizationDetails = (data) => ({
    type: actionTypes.RECEIVE_AUTHORIZATION_DETAILS,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorAuthorizationDetails = (error) => ({
    type: actionTypes.RECEIVE_AUTHORIZATION_DETAILS,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const setTabValue = (value) => ({
    type: actionTypes.SET_TAB_VALUE,
    payload: {
        tabValue: value,
    },
});

export const requestCustomerOOP = () => ({
    type: actionTypes.REQUEST_CUSTOMER_OOP,
});

export const receiveCustomerOOP = (data) => ({
    type: actionTypes.RECEIVE_CUSTOMER_OOP,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorCustomerOOP = (error) => ({
    type: actionTypes.RECEIVE_CUSTOMER_OOP,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestCoverageDetails = (memberId) => ({
    type: actionTypes.REQUEST_COVERAGE_DATA,
    payload: memberId,
});

export const receiveCoverageDetails = (data) => ({
    type: actionTypes.RECEIVE_COVERAGE_DATA,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const requestClaimsEOB = (memberId, claimId) => ({
    type: actionTypes.REQUEST_CLAIMS_EOB,
    payload: {
        memberId: memberId,
        claimId: claimId,
    },
});

export const receiveClaimsEOB = (data) => ({
    type: actionTypes.RECEIVE_CLAIMS_EOB,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorCoverageDetails = (error) => ({
    type: actionTypes.RECEIVE_COVERAGE_DATA,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestCustomerDemographicsInfo = (customerId) => ({
  type: actionTypes.REQUEST_CUSTOMER_DEMOGRAPHICS_INFO,
  payload:{
    memberId: customerId
  }
});

export const receiveCustomerDemographicsInfo = (data) => ({
    type: actionTypes.RECEIVE_CUSTOMER_DEMOGRAPHICS_INFO,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorCustomerDemographicsInfo = (error) => ({
    type: actionTypes.RECEIVE_CUSTOMER_DEMOGRAPHICS_INFO,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestCustomerInfo = () => ({
    type: actionTypes.REQUEST_CUSTOMER_INFO,
    payload: {},
});

export const receiveCustomerInfo = (data) => ({
    type: actionTypes.RECEIVE_CUSTOMER_INFO,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorCustomerInfo = (error) => ({
    type: actionTypes.RECEIVE_CUSTOMER_INFO,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestPcpStatus = (memberId) => ({
    type: actionTypes.REQUEST_PCP_STATUS,
    payload: memberId,
});

export const receivePcpStatus = (data) => ({
    type: actionTypes.RECEIVE_PCP_STATUS,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorPcpStatus = (error) => ({
    type: actionTypes.RECEIVE_PCP_STATUS,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestFormsDocs = (memberId) => ({
    type: actionTypes.REQUEST_FORMS_DOCS,
    payload: memberId,
});

export const receiveFormsDocs = (data) => ({
    type: actionTypes.RECEIVE_FORMS_DOCS,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorFormsDocs = (error) => ({
    type: actionTypes.RECEIVE_FORMS_DOCS,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestPcpDetails = (pcpDetails) => ({
    type: actionTypes.REQUEST_PCP_UPDATE,
    payload: {
        pcpDetails: pcpDetails,
    },
});

export const receivePcpDetails = (data) => ({
    type: actionTypes.RECEIVE_PCP_UPDATE,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorPcpDetails = (error) => ({
    type: actionTypes.RECEIVE_PCP_UPDATE,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestNextQuestion = ({ hraMemberInfo }) => ({
    type: actionTypes.REQUEST_NEXT_QUESTION,
    payload: { hraMemberInfo },
});

export const requestPreviousQuestion = ({ hraMemberInfo }) => ({
    type: actionTypes.REQUEST_PREVIOUS_QUESTION,
    payload: { hraMemberInfo },
});

export const setAnswerSelection = (selection) => ({
    type: actionTypes.SET_ANSWER_SELECTION,
    payload: selection,
});

export const setVisitedQuestion = (question, userInfo) => ({
    type: actionTypes.SET_VISITED_QUESTION,
    payload: { questionId: question.question_id, userInfo },
});

export const errorClaimsEOB = (error) => ({
    type: actionTypes.RECEIVE_CLAIMS_EOB,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestHraQuestions = (memberId) => ({
    type: actionTypes.REQUEST_HRA_QUESTIONS,
    payload: memberId,
});

export const receiveHraQuestions = (data) => ({
    type: actionTypes.RECEIVE_HRA_QUESTIONS,
    payload: data,
});

export const errorHraQuestions = (error) => ({
    type: actionTypes.ERROR_HRA_QUESTIONS,
    payload: error,
});

export const requestPhysicalIdCard = (memberId) => ({
    type: actionTypes.REQUEST_PHYSICAL_ID_CARD,
    payload: {
        memberId: memberId,
    },
});

export const receivePhysicalIdCard = (data) => ({
    type: actionTypes.RECEIVE_PHYSICAL_ID_CARD,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorPhysicalIdCard = (error) => ({
    type: actionTypes.RECEIVE_PHYSICAL_ID_CARD,
});

export const requestDigitalIdCard = (memberId) => ({
    type: actionTypes.REQUEST_DIGITAL_ID_CARD,
    payload: {
        memberId: memberId,
    },
});

export const receiveDigitalIdCard = (data) => ({
    type: actionTypes.RECEIVE_DIGITAL_ID_CARD,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorDigitalIdCard = (error) => ({
    type: actionTypes.RECEIVE_DIGITAL_ID_CARD,
});

export const requestSubmitHraSurvey = (data) => ({
    type: actionTypes.REQUEST_SUBMIT_HRA_SURVEY,
    payload: { response: data },
});

// HRA
export const requestHraPartials = (data) => ({
    type: actionTypes.REQUEST_HRA_PARTIALS,
    payload: data,
});

export const receiveHraPartials = (data) => ({
    type: actionTypes.RECEIVE_HRA_PARTIALS,
    payload: data,
});

export const errorHraPartials = (error) => ({
    type: actionTypes.RECEIVE_HRA_PARTIALS,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const getUserName = () => ({
    type: actionTypes.GET_USERNAME,
});

export const settingsResetMessage = () => ({
    type: actionTypes.RESET_MESSAGE,
});

export const updateUserName = (account) => ({
    type: actionTypes.UPDATE_USERNAME,
    payload: account.data,
});

export const requestChangeUsername = (data, csrf) => ({
    type: actionTypes.REQUEST_CHANGE_USERNAME,
    payload: { data, csrf },
});

export const receiveChangeUsername = (data, userName) => ({
    type: actionTypes.RECEIVE_CHANGE_USERNAME,
    payload: { data, userName },
});

export const requestChangePassword = (data, csrf) => ({
    type: actionTypes.REQUEST_CHANGE_PASSWORD,
    payload: { data, csrf },
});

export const receiveChangePassword = (data) => ({
    type: actionTypes.RECEIVE_CHANGE_PASSWORD,
    payload: data,
});
export const requestSubmitMailMemberIDCardForm = (data) => ({
    type: actionTypes.REQUEST_SUBMIT_MAIL_MEMBER_ID_CARD_FORM,
    payload: { response: data },
});

export const receiveSubmitMailMemberIDCardForm = (data) => ({
    type: actionTypes.RECEIVE_SUBMIT_MAIL_MEMBER_ID_CARD_FORM,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorSubmitMailMemberIDCardForm = (error) => ({
    type: actionTypes.RECEIVE_SUBMIT_MAIL_MEMBER_ID_CARD_FORM,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestSubmitClaimDetails = (data) => ({
    type: actionTypes.REQUEST_SUBMIT_CLAIM_DETAILS,
    payload: { data },
});
export const receiveSubmitClaimDetails = (data) => ({
    type: actionTypes.RECEIVE_SUBMIT_CLAIM_DETAILS,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const submitAttestationAgreement = (data) => ({
    type: actionTypes.REQUEST_SUBMIT_ATTESTATION_AGREEMENT,
    payload: { data },
});
export const receiveAttestationAgreement = (data) => ({
    type: actionTypes.RECEIVE_SUBMIT_ATTESTATION_AGREEMENT,
    payload: {
        status: "SUCCESS",
        data,
    },
});
export const errorAttestationAgreement = (error) => ({
    type: actionTypes.RECEIVE_SUBMIT_ATTESTATION_AGREEMENT,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestMailMemberIDCardStatus = (data) => ({
    type: actionTypes.REQUEST_MAIL_MEMBER_ID_CARD_STATUS,
    payload: { response: data },
});

export const receiveMailMemberIDCardStatus = (data) => ({
    type: actionTypes.RECEIVE_MAIL_MEMBER_ID_CARD_STATUS,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorSubmitClaimDetails = (error) => ({
    type: actionTypes.RECEIVE_SUBMIT_CLAIM_DETAILS,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});
export const errorMailMemberIDCardStatus = (error) => ({
    type: actionTypes.RECEIVE_MAIL_MEMBER_ID_CARD_STATUS,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

// MY HEALTH (NowPow)
export const requestCategories = (data) => ({
    type: actionTypes.REQUEST_CATEGORIES,
    payload: data,
});

export const receiveCategories = (data) => ({
    type: actionTypes.RECEIVE_CATEGORIES,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorCategories = (error) => ({
    type: actionTypes.RECEIVE_CATEGORIES,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const updateIconById = (data) => ({
    type: actionTypes.UPDATE_ICON_BY_ID,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorGetIcon = (error) => ({
    type: actionTypes.UPDATE_ICON_BY_ID,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const getCategoryDetailsAll = (payload) => ({
    type: actionTypes.GET_CATEGORY_DETAILS_ALL,
    payload: payload,
});

export const updateCategoryDetailsAll = (data) => ({
    type: actionTypes.UPDATE_CATEGORY_DETAILS_ALL,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorCategoryDetailsAll = (error) => ({
    type: actionTypes.UPDATE_CATEGORY_DETAILS_ALL,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const getCategoryDetails = (payload) => ({
    type: actionTypes.GET_CATEGORY_DETAILS,
    payload: payload,
});

export const updateCategoryDetails = (data) => ({
    type: actionTypes.UPDATE_CATEGORY_DETAILS,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorCategoryDetails = (error) => ({
    type: actionTypes.UPDATE_CATEGORY_DETAILS,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const getCategoryIcon = (id) => ({
    type: actionTypes.GET_CATEGORY_ICON,
    id,
});

export const getIndMapDetails = (payload) => ({
    type: actionTypes.GET_IND_MAP_DETAILS,
    payload: payload,
});

export const updateIndMapDetails = (data) => ({
    type: actionTypes.UPDATE_IND_MAP_DETAILS,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorIndMapDetails = (error) => ({
    type: actionTypes.UPDATE_IND_MAP_DETAILS,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestCarouselItems = () => ({
    type: actionTypes.REQUEST_CAROUSEL_ITEMS,
});

export const receiveCarouselItems = (data) => ({
    type: actionTypes.RECEIVE_CAROUSEL_ITEMS,
    payload: {
        status: "SUCCESS",
        data,
    },
});
export const requestPreferredContactInfoSubmit = (data, csrf) => ({
    type: actionTypes.REQUEST_PREFERRED_CONTACT_INFO_SUBMIT,
    payload: { data: data, csrf: csrf },
});
export const receivePreferredContactInfoSubmit = (data) => ({
    type: actionTypes.RECEIVE_PREFERRED_CONTACT_INFO_SUBMIT,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorCarouselItems = (error) => ({
    type: actionTypes.RECEIVE_CAROUSEL_ITEMS,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const errorPreferredContactInfoSubmit = (error) => ({
    type: actionTypes.RECEIVE_PREFERRED_CONTACT_INFO_SUBMIT,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestPCPDetails = (memberId, membershipEffectiveDate) => ({
    type: actionTypes.REQUEST_PCP_DETAILS,
    payload: {
        memberId: memberId,
        effdate: membershipEffectiveDate,
    },
});

export const receivePCPDetails = (data) => ({
    type: actionTypes.RECEIVE_PCP_DETAILS,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorPCPDetails = (error) => ({
    type: actionTypes.RECEIVE_PCP_DETAILS,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

// Global Alerts
export const requestGlobalAlerts = (data) => ({
    type: actionTypes.REQUEST_GLOBAL_ALERTS,
    payload: data,
});

export const receiveGlobalAlerts = (data) => ({
    type: actionTypes.RECEIVE_GLOBAL_ALERTS,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorGlobalAlerts = (error) => ({
    type: actionTypes.RECEIVE_GLOBAL_ALERTS,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestAddMembership = (membershipDetails, csrf) => ({
    type: actionTypes.REQUEST_ADD_MEMBERSHIP,
    payload: {
        data: membershipDetails,
        csrf: csrf,
    },
});

export const receiveAddMembership = (data) => ({
    type: actionTypes.RECEIVE_ADD_MEMBERSHIP,
    payload: {
        status: "SUCCESS",
        successMsg: data,
    },
});

export const requestPreferenceCenterInfo = (data) => ({
    type: actionTypes.REQUEST_PREFERENCE_CENTER_INFO,
    payload: { response: data },
});

export const receivePreferenceCenterInfo = (data) => ({
    type: actionTypes.RECEIVE_PREFERENCE_CENTER_INFO,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorAddMembership = (error) => ({
    type: actionTypes.RECEIVE_ADD_MEMBERSHIP,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestContactEmailInfo = (data) => ({
    type: actionTypes.REQUEST_CONTACT_EMAIL_INFO,
    payload: { email: data },
});

export const receiveContactEmailInfo = (data) => ({
    type: actionTypes.RECEIVE_CONTACT_EMAIL_INFO,
    payload: {
        status: "SUCCESS",
        data,
    },
});
export const errorContactEmailInfo = (data) => ({
    type: actionTypes.ERROR_CONTACT_EMAIL_INFO,
    payload: {
        status: "ERROR",
        data,
    },
});
export const requestContactPhoneInfo = (data) => ({
    type: actionTypes.REQUEST_CONTACT_PHONE_INFO,
    payload: { phone: data },
});

export const receiveContactPhoneInfo = (data) => ({
    type: actionTypes.RECEIVE_CONTACT_PHONE_INFO,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorPreferenceCenterInfo = (error) => ({
    type: actionTypes.RECEIVE_PREFERENCE_CENTER_INFO,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestMFACode = (data, mfaToken) => ({
  type: actionTypes.REQUEST_MFA_CODE,
  payload: { data:data, mfaToken:mfaToken }
});

export const receiveMFACode = (data) => ({
    type: actionTypes.RECEIVE_MFA_CODE,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorMFACode = (error) => ({
    type: actionTypes.RECEIVE_MFA_CODE,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestUserMFACode = (data, mfaToken) => ({
    type: actionTypes.REQUEST_USER_MFA_CODE,
    payload: { data:data, mfaToken:mfaToken }
  });
  
export const receiveUserMFACode = (data) => ({
    type: actionTypes.RECEIVE_USER_MFA_CODE,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorUserMFACode = (error) => ({
    type: actionTypes.RECEIVE_USER_MFA_CODE,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestMFAFactors = (mfaToken) => ({
  type: actionTypes.REQUEST_MFA_FACTORS,
  payload: { mfaToken:mfaToken }
});

export const receiveMFAFactors = (data) => ({
  type: actionTypes.RECEIVE_MFA_FACTORS,
  payload: {
    status: "SUCCESS",
    data,
  },
});

export const errorMFAFactors = (error) => ({
  type: actionTypes.RECEIVE_MFA_FACTORS,
  payload: {
    status: "ERROR",
    errorData: error,
  },
});

export const requestRegister = (data,mfaToken) =>({
  type:actionTypes.REQUEST_REGISTER,
  payload:{
    data:data,
    mfaToken:mfaToken
  }
});



export const receiveRegister = (data) => ({
  type: actionTypes.RECEIVE_REGISTER,
  payload: {
    status: "SUCCESS",
    data,
  },
});

export const errorRegister = (error) => ({
  type: actionTypes.RECEIVE_REGISTER,
  payload: {
    status: "ERROR",
    errorData: error,
  },
});

export const requestMFAVerify = (data,mfaToken,channel) => ({
  type: actionTypes.REQUEST_MFA_VERIFY,
  payload: { data:data, mfaToken:mfaToken ,channel:channel }
});

export const receiveMFAVerify  = (data) => ({
  type: actionTypes.RECEIVE_MFA_VERIFY,
  payload: {
    status: "SUCCESS",
    data,
  },
});

export const errorMFAVerify = (error) => ({
    type: actionTypes.RECEIVE_MFA_VERIFY,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestUserMFAVerify = (data,mfaToken,channel) => ({
    type: actionTypes.REQUEST_USER_MFA_VERIFY,
    payload: { data:data, mfaToken:mfaToken }
  });

export const receiveUserMFAVerify  = (data) => ({
    type: actionTypes.RECEIVE_USER_MFA_VERIFY,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorUserMFAVerify = (error) => ({
    type: actionTypes.RECEIVE_USER_MFA_VERIFY,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

export const requestCreateUserNamePassword = (data, mfaVerifiedAuth) => ({
  type: actionTypes.REQUEST_CREATE_USERNAME_PASSWORD,
  payload: { data:data, mfaVerifiedAuth:mfaVerifiedAuth }
});

export const receiveCreateUserNamePassword = (data) => ({
  type: actionTypes.RECEIVE_CREATE_USERNAME_PASSWORD,
  payload: {
    status: "SUCCESS",
    data,
  },
});


export const errorCreateUserNamePassword= (error) => ({
  type: actionTypes.RECEIVE_CREATE_USERNAME_PASSWORD,
  payload: {
    status: "ERROR",
    errorData: error,
  },
});
export const errorContactPhoneInfo = (data) => ({
    type: actionTypes.ERROR_CONTACT_PHONE_INFO,
    payload: {
        status: "ERROR",
        data,
    },
});

export const reportError = (membershipKey) => ({
    type: actionTypes.REPORT_ERROR,
    payload: { membershipKey },
});

export const reportErrorSuccess = () => ({
    type: actionTypes.REPORT_ERROR_SUCCESS,
    payload: {
        status: "SUCCESS",
    },
});

export const requestSelectPlan = (membershipKey) => ({
    type: actionTypes.REQUEST_SELECT_PLAN,
    payload: {
        membershipKey: membershipKey,
    },
});

export const receiveSelectPlan = (data) => ({
    type: actionTypes.RECEIVE_SELECT_PLAN,
    payload: {
        status: "SUCCESS",
        data,
    },
});
export const errorSelectPlan = (error) => ({
    type: actionTypes.RECEIVE_SELECT_PLAN,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});

//OTC ClaimReimbursement Data

export const requestOTCClaimReimbursementData = () => ({
  type: actionTypes.REQUEST_OTC_CLAIM_REIMBURSEMENT_DATA,
});

export const receiveOTCClaimReimbursementData = (data) => ({
  type: actionTypes.RECEIVE_OTC_CLAIM_REIMBURSEMENT_DATA,
  payload: {
    status: "SUCCESS",
    data,
  },
});


export const errorOTCClaimReimbursementData = (data) => ({
  type: actionTypes.RECEIVE_OTC_CLAIM_REIMBURSEMENT_DATA,
  payload: {
    status: "ERROR",
    errorData: error,
  },
});


// OTC Card
export const requestOTCProfile = () => ({
    type: actionTypes.REQUEST_OTC_PROFILE,
});

export const receiveOTCProfile = (data) => ({
    type: actionTypes.RECEIVE_OTC_PROFILE,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorOTCProfile = (error) => ({
    type: actionTypes.RECEIVE_OTC_PROFILE,
    payload: {
    status: "ERROR",
    errorData: error,
    },
});

export const requestResetState = () => ({
    type: actionTypes.REQUEST_RESET_STATE
});

export const requestResetPcpDetails = () =>({
    type:actionTypes.REQUEST_RESET_PCP_DETAILS
});

export const requestResetRegisterState = () =>({
    type: actionTypes.RESET_REGISTER
});

export const requestUpdatedPCPID = (data) =>({
    type: actionTypes.UPDATE_CUSTOMER_INFO,
    payload: {data:data}
});

export const requestForgotUsername = (data, mfaToken) => ({
    type: actionTypes.REQUEST_FORGOT_USERNAME,
    payload: { data:data, mfaToken:mfaToken }
});

export const receiveForgotUsername = (data) => ({
    type: actionTypes.RECEIVE_FORGOT_USERNAME,
    payload: {
    status: "SUCCESS",
    data,
    },
});

export const errorForgotUsername = (error) => ({
    type: actionTypes.RECEIVE_FORGOT_USERNAME,
    payload: {
    status: "ERROR",
    errorData: error,
}}); 

export const requestForgotPassword = (data, mfaToken) => ({
  type: actionTypes.REQUEST_FORGOT_PASSWORD,
  payload: { data:data, mfaToken:mfaToken }
});

export const receiveForgotPassword = (data) => ({
  type: actionTypes.RECEIVE_FORGOT_PASSWORD,
  payload: {
    status: "SUCCESS",
    data,
  },
});

export const errorForgotPassword = (error) => ({
  type: actionTypes.RECEIVE_FORGOT_PASSWORD,
  payload: {
    status: "ERROR",
    errorData: error,
}}); 

export const requestSetPassword = (data, mfaToken) => ({
  type: actionTypes.REQUEST_SET_PASSWORD,
  payload: { data:data, mfaToken:mfaToken }
});

export const receiveSetPassword = (data) => ({
  type: actionTypes.RECEIVE_SET_PASSWORD,
  payload: {
    status: "SUCCESS",
    data,
  },
});

export const errorSetPassword = (error) => ({
  type: actionTypes.RECEIVE_SET_PASSWORD,
  payload: {
    status: "ERROR",
    errorData: error,
}}); 
export const setSelectIndexTab = (value) => ({
    type: actionTypes.TOGGLE_SETTINGS_TAB_VALUE,
    payload: {
        value: value,
    },
});


export const getDocumentsList = (memberId, type, startDate, endDate, companyCode, benefitPackage, featureconfig) => ({
    type: actionTypes.GET_DOCUMENT_LIST,
    payload: {
        status: "SUCCESS",
        memberId,
        type, 
        startDate, 
        endDate, 
        companyCode, 
        benefitPackage,
        featureconfig
    },
});

export const clearDocs = () => ({
    type: actionTypes.CLEAR_DOCS
});

export const clearLoadingStatus = () => ({
    type: actionTypes.CLEAR_LOADING_STATUS
});

export const receiveDocumentsList = (data) => ({
    type: actionTypes.RECEIVE_DOCUMENT_LIST,
    payload: {
        status: "SUCCESS",
        data,
    },
});

export const errorDocumentsList = (error) => ({
    type: actionTypes.ERROR_DOCUMENT_LIST,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});



export const getDocument = (docId, isNodeId) => ({
    type: actionTypes.GET_DOCUMENT,
    payload: {
        docId,
        isNodeId
    }
});


export const receivedDocumentFile = (data) => ({
    type: actionTypes.RECEIVED_DOCUMENT_FILE,
    payload: {
        data
    }
});

export const errorDocumentFile = (error) => ({
    type: actionTypes.DOCUMENT_ERROR,
    payload: {
        error
    }
});

export const documentFileLoading = () => ({
    type: actionTypes.DOCUMENT_FILE_LOADING
});

export const requestVerifyAddress = (streetAddress, streetAddressTwo, city, state, zip) => ({
    type: actionTypes.REQUEST_VERIFY_ADDRESS,
    payload: { streetAddress, streetAddressTwo, city, state, zip },
});
export const receiveVerifyAddress = (data) => ({
    type: actionTypes.RECEIVE_VERIFY_ADDRESS,
    payload: {
        status: "SUCCESS",
        data,
    },
});
export const errorVerifyAddress = (error) => ({
    type: actionTypes.RECEIVE_VERIFY_ADDRESS,
    payload: {
        status: "ERROR",
        errorData: error,
    },
});