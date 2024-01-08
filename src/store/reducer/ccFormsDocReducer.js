import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  ccFormsDocDetails: [],
  ccFormsDocLoading: false,
  error: ""
};

export default function ccFormsDoc(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_CC_FORMS_DOCS: {
      return {
        ...state,
        ccFormsDocDetails: [],
        ccFormsDocLoading: true,
        error: ""
      };
    }
    case actionTypes.RECEIVE_CC_FORMS_DOCS: {
      switch (action.payload.status) {
        case 'ERROR':
          {
            console.log("i am here error ")
            return {
              ...state,
              ccFormsDocDetails: [],
              ccFormsDocLoading: false,
              error: action.payload.errorData
            };
          }
        default:
          {
            console.log("i am here defaukt success ");
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
      {
        console.log("i am here defaukt last   ")
        return state;
      }
      
  }
};