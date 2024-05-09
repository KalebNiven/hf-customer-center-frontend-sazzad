import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  authorizationDetails: "",
  loading: false,
  error: "",
};

export default function authorizationDetails(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_AUTHORIZATION_DETAILS: {
      return {
        ...state,
        loading: true,
        error: "",
      };
    }
    case actionTypes.RECEIVE_AUTHORIZATION_DETAILS: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            authorizationDetails: "",
            loading: false,
            error: action.payload.errorData,
          };
        }
        default:
          return {
            ...state,
            authorizationDetails: action.payload.data,
            loading: false,
            error: "",
          };
      }
    }
    default:
      return state;
  }
}
