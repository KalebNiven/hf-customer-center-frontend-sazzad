import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  coverage: {},
  loading: false,
  error: "",
};

export default function coverageBenefits(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_COVERAGE_DATA: {
      return {
        ...state,
        coverage: {},
        loading: true,
        error: "",
        documents: [],
        docsError: "",
      };
    }
    case actionTypes.RECEIVE_COVERAGE_DATA: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            coverage: {},
            loading: false,
            error: action.payload.errorData,
          };
        }
        default: {
          return {
            ...state,
            coverage: action.payload.data,
            loading: false,
            error: "",
          };
        }
      }
    }
    case actionTypes.REQUEST_FORMS_DOCS: {
      return {
        ...state,
        documents: [],
        docsError: "",
      };
    }
    case actionTypes.RECEIVE_FORMS_DOCS: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            documents: [],
            docsError: action.payload.errorData,
          };
        }
        default: {
          return {
            ...state,
            documents: action.payload.data,
            docsError: "",
          };
        }
      }
    }
    default:
      return state;
  }
}
