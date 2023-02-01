import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  data: {},
  loading:false,
  error:""
};

export default function customerInfo(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_CUSTOMER_INFO: {
      return {
        ...state,
        data: {},
        loading:true,
        error:""
      };
    }
    case actionTypes.RECEIVE_CUSTOMER_INFO: {
      switch (action?.payload?.status) {
        case 'ERROR':
        {
          return {
            ...state,
            data: {},
            loading:false,
            error:action.payload.errorData
          };
        }
        default: {
          const localStorageOKTA = JSON.parse(localStorage.getItem('okta-token-storage'));
          const accessToken = 'Bearer ' + localStorageOKTA.accessToken.accessToken;
          const idToken = 'Bearer ' + localStorageOKTA.idToken.idToken;
          return {
            ...state,
            data: {...action.payload.data, accessToken, idToken },
            loading:false,
            error:""
          };
        }
      }
    }
    default:
      return state;
  }
};
    