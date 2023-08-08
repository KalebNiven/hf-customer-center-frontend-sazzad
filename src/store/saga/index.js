import { call, put, takeLatest, all } from "redux-saga/effects";
import * as actionTypes from "../actions/actionTypes";
import * as actions from "../actions";
import {
  getClaimsList,
  getClaimsDetails,
  getAuthorizationList,
  getAuthorizationsDetails,
  getCustomerOOP,
  getClaimsEOB,
  getPcpStatus,
  getPcpDetails,
  getCoverageBenefitsData,
  getCustomerInfoData,
  getCustomerDemographicsInfoData,
  getFormsDocsData,
  getHraQuestionsList,
  getDigitalIdCarda,
  getPhysicalIdCarda,
  submitHraSurvey,
  getHraPartials,
  getUserName,
  changeUserName,
  changePassword,
  submitMailMemberIDCardForm,
  getCategoriesApiData,
  getCategDetails,
  getIndMapDetails,
  getCategDetailsAll,
  submitClaimPayloadApi,
  getCarouselDetails,
  getPcpData,
  addMbrshipDetails,
  submitAttestationAgreementAPI,
  getMailMemberIDCardStatus,
  updateEmailContactInfo,
  submitPlanForExternalLink,
  updatePhoneContactInfo,
  getGlobalAlerts,
  submitPreferredContactInfo,
  getPreferenceCenterInfo,
  requestMFACode,
  requestUserMFACode,
  requestMFAFactors,
  requestRegister,
  verifyMFACode,
  verifyUserMFACode,
  reportErrorService,
  getOTCProfile,
  getDocuments,
  getDocumentFile,
  getOTCClaimReimbursementData,
  createUsernamePassword,
  forgotUsername,
  forgotPassword,
  setPassword,
  verifyAddress
} from "./apis";

