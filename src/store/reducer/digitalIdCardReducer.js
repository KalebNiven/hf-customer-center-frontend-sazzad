import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  idCard: [],
  loading:false,
  error:""
};

export default function digitalIdCard(state = initialState, action) {
    switch (action.type) {
      case actionTypes.REQUEST_DIGITAL_ID_CARD: {
        return {
          ...state,
          idCard: [],
          loading:true,
          error:""
        };
      }
      case actionTypes.RECEIVE_DIGITAL_ID_CARD: {
        switch (action.payload.status) {
          case 'ERROR':
          {
            return {
              ...state,
              idCard: [],
              loading:false,
              error:action.payload.errorData
            };
          }
          default:{
          const value = action.payload.data;
  
        return {
          ...state,
          idCard: value,
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