import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  data: null,
  loading: false,
  error: null,
};

export default function setPassword(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_SET_PASSWORD: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case actionTypes.RESET_SET_PASSWORD: {
      return {
        ...state,
        data: null,
        loading: false,
        error: null,
      };
    }
    case actionTypes.RECEIVE_SET_PASSWORD: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            loading: false,
            error: action.payload.errorData,
          };
        }
        default: {
          const value = action.payload.data;

          return {
            ...state,
            data: value,
            loading: false,
            error: null,
          };
        }
      }
    }
    default:
      return state;
  }
}
