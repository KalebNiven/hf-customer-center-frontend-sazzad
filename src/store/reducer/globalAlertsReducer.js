import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  alertsList: null,
  loading: false,
  error: "",
};

export default function globalAlerts(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_GLOBAL_ALERTS: {
      return {
        ...state,
        alertsList: null,
        loading: true,
        error: "",
      };
    }
    case actionTypes.RECEIVE_GLOBAL_ALERTS: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            alertsList: null,
            loading: false,
            error: action.payload.errorData,
          };
        }
        default: {
          return {
            ...state,
            alertsList: [...action.payload.data],
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
