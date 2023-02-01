import axios from "axios";
import LOFLv2 from '../../utils/api/loflv2'

let authFlag = true;

export const getClaimsList = async () => {
  return LOFLv2.get('claims');
};

export const getClaimsDetails = async (memberId, claimId) => {
  return LOFLv2.get(`claims/${memberId}/${claimId}`);
};

export const getClaimsEOB = async (memberId, claimId) => {
  try {
    const res = await LOFLv2.get(`claims/eob/${memberId}/${claimId}`);
    return res.data;
  } catch (err) {
    console.log(err.message);
  }
};

export const getAuthorizationList = async () => {
  return LOFLv2.get('auths');
};

export const getPhysicalIdCarda = async (memberId) => {
  return LOFLv2.get('physical-id-card/' + memberId);
};

export const getDigitalIdCarda = async (memberId) => {
  return LOFLv2.get('digital-id-card/' + memberId);
};

export const getAuthorizationsDetails = async (selectedAuth) => {
  return LOFLv2.get('auths/' + selectedAuth.authorizationId);
};

export const getCustomerOOP = async () => {
  try {
    const res = await LOFLv2.get('oop');
    return res.data;
  } catch (err) {
    console.log(err.message)
  }
};

export const getPcpStatus = async (memberId) => {
  try {
    const res = await LOFLv2.get(`pcp/${memberId}/status`);
    return res.data;
  } catch (err) {
    console.log(err.message)
  }
};

export const getPcpDetails = async (pcpDetails) => {
  try {
    const res = await LOFLv2.patch('pcp', pcpDetails);
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
    const res = await LOFLv2.get(`coverage-details/${memberId}`);
    return res.data;
  } catch (err) {
    console.log(err.message)
  }
};

export const getCustomerInfoData = async () => { // Need to defer to Igor
  try {
    const res = await LOFLv2.get('/customer-info');
    return res.data;
  } catch (err) {
    console.log(err.message)
    throw new Error(err);
  }
};

export const getCustomerDemographicsInfoData = async (memberId) => {
  try {
    const res = await LOFLv2.get(`/customer-contact/${memberId}`);
    return res.data;
  } catch (err) {
    console.log(err.message)
  }
};

export const getFormsDocsData = async (memberId) => {
  try {
    const res = await LOFLv2.get(`forms-docs/${memberId}`);
    return res.data;
  } catch (err) {
    console.log(err.message)
  }
};

export const getHraQuestionsList = async (memberId) => {
  try {
    const res = await LOFLv2.get(`/hra-list/${memberId}`);
    return res.data[0];
  } catch (err) {
    console.log(err.message)
  }
};

export const submitHraSurvey = async (data) => {
  try {
    const res = await LOFLv2.post(`/hra-submit`, data);
    return res.data
  } catch (err) {
    console.log(err.message)
  }
};

export const getHraStatus = async () => {
  try {
    const res = await LOFLv2.get(`/hra-status/${memberId}`)
    return res.data;
  } catch (err) {
    console.log(err.message)
  }
}

export const getHraPartials = async (memberId) => {
  try {
    const res = await LOFLv2.get(`/hra-surveys/${memberId}`);
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
    const res = await LOFLv2.post('/hra-surveys', data, config);
    return res.data;
  } catch (err) {
    console.log(err.message)
  }
}

export const getHraStatuses = async (headOfHouseholdMemberId, dependents) => {
  try {
    const calls = []
    // create list of calls to check status for
    calls.push(LOFLv2.get(`/hra-status/${headOfHouseholdMemberId}`))
    dependents.forEach(dep => {
      calls.push(LOFLv2.get(`/hra-status/${dep.memberId}`))
    })

    return await LOFLv2.all(calls).then(
      LOFLv2.spread((...allData) => {
        return allData
      })
    )
  } catch (err) {
    console.log(err.message)
  }
}

export const submitMailMemberIDCardForm = async (data) => {
  try {
    const res = await LOFLv2.post('/mail-member-id-card-form', data);
    return res;
  } catch (err) {
    return err.response;
  }
};

export const submitClaimPayloadApi = async (data) => {
  try {
    const res = await LOFLv2.post('/claims', data);
    return res;
  } catch (err) {
    return err.response;
  }
};

export const submitAttestationAgreementAPI = async (data) => {
  try {
    const res = await LOFLv2.post('/user-agreement', data);
    return res;
  } catch (err) {
    return err.response;
  }
};

export const getMailMemberIDCardStatus = async (memberId) => {
  try {
    const res = await LOFLv2.get('/mail-member-id-card-status/' + memberId);
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
      calls.push(LOFLv2.get(`/hra-status-local/${id}`))
    })

    return await LOFLv2.all(calls).then(
      LOFLv2.spread((...allData) => {
        return allData
      })
    )
  } catch (err) {
    console.log(err.message)
  }
}

export const getMemberAnswers = async (memberIdsList) => {
  try {
    const calls = []
    // create list of calls
    memberIdsList.forEach(memberId => calls.push(LOFLv2.get(`/hra-surveys/${memberId}`)))
    return await LOFLv2.all(calls).then(
      LOFLv2.spread((...allData) => allData.map(data => data.data))
    )
  } catch (err) {
    console.log('Error catched: ', err.message)
  }
}

export const getAllRecomendedResources = async (dataPairList) => {
  try {
    const calls = []
    // create list of calls
    dataPairList.forEach(pair => calls.push(LOFLv2.get(`/hra-resources/${pair.questionareId}/${pair.companyCode}/${pair.memberId}`)))
    return await axios.all(calls).then(
      axios.spread((...allData) => allData.map(data => data.data))
    )
  } catch (err) {
    console.log('Error catched: ', err.message)
  }
}

// MY HEALTH (NowPow)

