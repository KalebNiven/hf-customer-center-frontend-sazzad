import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  submitEmailDetails:null,
  submitPhoneDetails:null,
  loading:false,
  error:""
};

export default function submitContactInfoPayload(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_CONTACT_EMAIL_INFO: {
      return {
        ...state,
        submitEmailDetails: action.payload.data,
        loading:true,
        error:""
      };
    }
    case actionTypes.ERROR_CONTACT_EMAIL_INFO: {
      return {
        ...state,
        submitEmailDetails: undefined,
        loading:false,
        error:action.payload.data.response.data.error
      };
    }
    case actionTypes.RECEIVE_CONTACT_EMAIL_INFO: {
      switch (action.payload.status) {
        case 'ERROR':
        {
          return {
            ...state,
            submitEmailDetails: '',
            loading:false,
            error:action.payload.errorData
          };
        }
        default:{
        const value = action.payload.data;

      return {
        ...state,
        submitEmailDetails: value,
        loading:false,
        error:""
        };
      }
      }
    }
    case actionTypes.REQUEST_CONTACT_PHONE_INFO: {
      return {
        ...state,
        submitPhoneDetails: action.payload.data,
        loading:true,
        error:""
      };
    }
    case actionTypes.ERROR_CONTACT_PHONE_INFO: {
      return {
        ...state,
        submitEmailDetails: undefined,
        loading:false,
        error:action.payload.data.response.status == 422 ? action.payload.data.response.data.errors.phone[0] : action.payload.data.response.data.error
      };
    }
    case actionTypes.RECEIVE_CONTACT_PHONE_INFO: {
      switch (action.payload.status) {
        case 'ERROR':
        {
          return {
            ...state,
            submitPhoneDetails: '',
            loading:false,
            error:action.payload.errorData
          };
        }
        default:{
        const value = action.payload.data;

      return {
        ...state,
        submitPhoneDetails: value,
        loading:false,
        error:""
        };
      }
      }
    }
    default:
      return state;
  }
};
    