const formatNameCapitalize = (name) => {
  if (typeof (name) !== "undefined") {
    name = name.toLowerCase();
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  return name;
}

export function* getClaimList() {
  try {
    const res = yield call(getClaimsList);
    var claimsList = [];
    var claimStatus = "";
    if (res.data != undefined && res.data != null) {
      var claims = res.data;
      for (var member in claims) {
        claims[member].forEach(claim => {

          if (claim.ClaimStatus === "Paid") {
            claimStatus = "Processed";
          } else {
            claimStatus = "Pending";
          }

          claimsList.push({
            id: claim.ClaimNo,
            claimId: claim.ClaimNo,
            memberId: claim.Member.MemberId,
            firstName: formatNameCapitalize(claim.Member.FirstName),
            lastName: formatNameCapitalize(claim.Member.LastName),
            provider: {
              firstName: claim.Provider.FirstName,
              lastName: claim.Provider.LastName
            },
            serviceDate: formatDate(claim.ServiceFromDate),
            claimStatus: claimStatus,
            copayAmount: claim.CopayAmt,
            prepaidAmount: claim.PrepaidAmt
          });
        });
      };
    }
    yield put(actions.receiveClaimList(claimsList));
  } catch (e) {
    yield put(actions.errorClaimList(e));
  }
}

function* watchClaimListSaga() {
  yield takeLatest(actionTypes.REQUEST_CLAIM_LIST, getClaimList);
}


export function* getClaimDetails(action) {
  try {
    const res = yield call(getClaimsDetails, action.payload.memberId, action.payload.claimId);
    var claimDetails = null;
    var claimStatus = "";
    if (res.data != undefined && res.data != null) {
      var data = res.data;
      var lineItems = new Array();
      data.ServiceLine.forEach(lineItem => {
        lineItems.push(new claimLineItem(lineItem));
      }); (data.lineItemDetails)

      if (data.ClaimStatus === "Paid") {
        claimStatus = "Processed";
      } else {
        claimStatus = "Pending";
      }

      claimDetails = {
        claimHeader: {
          claimId: data.ClaimNo,
          claimStatus: claimStatus,
          serviceFromDate: formatDate(data.ServiceFromDate),
          serviceEndDate: formatDate(data.ServiceToDate),
          claimStatusDate: formatDate(data.ClaimReceivedDate)
        },
        patient: {
          id: data.Member.MemberId,
          planName: data.Member.planName,
          firstName: data.Member.FirstName,
          lastName: data.Member.LastName
        },
        payment: {
          lineItemChargeAmount: data.TotalBilled,
          copayAmount: data.CopayAmt,
          prepaidAmount: data.PrepaidAmt,
          toPayAmount: data.ProviderDisbursementAmt,
          totalAmountOwedToProvider: data.TotalAmountOwedToProvider
        },
        renderingProvider: {
          lastName: data.Provider.LastName,
          firstName: data.Provider.FirstName
        },
        address: {
          mailingAddress: data.Provider.MailingAddress
        },
        phonenumber: formatPhoneNumber(data.Provider.PhoneNumber),
        claimLine: lineItems
      };
    }
    yield put(actions.receiveClaimDetails(claimDetails));
  } catch (e) {
    yield put(actions.errorClaimDetails(e));
  }
}

function* watchClaimDetailsSaga() {
  yield takeLatest(
    actionTypes.REQUEST_CLAIM_DETAILS,
    getClaimDetails
  );
}

export function* getAuthorizationsList(action) {
  try {
    const res = yield call(getAuthorizationList);
    var authorizationsList = [];
    if (res.data != undefined && res.data != null) {
      var authorizations = res.data;
      for (var member in authorizations) {
        authorizations[member].forEach(authorization => {
          authorizationsList.push({
            authorizationId: authorization.authorizationNumber,
            memberId: authorization.memberId,
            firstName: formatNameCapitalize(authorization.firstName),
            lastName: formatNameCapitalize(authorization.lastName),
            provider: {
              name: (authorization.servicingProviderName != "") ? authorization.servicingProviderName : '-'
            },
            startDate: formatDate(authorization.fromDateofService),
            endDate: formatDate(authorization.thruDateofService),
            authorizationStatus: authorization.authorizationStatus
          });
        });
      };
    }
    yield put(actions.receiveAuthorizationList(authorizationsList));
  } catch (e) {
    yield put(actions.errorAuthorizationList(e));
  }
}

function* watchAuthorizationListSaga() {
  yield takeLatest(actionTypes.REQUEST_AUTHORIZATION_LIST, getAuthorizationsList);
}

function claimLineItem(lineItem) {
  var claimStatus = "";
  this.typeofservice = lineItem.ServiceDescription,
    this.payment = {
      lineItemChargeAmount: lineItem.ClaimAmount,
      nonCovered: lineItem.NonCoveredAmount,
      amount: lineItem.PayAmount,
      patientCalculatedAmount: lineItem.CoInsuranceAmount,
      copayAmount: lineItem.CopayAmount,
      amountOwedToProvider: lineItem.AmountOwedPerService
    }

  if ((lineItem.Status === "Paid" && lineItem.PayAmount > 0) || (lineItem.Status === "Paid" && lineItem.CapitationAmount > 0) || (lineItem.Status === "Posted" && lineItem.PayAmount > 0) || (lineItem.Status === "Posted" && lineItem.CapitationAmount > 0)) {
    claimStatus = "Paid";
  }
  else if ((lineItem.Status === "Paid" && lineItem.PayAmount == 0 && lineItem.CapitationAmount == 0) || (lineItem.Status === "Posted" && lineItem.PayAmount == 0 && lineItem.CapitationAmount == 0)) {
    claimStatus = "Denied";
  }
  else {
    claimStatus = "Pending";
  }
  this.status = claimStatus
}

function authorizationLineItem(lineItem, placeOfService, requestDate) {
  this.typeofservice = lineItem.serviceType,
    this.serviceOverview = {
      placeOfService: placeOfService,
      requestedDate: formatDate(requestDate),
      startDate: formatDate(lineItem.startDateofService),
      endDate: formatDate(lineItem.endDateofService),
      status: lineItem.lineItemStatus,
    }
}

function formatDate(date) {
  if (date != "") {
    try {
      var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;

      return [month, day, year].join('/');
    }
    catch (e) {
      return "\u2014";
    }
  }
  else {
    return "\u2014";
  }
}

function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    var intlCode = (match[1] ? '+1 ' : '');
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return null;
}

