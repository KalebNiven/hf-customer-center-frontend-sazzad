import * as actionTypes from "../actions/actionTypes";

  export const initialState = {
    data: null,
    loading:false,
    error:""
  };
  
  export default function userMfaVerify(state = initialState, action) {
    switch (action.type) {
      case actionTypes.REQUEST_USER_MFA_VERIFY: {
        return {
          ...state,
          loading:true,
          error:""
        };
      }
      case actionTypes.RECEIVE_USER_MFA_VERIFY: {
        switch (action.payload.status) {
          case 'ERROR':
          {
            return {
              ...state,
              loading:false,
              error:action.payload.errorData
            };
          }
          default:{
          const value = action.payload.data;
  
        return {
          ...state,
          data: value,
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