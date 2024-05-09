import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  submittedAttestationAgreement: {},
  loading: false,
  error: "",
};

export default function submitAttestationAgreement(
  state = initialState,
  action,
) {
  switch (action.type) {
    case actionTypes.REQUEST_SUBMIT_ATTESTATION_AGREEMENT: {
      return {
        ...state,
        submittedAttestationAgreement: action.payload.data,
        loading: true,
        error: "",
      };
    }
    case actionTypes.RECEIVE_SUBMIT_ATTESTATION_AGREEMENT: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            submittedAttestationAgreement: {},
            loading: false,
            error: action.payload.errorData,
          };
        }
        default: {
          const value = action.payload.data;

          return {
            ...state,
            submittedAttestationAgreement: value,
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