export function* getAuthorizationDetails(action) {
  try {
    const res = yield call(getAuthorizationsDetails, action.payload.authorizationId);
    var authorizationDetails = null;
    if (res.data.Authorizations[0] != undefined && res.data.Authorizations[0] != null) {
      var data = res.data.Authorizations[0];
      var lineItems = new Array();
      data.lineItemDetails.forEach(lineItem => {
        lineItems.push(new authorizationLineItem(lineItem, data.servicingFacilityDetails.organizationName, data.requestDate));
      }); (data.lineItemDetails)
      authorizationDetails = {
        authorizationHeader: {
          authorizationId: data.authorizationNumber,
          authorizationStatus: data.authorizationStatus,
          startDate: formatDate(data.fromDateofService),
          endDate: formatDate(data.thruDateofService),
        },
        patient: {
          id: data.memberId,
          type: data.placeofServiceDescription,
          firstName: data.firstName,
          lastName: data.lastName
        },
        renderingProvider: {
          name: data.servicingProviderOrganizationName
        },
        address: {
          addressLine1: data.servicingFacilityDetails.addressLine1,
          addressLine2: data.servicingFacilityDetails.addressLine2,
          city: data.servicingFacilityDetails.city,
          state: data.servicingFacilityDetails.state,
          zip: data.servicingFacilityDetails.zip
        },
        phonenumber: formatPhoneNumber(data.servicingFacilityDetails.phoneNumber),
        authorizationLine: lineItems
      };
    }
    yield put(actions.receiveAuthorizationDetails(authorizationDetails));
  } catch (e) {
    yield put(actions.errorAuthorizationDetails(e));
  }
}

function* watchAuthorizationDetailsSaga() {
  yield takeLatest(
    actionTypes.REQUEST_AUTHORIZATION_DETAILS,
    getAuthorizationDetails
  );
}

function* watchCustomerOOPSaga() {
  yield takeLatest(actionTypes.REQUEST_CUSTOMER_OOP, getCustomerOOPs);
}

export function* getCustomerOOPs(action) {
  try {
    const data = yield call(getCustomerOOP, action.payload);
    yield put(actions.receiveCustomerOOP(data));
  } catch (e) {
    yield put(actions.errorCustomerOOP(e));
  }
}

function* watchCoverageDataSaga() {
  yield takeLatest(actionTypes.REQUEST_COVERAGE_DATA, getCoverageData);
}

export function* getCoverageData(action) {
  try {
    const data = yield call(getCoverageBenefitsData, action.payload || null);
    yield put(actions.receiveCoverageDetails(data));
  } catch (e) {
    yield put(actions.errorCoverageDetails(e));
  }
}

export function* updatePcpDetail(action) {
  try {
    var res = yield call(getPcpDetails, action.payload.pcpDetails);

    if (res.data != undefined && res.data != null) {
      var updatePcp = res.data.status;
    }
    yield put(actions.receivePcpDetails(updatePcp));
  } catch (e) {
    yield put(actions.errorPcpDetails(e));
  }
}

function* watchUpdatePcpSaga() {
  yield takeLatest(actionTypes.REQUEST_PCP_UPDATE, updatePcpDetail);
}

export function* getPcpState(action) {
  try {
    var res = yield call(getPcpStatus, action.payload);

    if (res.data != undefined && res.data != null) {
      yield put(actions.receivePcpStatus(res.data));
    }
  } catch (e) {
    yield put(actions.errorPcpStatus(e));
  }
}

function* watchPcpStatusSaga() {
  yield takeLatest(actionTypes.REQUEST_PCP_STATUS, getPcpState);
}

function* watchCustomerInfoSaga() {
  yield takeLatest(actionTypes.REQUEST_CUSTOMER_INFO, getCustomerInfo);
}

export function* getCustomerInfo(action) {
  try {
    const data = yield call(getCustomerInfoData, action.payload);
    yield put(actions.receiveCustomerInfo(data));
  } catch (e) {
    yield put(actions.errorCustomerInfo(e));
  }
}

function* watchCustomerDemographicsInfoSaga() {
  yield takeLatest(actionTypes.REQUEST_CUSTOMER_DEMOGRAPHICS_INFO, getCustomerDemographicsInfo);
}

export function* getCustomerDemographicsInfo(action) {
  try {
    const data = yield call(getCustomerDemographicsInfoData, action.payload.memberId);
    yield put(actions.receiveCustomerDemographicsInfo(data));
  } catch (e) {
    yield put(actions.errorCustomerDemographicsInfo(e));
  }
}


function* watchFormsDocumentsDataSaga() {
  yield takeLatest(actionTypes.REQUEST_FORMS_DOCS, getFormsDocumentsData);
}

export function* getFormsDocumentsData(action) {
  try {
    const data = yield call(getFormsDocsData, action.payload || null);
    yield put(actions.receiveFormsDocs(data));
  } catch (e) {
    yield put(actions.errorFormsDocs(e));
  }
}

function* watchClaimsEOBSaga() {
  yield takeLatest(actionTypes.REQUEST_CLAIMS_EOB, getClaimsEOBs);
}

export function* getClaimsEOBs(action) {
  try {
    const data = yield call(getClaimsEOB, action.payload.memberId, action.payload.claimId);
    yield put(actions.receiveClaimsEOB(data));
  } catch (e) {
    yield put(actions.errorClaimsEOB(e));
  }
}

