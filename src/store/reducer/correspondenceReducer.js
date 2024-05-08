import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  loading: false,
  error: "",
};

export default function correspondence(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_SUBMIT_MAIL_MEMBER_ID_CARD_FORM: {
      return {
        ...state,
        loading: true,
        error: "",
      };
    }
    case actionTypes.RECEIVE_SUBMIT_MAIL_MEMBER_ID_CARD_FORM: {
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
