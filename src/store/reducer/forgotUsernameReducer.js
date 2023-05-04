import * as actionTypes from "../actions/actionTypes";

  export const initialState = {
    data: null,
    loading:false,
    error:""
  };
  
  export default function forgotUsername(state = initialState, action) {
    switch (action.type) {
      case actionTypes.REQUEST_FORGOT_USERNAME: {
        return {
          ...state,
          loading:true,
          error:""
        };
      }
      case actionTypes.RESET_FORGOT_USERNAME: {
        return{
          ...state,
          loading:false,
          data: null,
          error:""
        };
      }
      case actionTypes.RECEIVE_FORGOT_USERNAME: {
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