function* watchHraQuestionsSaga() {
  yield takeLatest(actionTypes.REQUEST_HRA_QUESTIONS, getHraQuestions);
}

export function* getHraQuestions(action) {
  try {
    const data = yield call(getHraQuestionsList, action.payload);
    yield put(actions.receiveHraQuestions(data));
  } catch (e) {
    yield put(actions.errorHraQuestions(e));
  }
}

export function* getDigitalIdCard(action) {
  try {
    const res = yield call(getDigitalIdCarda, action.payload.memberId);
    //if(res.data != undefined && res.data != null){
    //}
    yield put(actions.receiveDigitalIdCard(res.data));
  } catch (e) {
    yield put(actions.errorDigitalIdCard(e));
  }
}

export function* getPhysicalIdCard(action) {
  try {
    const res = yield call(getPhysicalIdCarda, action.payload.memberId);
    //if(res.data != undefined && res.data != null){
    //}
    yield put(actions.receivePhysicalIdCard(res.data));
  } catch (e) {
    yield put(actions.errorPhysicalIdCard(e));
  }
}

function* watchPhysicalIdCardSaga() {
  yield takeLatest(actionTypes.REQUEST_PHYSICAL_ID_CARD, getPhysicalIdCard);
}

function* watchDigitalIdCardSaga() {
  yield takeLatest(actionTypes.REQUEST_DIGITAL_ID_CARD, getDigitalIdCard);
}

function* watchSubmitHraSurvey() {
  yield takeLatest(actionTypes.REQUEST_SUBMIT_HRA_SURVEY, submitHraSurveys);
}

function* watchSubmitMailMemberIDCardForm() {
  yield takeLatest(actionTypes.REQUEST_SUBMIT_MAIL_MEMBER_ID_CARD_FORM, submitMailMemberIDCardForms);
}

function* watchGetMailMemberIDCardStatus() {
  yield takeLatest(actionTypes.REQUEST_MAIL_MEMBER_ID_CARD_STATUS, getMailMemberIDCardStatuss);
}

function* watchSubmitPreferredContactInfo() {
  yield takeLatest(actionTypes.REQUEST_PREFERRED_CONTACT_INFO_SUBMIT, submitPreferredContactInfos);
}

function* watchGetPreferenceCenterInfo() {
  yield takeLatest(actionTypes.REQUEST_PREFERENCE_CENTER_INFO, getPreferenceCenterInfos);
}

function* watchRequestMFACode() {
  yield takeLatest(actionTypes.REQUEST_MFA_CODE, requestMFACodea);
}

function* watchRequestUserMFACode() {
  yield takeLatest(actionTypes.REQUEST_USER_MFA_CODE, requestUserMFACodea);
}

function* watchRequestMFAFactors() {
  yield takeLatest(actionTypes.REQUEST_MFA_FACTORS, requestMFAFactor);
}

function* watchRequestRegister(){
  yield takeLatest(actionTypes.REQUEST_REGISTER,registerMember);
}

function* watchCreateUserNamePassword(){
  yield takeLatest(actionTypes.REQUEST_CREATE_USERNAME_PASSWORD,requestCreateUserNamePassword);
}


function* watchVerifyMFACode() {
  yield takeLatest(actionTypes.REQUEST_MFA_VERIFY, verifyTheMFACode);
}

function* watchVerifyUserMFACode() {
  yield takeLatest(actionTypes.REQUEST_USER_MFA_VERIFY, verifyTheUserMFACode);
}

export function* submitHraSurveys(action) {
  try {
    const data = yield call(submitHraSurvey, action.payload.response);
    return data
  } catch (e) {
    console.log('Failed submiting HRA Survey: ', e.message)
  }
}

export function* submitMailMemberIDCardForms(action) {
  try {
    const res = yield call(submitMailMemberIDCardForm, action.payload.response);
    if (res.status != 200) {
      yield put(actions.errorSubmitMailMemberIDCardForm(res));
    }
    else {
      yield put(actions.receiveSubmitMailMemberIDCardForm(res));
    }
  } catch (e) {
    yield put(actions.errorSubmitMailMemberIDCardForm(e));
  }
}
//submit claim details
function* watchSubmitClaimPayload() {
  yield takeLatest(actionTypes.REQUEST_SUBMIT_CLAIM_DETAILS, submitClaimPayload);
}

