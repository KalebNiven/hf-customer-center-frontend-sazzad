import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  pcpDetails: {},
  pcpLoading: false,
  error: "",
};

export default function pcp(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_PCP_DETAILS: {
      return {
        ...state,
        pcpDetails: {},
        pcpLoading: true,
        error: "",
      };
    }
    case actionTypes.RECEIVE_PCP_DETAILS: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            pcpDetails: {},
            pcpLoading: false,
            error: action.payload.errorData,
          };
        }
        default: {
          return {
            ...state,
            pcpDetails: action.payload.data,
            pcpLoading: false,
            error: "",
          };
        }
      }
    }
    default:
      return state;
  }
}
