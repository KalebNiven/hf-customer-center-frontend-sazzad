import * as actionTypes from "../actions/actionTypes";

  export const initialState = {
    data: null,
    loading:false,
    error:""
  };
  
  export default function forgotPassword(state = initialState, action) {
    switch (action.type) {
      case actionTypes.REQUEST_FORGOT_PASSWORD: {
        return {
          ...state,
          loading:true,
          error:""
        };
      }
      case actionTypes.RESET_FORGOT_PASSWORD: {
        return {
          ...state,
          data: null,
          loading:false,
          error:""
        };
      }
      case actionTypes.RECEIVE_FORGOT_PASSWORD: {
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