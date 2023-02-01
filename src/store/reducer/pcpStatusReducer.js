import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  pcpStatus: null,
  loading:false,
  error:""
};

export default function pcpStatus(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_PCP_STATUS: {
      return {
        ...state,
        loading:true,
        error:""
      };
    }
    case actionTypes.RECEIVE_PCP_STATUS: {
      switch (action.payload.status) {
        case 'ERROR':
        {
          return {
            ...state,
            pcpStatus: {},
            loading:false,
            error:action.payload.errorData
          };
        }
        default:{
        const value = action.payload.data
      return {
        ...state,
        pcpStatus: value,
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
