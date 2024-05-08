import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  submittedClaimDetails: {},
  loading: false,
  error: "",
};

export default function submitClaimPayload(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_SUBMIT_CLAIM_DETAILS: {
      return {
        ...state,
        submittedClaimDetails: action.payload.data,
        loading: true,
        error: "",
      };
    }
    case actionTypes.RECEIVE_SUBMIT_CLAIM_DETAILS: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            submittedClaimDetails: {},
            loading: false,
            error: action.payload.errorData,
          };
        }
        default: {
          const value = action.payload.data;

          return {
            ...state,
            submittedClaimDetails: value,
            loading: false,
            error: "",
          };
        }
      }
    }
    default:
      return state;
  }
}