export function* submitClaimPayload(action) {
  try {
    const res = yield call(submitClaimPayloadApi, action.payload.data);
    if (res.status != 200) {
      yield put(actions.errorSubmitClaimDetails(res));
    }
    else {
      yield put(actions.receiveSubmitClaimDetails(res));
    }
  } catch (e) {
    yield put(actions.errorSubmitClaimDetails(e));
  }
}

function* watchSubmitAttestationAgreement() {
  yield takeLatest(actionTypes.REQUEST_SUBMIT_ATTESTATION_AGREEMENT, submitAttestationAgreement);
}

export function* submitAttestationAgreement(action) {
  try {
    const res = yield call(submitAttestationAgreementAPI, action.payload.data);
    if (res.status != 200) {
      yield put(actions.errorAttestationAgreement(res));
    }
    else {
      yield put(actions.receiveAttestationAgreement(res));
    }
  } catch (e) {
    yield put(actions.errorAttestationAgreement(e));
  }
}


export function* getMailMemberIDCardStatuss(action) {
  try {
    const res = yield call(getMailMemberIDCardStatus, action.payload.response);
    if (res.status != 200) {
      yield put(actions.errorMailMemberIDCardStatus(res));
    }
    else {
      yield put(actions.receiveMailMemberIDCardStatus(res));
    }
  } catch (e) {
    yield put(actions.errorMailMemberIDCardStatus(e));
  }
}

function* watchHraPartitialsListSaga() {
  yield takeLatest(actionTypes.REQUEST_HRA_PARTIALS, getHraPartialsList);
}

export function* getHraPartialsList(action) {
  try {
    const data = yield call(getHraPartials, action.payload);
    yield put(actions.receiveHraPartials(data));
  } catch (e) {
    yield put(actions.errorHraPartials(e));
  }
}

function* watchUserNameInfo() {
  yield takeLatest(actionTypes.GET_USERNAME, getUserInfo);
}
export function* getUserInfo(action) {
  try {
    const data = yield call(getUserName, action.payload);
    yield put(actions.updateUserName(data));
  } catch (e) {
    console.log('Could not Get UserName', e.message);
  }
}
function* watchChangeUserName() {
  yield takeLatest(actionTypes.REQUEST_CHANGE_USERNAME, receiveUserName);
}
export function* receiveUserName(action) {
  try {
    const data = yield call(changeUserName, action.payload);
    yield put(actions.receiveChangeUsername(data, action.payload.data));
  } catch (e) {
    console.log('Could not Update Username', e.message);
  }
}
function* watchChangePassword() {
  yield takeLatest(actionTypes.REQUEST_CHANGE_PASSWORD, receivePassword);
}
export function* receivePassword(action) {
  try {
    const data = yield call(changePassword, action.payload);
    yield put(actions.receiveChangePassword(data));
  } catch (e) {
    console.log('Could not Update Password', e.message);
  }
}
// MY HEALTH (NowPow)
function* watchCategoriesDataSaga() {
  yield takeLatest(actionTypes.REQUEST_CATEGORIES, getCategoriesData);
}

export function* getCategoriesData() {
  try {
    const data = yield call(getCategoriesApiData);
    yield put(actions.receiveCategories(data));
    try {
      let icons = data.map((categ) => {
        const elem = { id: categ.iconId, data: { icon: categ.icon } }
        return elem;
      });
      yield put(actions.updateIconById(icons));
    }
    catch (e) {
      yield put(actions.errorGetIcon(e));
    }
  } catch (e) {
    yield put(actions.errorCategories(e));
  }
}

function* watchGetCategDetailsDataSaga() {
  yield takeLatest(actionTypes.GET_CATEGORY_DETAILS, getCategDetailsData);
}


export function* getCategDetailsData(action) {
  try {
    const data = yield call(getCategDetails, action.payload);
    yield put(actions.updateCategoryDetails(data));
  } catch (e) {
    yield put(actions.errorCategoryDetails(e));
  }
}

function* watchGetCategDetailsAllDataSaga() {
  yield takeLatest(actionTypes.GET_CATEGORY_DETAILS_ALL, getCategDetailsAllData);
}

export function* getCategDetailsAllData(action) {
  try {
    const data = yield call(getCategDetailsAll, action.payload);
    yield put(actions.updateCategoryDetailsAll(data));
  } catch (e) {
    yield put(actions.errorCategoryDetailsAll(e));
  }
}

function* watchGetIndMapDetailsDataSaga() {
  yield takeLatest(actionTypes.GET_IND_MAP_DETAILS, getIndMapDetailsData);
}

