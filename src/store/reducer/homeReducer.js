import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  carouselItems: [],
  pcpDetails: {},
  pcpLoading: false,
  carouselLoading: false,
  error: "",
  externalLink: "",
  externalLinkLoading: false,
  externalLinkError: "",
};

export default function homeDetails(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_CAROUSEL_ITEMS: {
      return {
        ...state,
        carouselItems: [],
        carouselLoading: true,
        error: "",
      };
    }
    case actionTypes.RECEIVE_CAROUSEL_ITEMS: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            carouselItems: [],
            carouselLoading: false,
            error: action.payload.errorData,
          };
        }
        default: {
          return {
            ...state,
            carouselItems: action.payload.data,
            carouselLoading: false,
            error: "",
          };
        }
      }
    }
    case actionTypes.REQUEST_PCP_DETAILS: {
      return {
        ...state,
        pcpDetails: {},
        pcpLoading: true,
        error: "",
      };
    }
    case actionTypes.RECEIVE_PCP_DETAILS: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            pcpDetails: {},
            pcpLoading: false,
            error: action.payload.errorData,
          };
        }
        default: {
          return {
            ...state,
            pcpDetails: action.payload.data,
            pcpLoading: false,
            error: "",
          };
        }
      }
    }
    case actionTypes.REQUEST_SELECT_PLAN: {
      return {
        ...state,
        externalLinkError: "",
        externalLink: "",
        externalLinkLoading: true,
      };
    }
    case actionTypes.RECEIVE_SELECT_PLAN: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            externalLinkError: action.payload.errorData,
            externalLinkLoading: false,
          };
        }
        default: {
          return {
            ...state,
            error: "",
            externalLinkError: action.payload.data,
            externalLinkLoading: false,
          };
        }
      }
    }
    default:
      return state;
  }
}
