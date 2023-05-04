import axios from "axios";
import { LOFLv2 } from '../../utils/api/loflv2';

export const getClaimsList = async () => {
  return LOFLv2(true).get('claims');
};

export const getClaimsDetails = async (memberId, claimId) => {
  return LOFLv2(true).get(`claims/${memberId}/${claimId}`);
};

export const getClaimsEOB = async (memberId, claimId) => {
  try {
    const res = await LOFLv2(true).get(`claims/eob/${memberId}/${claimId}`);
    return res.data;
  } catch (err) {
    console.log(err.message);
  }
};

export const getAuthorizationList = async () => {
  return LOFLv2(true).get('auths');
};

export const getPhysicalIdCarda = async (memberId) => {
  return LOFLv2(true).get('physical-id-card/' + memberId);
};

export const getDigitalIdCarda = async (memberId) => {
  return LOFLv2(true).get('digital-id-card/' + memberId);
};

export const getAuthorizationsDetails = async (selectedAuth) => {
  return LOFLv2(true).get('auths/' + selectedAuth.authorizationId);
};

export const getCustomerOOP = async () => {
  try {
    const res = await LOFLv2(true).get('oop');
    return res.data;
  } catch (err) {
    console.log(err.message)
  }
};

export const getPcpStatus = async (memberId) => {
  try {
    const res = await LOFLv2(true).get(`pcp/${memberId}/status`);
    return res.data;
  } catch (err) {
    console.log(err.message)
  }
};

export const getPcpDetails = async (pcpDetails) => {
  try {
    const res = await LOFLv2(true).patch('pcp', pcpDetails);
    return res.data;
  } catch (err) {
    console.log(err.message)
  }
};

/*
export const getCustomerLOB = async () => {
  try {
    const res = await axios.get('lob');
    return res.data;
  } catch (err) {
    console.log(err.message)
  }
};
*/

export const getCoverageBenefitsData = async (memberId) => {
  try {
    const res = await LOFLv2(true).get(`coverage-details/${memberId}`);
    return res.data;
  } catch (err) {
    console.log(err.message)
  }
};

export const getCustomerInfoData = async () => { // Need to defer to Igor
  try {
    const res = await LOFLv2(true).get('/customer-info');
    return res.data;
  } catch (err) {
    console.log(err.message)
    throw new Error(err);
  }
};

export const getCustomerDemographicsInfoData = async (memberId) => {
  try {
    const res = await LOFLv2(true).get(`/customer-contact/${memberId}`);
    return res.data;
  } catch (err) {
    console.log(err.message)
  }
};

export const getFormsDocsData = async (memberId) => {
  try {
    const res = await LOFLv2(true).get(`forms-docs/${memberId}`);
    return res.data;
  } catch (err) {
    console.log(err.message)
  }
};

export const getHraQuestionsList = async (memberId) => {
  try {
    const res = await LOFLv2(true).get(`/hra-list/${memberId}`);
    return res.data[0];
  } catch (err) {
    console.log(err.message)
  }
};

export const submitHraSurvey = async (data) => {
  try {
    const res = await LOFLv2(true).post(`/hra-submit`, data);
    return res.data
  } catch (err) {
    console.log(err.message)
  }
};

export const getHraStatus = async (memberId) => {
  try {
    const res = await LOFLv2(true).get(`/hra-status/${memberId}`)
    return res.data;
  } catch (err) {
    console.log(err.message)
  }
}

export const getHraPartials = async (memberId) => {
  try {
    const res = await LOFLv2(true).get(`/hra-surveys/${memberId}`);
    return res.data;
  } catch (err) {
    console.log(err)
  }
}

export const saveHraSurveyResponseToDB = async (data) => {
  try {
    const config = {
      'Content-Type': 'application/json'
    }
    const res = await LOFLv2(true).post('/hra-surveys', data, config);
    return res.data;
  } catch (err) {
    console.log(err.message)
  }
}

export const getHraStatuses = async (headOfHouseholdMemberId, dependents) => {
  try {
    const calls = []
    // create list of calls to check status for
    calls.push(LOFLv2(true).get(`/hra-status/${headOfHouseholdMemberId}`))
    dependents.forEach(dep => {
      calls.push(LOFLv2(true).get(`/hra-status/${dep.memberId}`))
    })

    const allData = await Promise.all(calls);
    return allData;
  } catch (err) {
    console.log(err.message)
  }
}

