import axios from "axios";
import { LOFLv2 } from '../../utils/api/loflv2';

export const sendErrorLog = async (error) => {
  if(!error) throw new Error('Error is missing. Please provide error.');

  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      }
    }

    const clientDetails = {
      userAgent: navigator.userAgent,
      cookieEnabled: navigator.cookieEnabled,
    }

    const payload = {
      errorMessage: error.message,
      errorPage: window.location.href,
      clientDetails
    }

    const res = await LOFLv2(true).post('/report', payload, config);
    return res.data;
  } catch (error) {
    console.error('Error logging error: ', error.message)
    return error.message;
  }
};

export const getClaimsList = async () => {
  try {
    return LOFLv2(true).get('claims');
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const getClaimsDetails = async (memberId, claimId) => {
  try {
    return LOFLv2(true).get(`claims/${memberId}/${claimId}`);
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const getClaimsEOB = async (memberId, claimId) => {
  try {
    const res = await LOFLv2(true).get(`claims/eob/${memberId}/${claimId}`);
    return res.data;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const getAuthorizationList = async () => {
  try {
    return LOFLv2(true).get('auths');
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const getPhysicalIdCarda = async (memberId) => {
  try {
    return LOFLv2(true).get('physical-id-card/' + memberId);
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const getDigitalIdCarda = async (memberId) => {
  try {
    return LOFLv2(true).get('digital-id-card/' + memberId);
  } catch (error) {
    try {
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const getAuthorizationsDetails = async (selectedAuth) => {
  try {
    return LOFLv2(true).get('auths/' + selectedAuth.authorizationId);
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const getCustomerOOP = async () => {
  try {
    const res = await LOFLv2(true).get('oop');
    return res.data;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const getPcpStatus = async (memberId) => {
  try {
    const res = await LOFLv2(true).get(`pcp/${memberId}/status`);
    return res.data;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const getPcpDetails = async (pcpDetails) => {
  try {
    const res = await LOFLv2(true).patch('pcp', pcpDetails);
    return res.data;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
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
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const getCustomerInfoData = async () => { // Need to defer to Igor
  try {
    const res = await LOFLv2(true).get('/customer-info');
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCustomerDemographicsInfoData = async (customerId) => {
  try {
    const res = await LOFLv2(true).get(`/customer-contact/${customerId}`);
    return res.data;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const getFormsDocsData = async (memberId) => {
  try {
    const res = await LOFLv2(true).get(`forms-docs/${memberId}`);
    return res.data;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const getHraQuestionsList = async (memberId) => {
  try {
    const res = await LOFLv2(true).get(`/hra-list/${memberId}`);
    return res.data[0];
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const submitHraSurvey = async (data) => {
  try {
    const res = await LOFLv2(true).post(`/hra-submit`, data);
    return res.data
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const getHraStatus = async (memberId) => {
  try {
    const res = await LOFLv2(true).get(`/hra-status/${memberId}`)
    return res.data;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
}

export const getHraPartials = async (memberId) => {
  try {
    const res = await LOFLv2(true).get(`/hra-surveys/${memberId}`);
    return res.data;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
}

export const saveHraSurveyResponseToDB = async (data) => {
  try {
    const config = {
      'Content-Type': 'application/json'
    }
    const res = await LOFLv2(true).post('/hra-surveys', data, config);
    return res.data;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
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
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
}

export const submitMailMemberIDCardForm = async (data) => {
  try {
    const res = await LOFLv2(true).post('/mail-member-id-card-form', data);
    return res;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
      return error.response;
    } catch (err) {
      console.error('Error logging error: ', err.message)
      return error.response;
    }
  }
};

export const submitClaimPayloadApi = async (data) => {
  try {
    const res = await LOFLv2(true).post('/claims', data);
    return res;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
      return error.response;
    } catch (err) {
      console.error('Error logging error: ', err.message)
      return error.response;
    }
  }
};

export const submitAttestationAgreementAPI = async (data) => {
  try {
    const res = await LOFLv2(true).post('/user-agreement', data);
    return res;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
      return error.response;
    } catch (err) {
      console.error('Error logging error: ', err.message)
      return error.response;
    }
  }
};

export const getMailMemberIDCardStatus = async (memberId) => {
  try {
    const res = await LOFLv2(true).get('/mail-member-id-card-status/' + memberId);
    return res;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
      return error.response;
    } catch (err) {
      console.error('Error logging error: ', err.message)
      return error.response;
    }
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
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
}

export const getMemberAnswers = async (memberIdsList) => {
  try {
    const calls = []
    // create list of calls
    memberIdsList.forEach(memberId => calls.push(LOFLv2(true).get(`/hra-surveys/${memberId}`)))
    const allData = await Promise.all(calls);
    return allData.map(data => data.data);
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
}

export const getAllRecomendedResources = async (dataPairList) => {
  try {
    const calls = []
    // create list of calls
    dataPairList.forEach(pair => calls.push(LOFLv2(true).get(`/hra-resources/${pair.questionareId}/${pair.companyCode}/${pair.memberId}`)))
    const allData = await Promise.all(calls);
    return allData.map(data => data.data);
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
}

// MY HEALTH (NowPow)

export const getCategoriesApiData = async () => {
  try {
    const res = await LOFLv2(true).get('/community-resources/categories');
    return res.data;
  } catch (error) {
    throw new Error(error.message)
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
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
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
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
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
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
}


  export const getCarouselDetails = async (payload) => {
    try {
      const res = await LOFLv2(true).get(`carousel`,{ params: {
        memberships: payload.memberships,
      }});
      return res.data;
    } catch (error) {
      try {
        console.error('Error logging error: ', error.message)
        await sendErrorLog(error)
      } catch (error) {
        console.error('Error logging error: ', error.message)
      }
    }
  }

  export const getPcpData = async (data) => {
    try {
      const res =  await LOFLv2(true).get(`/pcp/${data.memberId}`);
      return res.data;
    } catch (error) {
      try {
        console.error('Error logging error: ', error.message)
        await sendErrorLog(error)
      } catch (error) {
        console.error('Error logging error: ', error.message)
      }
    }
  }

  export const addMbrshipDetails = async (membershipDetails) => {
    try {
        const config = {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": membershipDetails.csrf,
        }
    
        const res = await LOFLv2(true).post('/attach-membership', membershipDetails.data, config);
        return res;
      } catch (error) {
        try {
          console.error('Error logging error: ', error.message)
          await sendErrorLog(error)
          return error.response;
        } catch (err) {
          console.error('Error logging error: ', err.message)
          return error.response;
        }
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
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
      return error.response;
    } catch (err) {
      console.error('Error logging error: ', err.message)
      return error.response;
    }
  }
};

export const getPreferenceCenterInfo = async () => {
  try {
    const res = await LOFLv2(true).get('/preference/contacts');
    return res;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
      return error.response;
    } catch (err) {
      console.error('Error logging error: ', err.message)
      return error.response;
    }
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
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
      return error.response;
    } catch (err) {
      console.error('Error logging error: ', err.message)
      return error.response;
    }
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
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
      return error.response;
    } catch (err) {
      console.error('Error logging error: ', err.message)
      return error.response;
    }
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
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
      return error.response;
    } catch (err) {
      console.error('Error logging error: ', err.message)
      return error.response;
    }
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
  } catch(error){
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
      return error.response;
    } catch (err) {
      console.error('Error logging error: ', err.message)
      return error.response;
    }
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
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
      return error.response;
    } catch (err) {
      console.error('Error logging error: ', err.message)
      return error.response;
    }
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
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
      return error.response;
    } catch (err) {
      console.error('Error logging error: ', err.message)
      return error.response;
    }
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
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
      return error.response;
    } catch (err) {
      console.error('Error logging error: ', err.message)
      return error.response;
    }
  }
};

// Global Alerts
export const getGlobalAlerts = async () => {
  try {
    const res = await LOFLv2(false).get(`global-alerts`);
    return res.data;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
      return error.response;
    } catch (err) {
      console.error('Error logging error: ', err.message)
      return error.response;
    }
  }
}

//why do we need an api call to get username?
export const getUserName = async () => {
  try {
    return await LOFLv2(true).get('settings/getUserName');
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

//we can remove the passing of csrf
export const changeUserName = async ({ data, csrf }) => {
  try {
    // const config = {
    //   headers: {
    //     "Content-Type": "application/json",
    //     "X-CSRF-TOKEN": csrf
    //   }
    // }
    const res = await LOFLv2(true).post('change-username', data);
    return res.data;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

//we can remove the passing of csrf
export const changePassword = async ({ data, csrf }) => {
  try {
    // const config = {
    //   headers: {
    //     "Content-Type": "application/json",
    //     "X-CSRF-TOKEN": csrf
    //   }
    // }
    const res = await LOFLv2(true).post('change-password', data);
    return res.data;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const updateEmailContactInfo = async (email) => {
  try {
    const res = await LOFLv2(true).post('change-email', email);
    return res.data;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const updatePhoneContactInfo = async (phoneNum) => {
  try {
    const res = await LOFLv2(true).post('change-phone', phoneNum);
    return res.data;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const verifyPhoneContactInfo = async (payload, authenticated = false) => {
  try {
    return await LOFLv2(authenticated).post('settings/resend-verification-code', payload).then((response) => response.data);
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const verifyEmailContactInfo = async (payload, authenticated = false) => {
  try {
    return await LOFLv2(authenticated).post('settings/resend-verification-code', payload).then((response) => response.data);
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const verifyContactInfo = async (payload) => {
  try {
    return await LOFLv2(true).post('verify-code', payload).then((response) => response.data);
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
      return error.response;
    } catch (error) {
      return error.response;
      console.error('Error logging error: ', error.message)
      return error.response;
    }
  }
};

export const resendCodeContactInfo = async (payload, csrf) => {
  try {
    // const config = {
    //   headers: {
    //     "Content-Type": "application/json",
    //     "X-CSRF-TOKEN": csrf
    //   }
    // }
    const res = await LOFLv2(true).post('settings/resend-verification-code', payload);
    return res.data;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const reportErrorService = async (membershipKey) => {
  try {
    return await LOFLv2(true).post('/report-membership', membershipKey)
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
}

//sam to deliver today
export const submitPlanForExternalLink = async (payload) => {
  try {
    const res = await LOFLv2(true).get(`/select-plan/${payload.membershipKey}`);
    return res;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
}

export const getCoverageBenefitsVideos = async (language, companyCode, benefitPackage, membershipStatus) => {
  try {
    const res = await LOFLv2(true).get(`/videos/medicare/${language}?companyCode=${companyCode}&benefitPackage=${benefitPackage}&membershipStatus=${membershipStatus}`);
    return res.data;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
}

export const getOTCProfile = async () => {
  try {
    const res = await LOFLv2(true).get(`/otc/profile`);
    return res.data;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
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
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
      return { status: error.response.status, data: error.response.data};
    } catch (err) {
      console.error('Error logging error: ', err.message)
      return { status: error.response.status, data: error.response.data};
    }
  }
}

export const getOTCCardMeta = async () => {
  try {
    const res = await LOFLv2(true).get(`/otc/card-meta`);
    return res.data;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
}

export const getOTCClaimReimbursementData = async () => {
  try {
    const res = await LOFLv2(true).get(`/otc/claim-reimbursement-form`);
    return res.data;
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
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
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
      return error.response;
    } catch (err) {
      console.error('Error logging error: ', err.message)
      return error.response;
    }
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
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
      return error.response;
    } catch (err) {
      console.error('Error logging error: ', err.message)
      return error.response;
    }
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
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
      return error.response;
    } catch (err) {
      console.error('Error logging error: ', err.message)
      return error.response;
    }
  }
}

// need to convert to V2
export const getDocuments = async (data) => {
  try {
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
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};


export const getDocumentFile = async (data) => {
  try {
    const { docId, isNodeId } = data.payload;
    return new Promise((res, rej) => {
        const doc = LOFLv2(true).get(`/document/${docId}`, { 
            params: {
              isNodeId: isNodeId
            }
        });
        res(doc);
    })
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
};

export const verifyAddress = async (data) => {
 
  try {
    const res = await LOFLv2(true).get(`/verify-address`, { params: {
      addr1: data.payload.streetAddress,
      addr2: data.payload.streetAddressTwo,
      city: data.payload.city,
      state: data.payload.state,
      zip: data.payload.zip
    }
    });
    return res.data;
  } catch (err) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
}

// forms and documents 
export const ccFormsDocs = async(data) =>{
  try {
    return await LOFLv2(true).get('/cc-forms-docs', { params: {
      memberId: data.payload.memberId,
      benefitPackage: data.payload.benefitPackage,
      companyCode: data.payload.companyCode,
      lob: data.payload.lob,
      year: data.payload.year, 
      groupNumber: data.payload.groupNumber
    }
    })
  } catch (error) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
}

// PCP Household
export const getPcpHousehold = async () => {
  try {
    const res = await LOFLv2(true).get(`/pcp`);
    return res.data;
  } catch (err) {
    try {
      console.error('Error logging error: ', error.message)
      await sendErrorLog(error)
    } catch (error) {
      console.error('Error logging error: ', error.message)
    }
  }
}