export function* getIndMapDetailsData(action) {
  try {
    const data = yield call(getIndMapDetails, action.payload);
    yield put(actions.updateIndMapDetails(data));
  } catch (e) {
    yield put(actions.errorIndMapDetails(e));
  }
}

export function* submitPreferredContactInfos(action) {
  try {
    const res = yield call(submitPreferredContactInfo, action.payload.data, action.payload.csrf);
    if (res.status != 200) {
      yield put(actions.errorPreferredContactInfoSubmit(res));
    }
    else {
      yield put(actions.receivePreferredContactInfoSubmit(res));
    }
  } catch (e) {
    yield put(actions.errorPreferredContactInfoSubmit(e));
  }
}

export function* getPreferenceCenterInfos(action) {
  try {
    const res = yield call(getPreferenceCenterInfo, action.payload.response);
    if (res.status != 200) {
      yield put(actions.errorPreferenceCenterInfo(res));
    }
    else {
      yield put(actions.receivePreferenceCenterInfo(res));
    }
  } catch (e) {
    yield put(actions.errorPreferenceCenterInfo(e));
  }
}

export function* requestMFACodea(action) {
  try {
    const res = yield call(requestMFACode, action.payload.data, action.payload.mfaToken);
    if (res.status != 200) {
      yield put(actions.errorMFACode(res));
    }
    else {
      yield put(actions.receiveMFACode(res));
    }
  } catch (e) {
    yield put(actions.errorMFACode(e));
  }
}

export function* requestUserMFACodea(action) {
  try {
    const res = yield call(requestUserMFACode, action.payload.data, action.payload.mfaToken);
    if (res.status != 200) {
      yield put(actions.errorUserMFACode(res));
    }
    else {
      yield put(actions.receiveUserMFACode(res));
    }
  } catch (e) {
    yield put(actions.errorUserMFACode(e));
  }
}


export function* requestMFAFactor(action) { 
  try {
    const res = yield call(requestMFAFactors,action.payload.mfaToken);
    if (res.status != 200) {  
      yield put(actions.errorMFAFactors(res));
    }
    else {
      yield put(actions.receiveMFAFactors(res.data.data));
    }
  } catch (e) {
    yield put(actions.errorMFAFactors(e));
  }
}

export function* requestCreateUserNamePassword(action) { 
  try {
    const res = yield call(createUsernamePassword,action.payload.data,action.payload.mfaVerifiedAuth);
    if (res.status != 200) {   
      yield put(actions.errorCreateUserNamePassword(res.data));
    }
    else {
      
      yield put(actions.receiveCreateUserNamePassword(res.data));
    }
  } catch (e) {
    yield put(actions.errorCreateUserNamePassword(e));
  }
}

export function* registerMember(action){
  try {
    const res = yield call(requestRegister,action.payload.data,action.payload.mfaToken);
    if (res.status === 500) {   
      yield put(actions.errorRegister(res.data));
    }else if(res.status === 400){
      yield put(actions.errorRegister(res.data));
    }
    else if(res.status === 401){
      yield put(actions.receiveRegister(res.data.data.errorData));
    }
    else {
      yield put(actions.receiveRegister(res.data));
    }
  } catch (e) {
    yield put(actions.errorRegister(e));
  }
}

function* watchPhoneContactInfoDetails() {
  yield takeLatest(actionTypes.REQUEST_CONTACT_PHONE_INFO, getPhoneContactInfoDetails);
}

export function* getEmailContactInfoDetails(action) {
  try {
    const data = yield call(updateEmailContactInfo, action.payload);
    yield put(actions.receiveContactEmailInfo(data));
  } catch (e) {
    yield put(actions.errorContactEmailInfo(e));
  }
}
export function* getPhoneContactInfoDetails(action) {
  try {
    const data = yield call(updatePhoneContactInfo, action.payload);
    yield put(actions.receiveContactPhoneInfo(data));
  } catch (e) {
    yield put(actions.errorContactPhoneInfo(e));
  }
}
function* watchEmailContactInfoDetails() {
  yield takeLatest(actionTypes.REQUEST_CONTACT_EMAIL_INFO, getEmailContactInfoDetails);
}
export function* verifyTheMFACode(action) {
  try {
    const res = yield call(verifyMFACode, action.payload.data, action.payload.mfaToken,action.payload.channel);
    if (res.status != 200) {
      yield put(actions.errorMFAVerify(res));
    }
    else {
      yield put(actions.receiveMFAVerify(res.data.data));
    }
  } catch (e) {
    yield put(actions.errorMFAVerify(e));
  }
}
export function* verifyTheUserMFACode(action) {
  try {
    const res = yield call(verifyUserMFACode, action.payload.data, action.payload.mfaToken);
    if (res.status != 200) {
      yield put(actions.errorUserMFAVerify(res));
    }
    else {
      yield put(actions.receiveUserMFAVerify(res));
    }
  } catch (e) {
    yield put(actions.errorUserMFAVerify(e));
  }
}