export const submitMailMemberIDCardForm = async (data) => {
  try {
    const res = await LOFLv2(true).post('/mail-member-id-card-form', data);
    return res;
  } catch (err) {
    return err.response;
  }
};

export const submitClaimPayloadApi = async (data) => {
  try {
    const res = await LOFLv2(true).post('/claims', data);
    return res;
  } catch (err) {
    return err.response;
  }
};

export const submitAttestationAgreementAPI = async (data) => {
  try {
    const res = await LOFLv2(true).post('/user-agreement', data);
    return res;
  } catch (err) {
    return err.response;
  }
};

export const getMailMemberIDCardStatus = async (memberId) => {
  try {
    const res = await LOFLv2(true).get('/mail-member-id-card-status/' + memberId);
    return res;
  } catch (err) {
    return err.response;
  }
};

export const getHraStatusesLocalOnly = async (memberIds) => {
  try {
    const calls = []
    // create list of calls to check status for
    memberIds.forEach(id => {
      calls.push(LOFLv2(true).get(`/hra-status-local/${id}`))
    })

    const allData = await Promise.all(calls);
    return allData;
  } catch (err) {
    console.log(err.message)
  }
}

export const getMemberAnswers = async (memberIdsList) => {
  try {
    const calls = []
    // create list of calls
    memberIdsList.forEach(memberId => calls.push(LOFLv2(true).get(`/hra-surveys/${memberId}`)))
    const allData = await Promise.all(calls);
    return allData.map(data => data.data);
  } catch (err) {
    console.log('Error catched: ', err.message)
  }
}

export const getAllRecomendedResources = async (dataPairList) => {
  try {
    const calls = []
    // create list of calls
    dataPairList.forEach(pair => calls.push(LOFLv2(true).get(`/hra-resources/${pair.questionareId}/${pair.companyCode}/${pair.memberId}`)))
    const allData = await Promise.all(calls);
    return allData.map(data => data.data);
  } catch (err) {
    console.log('Error catched: ', err.message)
  }
}

// MY HEALTH (NowPow)

export const getCategoriesApiData = async () => {
  try {
    const res = await LOFLv2(true).get('/community-resources/categories');
    return res.data;
  } catch (err) {
    throw new Error(err.message)
    console.log("getCategoriesApiData Error caught: ", err.message)
  }
}

export const getCategDetails = async (data) => {
  const formData = new FormData()
  formData.append("address", data.address);
  formData.append("categoryId", data.categoryId);
  formData.append("categoryIconId", data.categoryIconId);
  formData.append("categoryName", data.categoryName);
  formData.append("lat", data.lat);
  formData.append("lon", data.lon);
  
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": data.csrf,
    }
  }
  
  try {
    const res = await LOFLv2(true).post('/community-resources/sub-categories', formData, config);
    return res.data;
  } catch (err) {
    console.log(err.message)
  }
}

export const getCategDetailsAll = async (data) => {
  const formData = new FormData()
  formData.append("address", data.address);
  formData.append("categoryId", data.categoryId);
  formData.append("categoryIconId", data.categoryIconId);
  formData.append("categoryName", data.categoryName);
  formData.append("resourceTypeId", data.resourceTypeId);
  formData.append("resourceTypeName", data.resourceTypeName);
  formData.append("lat", data.lat);
  formData.append("lon", data.lon);

  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": data.csrf,
    }
  }

  try {
    const res = await LOFLv2(true).post('/community-resources/resources', formData, config);
    return res.data;
  } catch (err) {
    console.log(err.message)
  }
}

export const getIndMapDetails = async (data) => {
  const formData = new FormData()
  formData.append("categoryId", data.categoryId);
  formData.append("categoryIconId", data.categoryIconId);
  formData.append("resourceTypeId", data.resourceTypeId);
  formData.append("resourceId", data.resourceId);
  formData.append("lat", data.lat);
  formData.append("lon", data.lon);

  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": data.csrf,
    }
  }

  try {
    const res = await LOFLv2(true).post('/community-resources/resource-details', formData, config);
    return res.data;
  } catch (err) {
    console.log(err.message)
  }
}


  export const getCarouselDetails = async () => {
    const res = await LOFLv2(true)('carousel');
    return res.data;
  }

  export const getPcpData = async (data) => {
    const res =  await LOFLv2(true).get(`/pcp/${data.memberId}`);
    return res.data;
  }

  export const addMbrshipDetails = async (membershipDetails) => {
    try {
        const config = {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": membershipDetails.csrf,
        }
    
        const res = await LOFLv2(true).post('/attach-membership', membershipDetails.data, config);
        return res;
      } catch (err) {
        return err.response;

      }
  }


 
