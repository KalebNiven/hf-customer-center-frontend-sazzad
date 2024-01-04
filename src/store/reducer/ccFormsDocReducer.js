import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  ccFormsDocDetails: {},
  ccFormsDocLoading: false,
  error: ""
};

export default function ccFormsDoc(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_CC_FORMS_DOCS: {
      return {
        ...state,
        ccFormsDocDetails: {},
        ccFormsDocLoading: true,
        error: ""
      };
    }
    case actionTypes.RECEIVE_CC_FORMS_DOCS: {
      switch (action.payload.status) {
        case 'ERROR':
          {
            return {
              ...state,
              ccFormsDocDetails: {},
              ccFormsDocLoading: false,
              error: action.payload.errorData
            };
          }
        default:
          {
            return {
              ...state,
              ccFormsDocDetails: action.payload.data,
              ccFormsDocLoading: false,
              error: ""
            };
          }
      }
    }
    default:
      return state;
  }
};