function* watchGetCarouselItemsSaga() {
  yield takeLatest(actionTypes.REQUEST_CAROUSEL_ITEMS, getCarouselItems);
}

export function* getCarouselItems(action) {
  try {
    const data = yield call(getCarouselDetails, action.payload);
    yield put(actions.receiveCarouselItems(data));
  } catch (e) {
    yield put(actions.errorCarouselItems(e));
  }
}

function* watchGetPcpDetailsSaga() {
  yield takeLatest(actionTypes.REQUEST_PCP_DETAILS, getPcpDetailsData);
}

export function* getPcpDetailsData(action) {
  try {
    const data = yield call(getPcpData, action.payload);
    yield put(actions.receivePCPDetails(data));
  } catch (e) {
    yield put(actions.errorPCPDetails(e));
  }
}

//Report Error
function* watchReportError() {
  yield takeLatest(actionTypes.REPORT_ERROR, reportError)
}

export function* reportError(action) {
  try {
    yield call(reportErrorService, action.payload)
    yield put(actions.reportErrorSuccess())
  } catch (error) {
    yield put(actions.reportErrorSuccess())
  }
}


function* watchGetGlobalAlertsSaga() {
  yield takeLatest(actionTypes.REQUEST_GLOBAL_ALERTS, getAllGlobalAlerts);
}

export function* getAllGlobalAlerts(action) {
  try {
    const data = yield call(getGlobalAlerts, action.payload);
    yield put(actions.receiveGlobalAlerts(data));
  } catch (e) {
    yield put(actions.errorGlobalAlerts(e));
  }
}

function* watchGetOTCClaimReimbursementData(){
  yield takeLatest(actionTypes.REQUEST_OTC_CLAIM_REIMBURSEMENT_DATA,getAllOTCClaimReimbursementData)
}

export function* getAllOTCClaimReimbursementData(action){
  try{
    const data = yield call(getOTCClaimReimbursementData,action.payload);
    yield put (actions.receiveOTCClaimReimbursementData(data));
  }catch(e){
    yield put(actions.errorOTCClaimReimbursementData(e));
  }
}


function* watchAddMembershipSaga() {
  yield takeLatest(actionTypes.REQUEST_ADD_MEMBERSHIP, addMembershipDetails);
}

export function* addMembershipDetails(action) {
  try {
    const res = yield call(addMbrshipDetails, action.payload);
    if (res.status != 200) {
      yield put(actions.errorAddMembership(res.data.message));
    }
    else {
      yield put(actions.receiveAddMembership(res.data.message));
    }
  } catch (e) {
    yield put(actions.errorAddMembership(e));
  }
}

function* watchSelectPlanSaga() {
  yield takeLatest(actionTypes.REQUEST_SELECT_PLAN, submitSelectPlan);
}

export function* submitSelectPlan(action) {
  try {
    const res = yield call(submitPlanForExternalLink, action.payload);
    if (res.status === "ok") {
      yield put(actions.receiveSelectPlan(res.status));
    }else {
      yield put(actions.errorSelectPlan(res.data.message));
    }
  } catch (e) {
    yield put(actions.errorSelectPlan(e));
  }
}

// OTC Card
function* watchGetOTCProfileSaga() {
  yield takeLatest(actionTypes.REQUEST_OTC_PROFILE, getOTCProfileData);
}

export function* getOTCProfileData() {
  try {
    const data = yield call(getOTCProfile);
    yield put(actions.receiveOTCProfile(data));
  } catch (e) {
    yield put(actions.errorOTCProfile(e));
  }
}

export function* requestForgotUsername(action) {
  try {
    const res = yield call(forgotUsername, action.payload.data, action.payload.mfaToken);
    if (res.status === 200) {
      yield put(actions.receiveForgotUsername(res));
    }
    else {
      yield put(actions.errorForgotUsername(res));
    }
  } catch (e) {
    yield put(actions.errorForgotUsername(e));
  }
}

function* watchForgotUsernameSaga() {
  yield takeLatest(actionTypes.REQUEST_FORGOT_USERNAME, requestForgotUsername);
}