export const submitPreferredContactInfo = async (data, csrf) => {
  try {
    const config = {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrf,
    }

    const res = await LOFLv2(true).put('/preference/contacts', data, config);
    return res;
  } catch (err) {
    return err.response;
  }
};

export const getPreferenceCenterInfo = async () => {
  try {
    const res = await LOFLv2(true).get('/preference/contacts');
    return res;
  } catch (err) {
    return err.response;
  }
};


export const requestMFACode = async (data, mfaToken) => {
  try {
    let res = null;
    const config = {
      headers: {
        "Content-Type": "application/json",
        "mfaAuthorization": mfaToken,
      }
    }
    res = await LOFLv2(false).post('/mfa/send/'+data.type, null, config);

    return res;
  } catch (err) {
    return err.response;
  }
};

export const requestUserMFACode = async (data, mfaToken) => {
  try {
    let res = null;
    const config = {
      headers: {
        "Content-Type": "application/json",
      }
    }
    res = await LOFLv2(true).post('settings/resend-verification-code', data, config);

    return res;
  } catch (err) {
    return err.response;
  }
};

export const requestRegister = async(data,mfaToken) =>{
  try{
    const config = {
      headers: {
        "Content-Type": "application/json",
        "mfaAuthorization": mfaToken,
      }
    }
    const res = await LOFLv2(true).post('register',data,config);
    return res.data;
  }catch (err) {
    console.log("requestRegistererror",err);
    return err.response;
  }
}


export const requestMFAFactors = async(mfaToken) =>{
  try{
    const config = {
      headers: {
        "mfaAuthorization": mfaToken,
      }
    }
    const res = await LOFLv2(true).get('mfa/channels',config);
    return res;
  }catch(err){
    return err.response
  }
}

export const verifyMFACode = async (data, mfaToken,channel) => {
  try {
    const config = {
      headers: {
        "mfaAuthorization": mfaToken,
      }
    }
    const res = await LOFLv2(true).post('mfa/verify/'+channel,data,config);
    return res;
  } catch (err) {
    return err.response;
  }
};

export const verifyUserMFACode = async (data, mfaToken) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      }
    }
    const res = await LOFLv2(true).post('verify-code',data,config);
    return res;
  } catch (err) {
    return err.response;
  }
};

export const createUsernamePassword = async (data,mfaVerifiedAuth) => {
  try {
    const config = {
      headers: {
        "mfaAuthorization": mfaVerifiedAuth,
      }
    }
    const res = await LOFLv2(true).post('create-username-password',data,config);
    return res;
  } catch (err) {
    return err.response;
  }
};

// Global Alerts
export const getGlobalAlerts = async () => {
  try {
    const res = await LOFLv2(true).get(`global-alerts`);
    return res.data;
  } catch (err) {
  }
}

//why do we need an api call to get username?
export const getUserName = async () => {
  return await LOFLv2(true).get('settings/getUserName');
};

//we can remove the passing of csrf
export const changeUserName = async ({ data, csrf }) => {
  // const config = {
  //   headers: {
  //     "Content-Type": "application/json",
  //     "X-CSRF-TOKEN": csrf
  //   }
  // }
  const res = await LOFLv2(true).post('change-username', data);
  return res.data;
};

//we can remove the passing of csrf
export const changePassword = async ({ data, csrf }) => {
  // const config = {
  //   headers: {
  //     "Content-Type": "application/json",
  //     "X-CSRF-TOKEN": csrf
  //   }
  // }
  const res = await LOFLv2(true).post('change-password', data);
  return res.data;
};

export const updateEmailContactInfo = async (email) => {
  const res = await LOFLv2(true).post('change-email', email);
  return res.data;
};

export const updatePhoneContactInfo = async (phoneNum) => {
  const res = await LOFLv2(true).post('change-phone', phoneNum);
  return res.data;
};

export const verifyPhoneContactInfo = async (payload, authenticated = false) => {
  return await LOFLv2(authenticated).post('settings/resend-verification-code', payload).then((response) => response.data);
};

export const verifyEmailContactInfo = async (payload, authenticated = false) => {
  return await LOFLv2(authenticated).post('settings/resend-verification-code', payload).then((response) => response.data);
};

