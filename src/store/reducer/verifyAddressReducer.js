import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  address: null,
  loading:false,
  error:""
};

export default function verifyAddress(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_VERIFY_ADDRESS: {
      return {
        ...state,
        address: null,
        loading:true,
        error:""
      };
    }
    case actionTypes.RECEIVE_VERIFY_ADDRESS: {
      if(action.payload === undefined){
        return {
          ...state,
          address: null,
          loading:false,
          error:"undefined state"
        };
      }
      switch (action.payload.status) {
        case 'ERROR':
        {
          return {
            ...state,
            address: null,
            loading:false,
            error:action.payload.errorData
          };
        }
        default:{
        const value = action.payload.data;

      return {
        ...state,
        address: value?.addressResponse,
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
    