import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  status: {
    error: "",
    loading: false,
  },
  balance: {
    error: "",
    loading: false,
  },
  profile: {
    error: "",
    loading: false,
    data: null,
  },
  reimbursementForm: {
    error: "",
    loading: false,
    data: null,
  },
};

export default function otcCard(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_OTC_CARD_STATUS: {
      return {
        ...state,
        status: { ...initialState.status, loading: true },
      };
    }
    case actionTypes.REQUEST_OTC_CARD_BALANCE: {
      return {
        ...state,
        balance: { ...initialState.balance, loading: true },
      };
    }
    case actionTypes.REQUEST_OTC_PROFILE: {
      return {
        ...state,
        profile: { ...initialState.profile, loading: true },
      };
    }
    case actionTypes.REQUEST_OTC_CLAIM_REIMBURSEMENT_DATA: {
      return {
        ...state,
        reimbursementForm: { ...initialState.reimbursementForm, loading: true },
      };
    }
    case actionTypes.RECEIVE_OTC_CARD_STATUS: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            status: { error: action.payload.errorData, loading: false },
          };
        }
        default: {
          return {
            ...state,
            status: { ...state.status, ...action.payload, loading: false },
          };
        }
      }
    }
    case actionTypes.RECEIVE_OTC_PROFILE: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            profile: { error: action.payload.errorData, loading: false },
          };
        }
        default: {
          return {
            ...state,
            profile: { ...state.profile, ...action.payload, loading: false },
          };
        }
      }
    }
    case actionTypes.RECEIVE_OTC_CLAIM_REIMBURSEMENT_DATA: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            reimbursementForm: {
              error: action.payload.errorData,
              loading: false,
            },
          };
        }
        default: {
          return {
            ...state,
            reimbursementForm: {
              ...state.reimbursementForm,
              ...action.payload,
              loading: false,
            },
          };
        }
      }
    }
    case actionTypes.RECEIVE_OTC_CARD_BALANCE: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            balance: { error: action.payload.errorData, loading: false },
          };
        }
        default: {
          return {
            ...state,
            balance: { ...state.balance, ...action.payload, loading: false },
          };
        }
      }
    }
    default:
      return state;
  }
}
