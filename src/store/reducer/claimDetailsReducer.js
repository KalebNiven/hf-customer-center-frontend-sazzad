import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  claimDetails: "",
  loading: false,
  error: "",
  eob: null,
  errorEOB: "",
};

export default function claimDetails(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_CLAIM_DETAILS: {
      return {
        ...state,
        loading: true,
        error: "",
      };
    }
    case actionTypes.RECEIVE_CLAIM_DETAILS: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            claimDetails: "",
            loading: false,
            error: action.payload.errorData,
          };
        }
        default:
          return {
            ...state,
            claimDetails: action.payload.data,
            loading: false,
            error: "",
          };
      }
    }
    case actionTypes.REQUEST_CLAIMS_EOB: {
      return {
        ...state,
        eob: null,
        errorEOB: "",
      };
    }
    case actionTypes.RECEIVE_CLAIMS_EOB: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            eob: null,
            errorEOB: action.payload.errorData,
          };
        }
        default:
          return {
            ...state,
            eob: action.payload.data,
            errorEOB: "",
          };
      }
    }
    default:
      return state;
  }
}
