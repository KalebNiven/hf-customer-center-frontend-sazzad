import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  pcpDetails: null,
  loading:false,
  stateStatus: "init",
  error:""
};

export default function pcpDetails(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_PCP_UPDATE: {
      return {
        ...state,
        loading:true,
        error:""
      };
    }
    case actionTypes.REQUEST_RESET_PCP_DETAILS: {
      return { ...initialState, stateStatus: "Reset" }
 }
 
    case actionTypes.RECEIVE_PCP_UPDATE: {
      switch (action.payload.status) {
        case 'ERROR':
        {
          return {
            ...state,
            pcpDetails: {},
            loading:false,
            error:action.payload.errorData
          };
        }
        default:{
        const value = action.payload.data
      return {
        ...state,
        pcpDetails: value,
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