import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  categories: [],
  loading: false,
  error: "",
  icon: null,
  imgError: "",
  categoryDetails: [],
  categoryDetailsAll: [],
  categoryErr: "",
  currentCategIcon: "",
  indMapDetails: "",
  indMapError: "",
};

export default function myHealth(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_CATEGORIES: {
      return {
        ...state,
        categories: [],
        loading: true,
        error: "",
      };
    }
    case actionTypes.RECEIVE_CATEGORIES: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            categories: [],
            loading: false,
            error: action.payload.errorData,
          };
        }
        default: {
          return {
            ...state,
            categories: action.payload.data,
            loading: false,
            error: "",
          };
        }
      }
    }
    case actionTypes.UPDATE_ICON_BY_ID: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            icon: null,
            imgError: action.payload.errorData,
          };
        }
        default: {
          return {
            ...state,
            icon: action.payload.data,
            imgError: "",
          };
        }
      }
    }
    case actionTypes.GET_CATEGORY_DETAILS: {
      return {
        ...state,
        categoryDetails: [],
        loading: true,
        categoryErr: "",
      };
    }
    case actionTypes.UPDATE_CATEGORY_DETAILS: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            categoryDetails: [],
            loading: false,
            categoryErr: action.payload.errorData,
          };
        }
        default: {
          return {
            ...state,
            categoryDetails: action.payload.data,
            loading: false,
            categoryErr: "",
          };
        }
      }
    }
    case actionTypes.GET_CATEGORY_DETAILS_ALL: {
      return {
        ...state,
        categoryDetailsAll: [],
        loading: true,
        categoryErr: "",
      };
    }
    case actionTypes.UPDATE_CATEGORY_DETAILS_ALL: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            categoryDetailsAll: [],
            loading: false,
            categoryErr: action.payload.errorData,
          };
        }
        default: {
          return {
            ...state,
            categoryDetailsAll: action.payload.data,
            loading: false,
            categoryErr: "",
          };
        }
      }
    }
    case actionTypes.GET_CATEGORY_ICON: {
      const icon =
        state.icon && state.icon.filter((icn) => icn.id === action.id);
      return {
        ...state,
        currentCategIcon: icon.length > 0 && icon[0].data.icon,
      };
    }
    case actionTypes.GET_IND_MAP_DETAILS: {
      return {
        ...state,
        indMapDetails: [],
        loading: true,
        indMapError: "",
      };
    }
    case actionTypes.UPDATE_IND_MAP_DETAILS: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            indMapDetails: {},
            loading: false,
            indMapError: action.payload.errorData,
          };
        }
        default: {
          return {
            ...state,
            indMapDetails: action.payload.data,
            loading: false,
            indMapError: "",
          };
        }
      }
    }
    default:
      return state;
  }
}
