import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  data: {},
  loading: false,
  error: "",
};

export default function customerDemographicsInfo(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_CUSTOMER_DEMOGRAPHICS_INFO: {
      return {
        ...state,
        data: {},
        loading: true,
        error: "",
      };
    }
    case actionTypes.RECEIVE_CUSTOMER_DEMOGRAPHICS_INFO: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            data: {},
            loading: false,
            error: action.payload.errorData,
          };
        }
        default: {
          return {
            ...state,
            data: action.payload.data,
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
