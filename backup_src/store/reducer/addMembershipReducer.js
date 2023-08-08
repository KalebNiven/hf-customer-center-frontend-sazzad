import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  submittedMembershipDetails:{},
  loading:false,
  error:"",
  success:""
};

export default function addMembership(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_ADD_MEMBERSHIP: {
      return {
        ...state,
        submittedMembershipDetails: action.payload.data,
        loading:true,
        error:"",
        success:""
      };
    }
    case actionTypes.RECEIVE_ADD_MEMBERSHIP: {
      switch (action.payload.status) {
        case 'ERROR':
        {
          return {
            ...state,
            submittedMembershipDetails: {},
            loading:false,
            error:action.payload.errorData,
            success:""
          };
        }
        default:{

      return {
        ...state,
        submittedMembershipDetails: action.payload.successMsg,
        loading:false,
        error:"",
        success:action.payload.successMsg
        };
      }
      }
    }
    default:
      return state;
  }
};
    