export const verifyContactInfo = async (payload) => {
  return await LOFLv2(true).post('verify-code', payload).then((response) => response.data);
};

export const resendCodeContactInfo = async (payload, csrf) => {
  // const config = {
  //   headers: {
  //     "Content-Type": "application/json",
  //     "X-CSRF-TOKEN": csrf
  //   }
  // }
  const res = await LOFLv2(true).post('settingsResendVerificationCode', payload);
  return res.data;
};

export const reportErrorService = async (membershipKey) => {
  return await LOFLv2(true).post('/report-membership', membershipKey)
}

//sam to deliver today
export const submitPlanForExternalLink = async (payload) => {
  return await axios.get(`/selectPlan/${payload.membershipKey}`)
}

export const getCoverageBenefitsVideos = async (language, companyCode, benefitPackage, membershipStatus) => {
  const res = await LOFLv2(true).get(`/videos/medicare/${language}?companyCode=${companyCode}&benefitPackage=${benefitPackage}&membershipStatus=${membershipStatus}`);
  return res.data;
}

export const getOTCProfile = async () => {
  try {
    const res = await LOFLv2(true).get(`/otc/profile`);
    return res.data;
  } catch (err) {
      console.log('getOTCCardStatus Error caught: ', err.message)
  }
}

export const activateOTCCard = async (cardNumber) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }
    const data = { cardNumber }
    const res = await LOFLv2(true).post(`/otc/activate-card`, data, config);
    return { status: res.status, data: res.data};
  } catch (err) {
    console.log('activateOTCCard Error caught: ', err.message)
    return { status: err.response.status, data: err.response.data};
  }
}

export const getOTCCardMeta = async () => {
  try {
    const res = await LOFLv2(true).get(`/otc/card-meta`);
    return res.data;
  } catch (err) {
      console.log('activateOTCCard Error caught: ', err.message)
  }
}

export const getOTCClaimReimbursementData = async () => {
  try {
    const res = await LOFLv2(true).get(`/otc/claim-reimbursement-form`);
    return res.data;
  } catch (err) {
      console.log('ClaimReimbursementForm Error caught: ', err.message)
  }
} 

export const forgotUsername = async (data, mfaToken="") => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "mfaAuthorization": mfaToken
      }
    }

    const res = await LOFLv2(false).post('/forgot-username', data, config);
    // return res.data;
    return { status: res.status, data: res.data.data};
  } catch (err) {
    console.log('forgot-username Error caught: ', err.message)
    return err.response;
  }
}

export const forgotPassword = async (data, mfaToken="") => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "mfaAuthorization": mfaToken
      }
    }

    const res = await LOFLv2(false).post('/forgot-password', data, config);
    return { status: res.status, data: res.data.data};
  } catch (err) {
    console.log('forgot-password Error caught: ', err.message)
    return err.response;
  }
}

export const setPassword = async (data, mfaToken="") => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "mfaAuthorization": mfaToken
      }
    }

    const res = await LOFLv2(false).post('/set-password', data, config);
    return { status: res.status, data: res.data.data};
  } catch (err) {
    console.log('set-password Error caught: ', err.message)
    return err.response;
  }
}

// need to convert to V2
export const getDocuments = async (data) => {

  const { memberId, type, startDate, endDate, companyCode, benefitPackage, featureconfig } = data.payload;
  
  const docTypes = type.join(',');

  return new Promise((res, rej) => {

      const docs = LOFLv2(true).get("/documents", { params: {
        documentPropValue1: memberId,
        documentDateFrom: (startDate ? startDate : undefined),
        documentDateTo: (endDate ? endDate : undefined),
        documentTypes: docTypes,
        includeSensitive: featureconfig.INCLUDE_SENSITIVE_DOCS ? 'true' : 'false',
        showCorrespondence: featureconfig.SHOW_ONLY_CORRESPONDENCE ? 'true' : 'false',
        maxRecords: featureconfig.MAX_RECORDS ? featureconfig.MAX_RECORDS : 1000,
        companyCode: companyCode,
        benefitPackage: benefitPackage
      }
    });

    res(docs);

  })
};


export const getDocumentFile = async (data) => {
  const { docId, isNodeId } = data.payload;
  return new Promise((res, rej) => {
      const doc = LOFLv2(true).get(`/document/${docId}`, { 
          params: {
            isNodeId: isNodeId
          }
      });
      res(doc);
  })
};