export const getCategoriesApiData = async () => {
  try {
    const res = await LOFLv2.get('/community-resources/categories');
    return res.data;
  } catch (err) {
    console.log(err.message)
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
    const res = await LOFLv2.post('/community-resources/sub-categories', formData, config);
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
    const res = await LOFLv2.post('/community-resources/resources', formData, config);
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
    const res = await LOFLv2.post('/community-resources/resource-details', formData, config);
    return res.data;
  } catch (err) {
    console.log(err.message)
  }
}


  export const getCarouselDetails = async () => {
    const res = await LOFLv2('carousel');
    return res.data;
  }

  export const getPcpData = async (data) => {
    const res =  await LOFLv2.get(`/pcp/${data.memberId}`);
    return res.data;
  }

  export const addMbrshipDetails = async (membershipDetails) => {
    try {
        const res = await LOFLv2({
          method: "POST",
          url: '/attach-membership',
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": membershipDetails.csrf,
          },
          data: membershipDetails.data,
        });
        return res;
      } catch (err) {
        return err.response;

      }
  }


 
export const submitPreferredContactInfo = async (data, csrf) => {
  try {
    const res = await LOFLv2({
      method: "PUT",
      url: '/preference/contacts',
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrf,
      },
      data: data,
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const getPreferenceCenterInfo = async () => {
  try {
    const res = await LOFLv2.get('/preference/contacts');
    return res;
  } catch (err) {
    return err.response;
  }
};


export const requestMFACode = async (data, mfaToken) => {
  try {
    let res = null;
      res = await axios({
        method: "POST",
        url: 'api/v2/mfa/send/'+data.type,
        headers: {
          "Content-Type": "application/json",
          "mfaAuthorization": mfaToken,
        },
      });
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
    const res = await LOFLv2.post('register',data,config);
    return res.data;
  }catch (err) {
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
    const res = await LOFLv2.get('mfa/channels',config);
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
    const res = await LOFLv2.post('mfa/verify/'+channel,data,config);
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
    const res = await LOFLv2.post('create-username-password',data,config);
    return res;
  } catch (err) {
    return err.response;
  }
};

// Global Alerts
export const getGlobalAlerts = async () => {
  try {
    const res = await LOFLv2.get(`global-alerts`);
    return res.data;
  } catch (err) {
  }
}

//why do we need an api call to get username?
export const getUserName = async () => {
  return await LOFLv2.get('settings/getUserName');
};

//we can remove the passing of csrf
export const changeUserName = async ({ data, csrf }) => {
  // const config = {
  //   headers: {
  //     "Content-Type": "application/json",
  //     "X-CSRF-TOKEN": csrf
  //   }
  // }
  const res = await LOFLv2.post('change-username', data);
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
  const res = await LOFLv2.post('change-password', data);
  return res.data;
};

export const updateEmailContactInfo = async (email) => {
  const res = await LOFLv2.post('change-email', email);
  return res.data;
};

export const updatePhoneContactInfo = async (phoneNum) => {
  const res = await LOFLv2.post('change-phone', phoneNum);
  return res.data;
};

export const verifyPhoneContactInfo = async (payload) => {
  return await LOFLv2.post('verify-phone', payload).then((response) => response.data);
};

export const verifyEmailContactInfo = async (payload) => {
  return await LOFLv2.post('verify-email', payload).then((response) => response.data);
};

export const verifyContactInfo = async (payload) => {
  return await LOFLv2.post('verify-code', payload).then((response) => response.data);
};

export const resendCodeContactInfo = async (payload, csrf) => {
  // const config = {
  //   headers: {
  //     "Content-Type": "application/json",
  //     "X-CSRF-TOKEN": csrf
  //   }
  // }
  const res = await LOFLv2.post('settingsResendVerificationCode', payload);
  return res.data;
};

export const reportErrorService = async (membershipKey) => {
  return await LOFLv2.post('/report-membership', membershipKey)
}

//sam to deliver today
export const submitPlanForExternalLink = async (payload) => {
  return await axios.get(`/selectPlan/${payload.membershipKey}`)
}

export const getCoverageBenefitsVideos = async (language, companyCode, benefitPackage, membershipStatus) => {
  const res = await LOFLv2.get(`/videos/medicare/${language}?companyCode=${companyCode}&benefitPackage=${benefitPackage}&membershipStatus=${membershipStatus}`);
  return res.data;
}

export const getDocumentsBasedOnId = async (documentId) => {
  try {
    const res = await LOFLv2.get(`documents/${documentId}?isNodeId=false`);
    return res;
  } catch (err) {
    console.log(err.message)
    return err.response;
  }
};

// OTC Card
// export const getOTCCardBalance = async () => {
//   try {
//     const res = await axios.get(`/otc-card-balance`);
//     return res.data;
//   } catch (err) {
//       console.log('getOTCCardBalance Error caught: ', err.message)
//   }
// }

// export const getOTCCardStatus = async () => {
//   try {
//     const res = await axios.get(`/otc-card-status`);
//     return res.data;
//   } catch (err) {
//       console.log('getOTCCardStatus Error caught: ', err.message)
//   }
// }

export const getOTCProfile = async () => {
  try {
    const res = await LOFLv2.get(`/otc/profile`);
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
    const res = await LOFLv2.post(`/otc/activate-card`, data, config);
    return { status: res.status, data: res.data};
  } catch (err) {
    console.log('activateOTCCard Error caught: ', err.message)
    return { status: err.response.status, data: err.response.data};
  }
}

export const getOTCCardMeta = async () => {
  try {
    const res = await LOFLv2.get(`/otc/card-meta`);
    return res.data;
  } catch (err) {
      console.log('activateOTCCard Error caught: ', err.message)
  }
}