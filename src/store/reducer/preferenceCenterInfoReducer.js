import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  data: null,
  loading: false,
  error: "",
};

export default function preferenceCenterInfo(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_PREFERENCE_CENTER_INFO: {
      return {
        ...state,
        data: null,
        loading: true,
        error: "",
      };
    }
    case actionTypes.RECEIVE_PREFERENCE_CENTER_INFO: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            data: null,
            loading: false,
            error: action.payload.errorData,
          };
        }
        default: {
          const value = action.payload.data;

          return {
            ...state,
            data: value.data,
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
