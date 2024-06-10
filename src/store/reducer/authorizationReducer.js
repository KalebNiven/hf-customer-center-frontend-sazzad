import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  authorizationList: [],
  loading: false,
  error: "",
};

export default function authorization(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_AUTHORIZATION_LIST: {
      return {
        ...state,
        authorizationList: [],
        loading: true,
        error: "",
      };
    }
    case actionTypes.RECEIVE_AUTHORIZATION_LIST: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            authorizationList: [],
            loading: false,
            error: action.payload.errorData,
          };
        }
        default: {
          const value = action.payload.data.map(
            (val) =>
              val && {
                ...val,
                memberName: val.firstName.concat(" ", val.lastName),
                providerName: val.provider.name,
              }
          );
          return {
            ...state,
            authorizationList: value,
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
