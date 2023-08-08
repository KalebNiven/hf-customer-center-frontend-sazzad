import * as actionTypes from "../actions/actionTypes";

  export const initialState = {
    data: null,
    loading:false,
    error:""
  };
  
  export default function correspondenceStatus(state = initialState, action) {
    switch (action.type) {
      case actionTypes.REQUEST_MAIL_MEMBER_ID_CARD_STATUS: {
        return {
          ...state,
          data: null,
          loading:true,
          error:""
        };
      }
      case actionTypes.RECEIVE_MAIL_MEMBER_ID_CARD_STATUS: {
        switch (action.payload.status) {
          case 'ERROR':
          {
            return {
              ...state,
              data: null,
              loading:false,
              error:action.payload.errorData
            };
          }
          default:{
          const value = action.payload.data;
  
        return {
          ...state,
          data: value.data,
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