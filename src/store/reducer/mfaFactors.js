import { flush } from "redux-saga/effects";
import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  data: null,
  loading: false,
  error: "",
};

export default function mfaFactors(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_MFA_FACTORS: {
      return {
        ...state,
        loading: true,
        error: "",
      };
    }
    case actionTypes.RESET_MFA_FACTORS: {
      return {
        ...state,
        data: null,
        loading: false,
        error: "",
      };
    }
    case actionTypes.RECEIVE_MFA_FACTORS: {
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
            error: "",
          };
        }
      }
    }
    default:
      return state;
  }
}