export function* requestForgotPassword(action) {
  try {
    const res = yield call(forgotPassword, action.payload.data, action.payload.mfaToken);
    if (res.status === 200) {
      yield put(actions.receiveForgotPassword(res));
    }
    else {
      yield put(actions.errorForgotPassword(res));
    }
  } catch (e) {
    yield put(actions.errorForgotPassword(e));
  }
}

function* watchForgotPasswordSaga() {
  yield takeLatest(actionTypes.REQUEST_FORGOT_PASSWORD, requestForgotPassword);
}

export function* requestSetPassword(action) {
  try {
    const res = yield call(setPassword, action.payload.data, action.payload.mfaToken);
    if (res.status === 200) {
      yield put(actions.receiveSetPassword(res));
    }
    else {
      yield put(actions.errorSetPassword(res));
    }
  } catch (e) {
    yield put(actions.errorSetPassword(e));
  }
}

function* watchSetPasswordSaga() {
  yield takeLatest(actionTypes.REQUEST_SET_PASSWORD, requestSetPassword);
}
// GET DOCUMENTS
function* watchDocumentsSaga() {
  yield takeLatest(actionTypes.GET_DOCUMENT_LIST, getDocumentsData);
}

export function* getDocumentsData(payload) {  
  try {
    const data = yield call(getDocuments, payload);
    yield put(actions.receiveDocumentsList(data));
  } catch (e) {
    yield put(actions.errorDocumentsList(e));
  }
}

// GET DOCUMENT FILE
function* watchDocumentFileSaga() {
  yield takeLatest(actionTypes.GET_DOCUMENT, getDocumentFileData);
}


export function* getDocumentFileData(payload) {  
  try {
    const data = yield call(getDocumentFile, payload);
    yield put(actions.receivedDocumentFile(data));
  } catch (e) {
    yield put(actions.errorDocumentFile(e));
  }
}

// GET DOCUMENTS
function* watchVerifyAddressSaga() {
  yield takeLatest(actionTypes.REQUEST_VERIFY_ADDRESS, getVerifyAddress);
}

export function* getVerifyAddress(payload) {  
  try {
    const data = yield call(verifyAddress, payload);
    yield put(actions.receiveVerifyAddress(data));
  } catch (e) {
    yield put(actions.errorVerifyAddress(e));
  }
}

export default function* rootSaga() {
  yield all([
    watchClaimListSaga(),
    watchClaimDetailsSaga(),
    watchAuthorizationListSaga(),
    watchAuthorizationDetailsSaga(),
    watchCustomerOOPSaga(),
    watchCoverageDataSaga(),
    watchCustomerInfoSaga(),
    watchCustomerDemographicsInfoSaga(),
    watchFormsDocumentsDataSaga(),
    watchClaimsEOBSaga(),
    watchPcpStatusSaga(),
    watchUpdatePcpSaga(),
    watchHraQuestionsSaga(),
    watchPhysicalIdCardSaga(),
    watchDigitalIdCardSaga(),
    watchSubmitHraSurvey(),
    watchHraPartitialsListSaga(),
    watchUserNameInfo(),
    watchChangeUserName(),
    watchChangePassword(),
    watchSubmitMailMemberIDCardForm(),
    watchCategoriesDataSaga(),
    watchGetCategDetailsDataSaga(),
    watchGetIndMapDetailsDataSaga(),
    watchGetCategDetailsAllDataSaga(),
    watchSubmitClaimPayload(),
    watchEmailContactInfoDetails(),
    watchGetPcpDetailsSaga(),
    watchPhoneContactInfoDetails(),
    watchGetMailMemberIDCardStatus(),
    watchGetCarouselItemsSaga(),
    watchAddMembershipSaga(),
    watchSubmitAttestationAgreement(),
    watchSubmitPreferredContactInfo(),
    watchGetPreferenceCenterInfo(),
    watchRequestMFACode(),
    watchRequestUserMFACode(),
    watchRequestMFAFactors(),
    watchRequestRegister(),
    watchCreateUserNamePassword(),
    watchVerifyMFACode(),
    watchVerifyUserMFACode(),
    watchGetGlobalAlertsSaga(), 
    watchSelectPlanSaga(),
    watchReportError(),
    watchGetOTCProfileSaga(),
    watchForgotUsernameSaga(),
    watchForgotPasswordSaga(),
    watchSetPasswordSaga(),
    watchDocumentsSaga(),
    watchDocumentFileSaga(),
    watchGetOTCClaimReimbursementData(),
    watchVerifyAddressSaga()
  ]);
}
