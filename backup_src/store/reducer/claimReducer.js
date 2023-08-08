import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  claimList: [],
  loading:false,
  error:"",
  tabValue:0
};

export default function claim(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_TAB_VALUE: {
      return {
        ...state,
        tabValue:action.payload.tabValue
      };
    }
    case actionTypes.REQUEST_CLAIM_LIST: {
      return {
        ...state,
        claimList: [],
        loading:true,
        error:""
      };
    }
    case actionTypes.RECEIVE_CLAIM_LIST: {
      switch (action.payload.status) {
        case 'ERROR':
        {
          return {
            ...state,
            claimList: [],
            loading:false,
            error:action.payload.errorData
          };
        }
        default:{
        const value = action.payload.data.map(val => 
          val && {...val , memberName : val.firstName.concat(' ',val.lastName),providerName:val.provider.firstName.concat(' ',val.provider.lastName)}
        )
      return {
        ...state,
        claimList: value,
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
    