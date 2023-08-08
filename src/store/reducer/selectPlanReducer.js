import * as actionTypes from "../actions/actionTypes";

export const initialState = {
    loading:false,
    error:"",
    status:"init"
};

export default function selectPlan(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_SELECT_PLAN: {
        return {
          ...state,
          loading:true,
          error:""
        };
      }
      case actionTypes.RECEIVE_SELECT_PLAN: {
        switch (action.payload.status) {
          case 'ERROR':
            {
              return {
                ...state,
                loading:false,
                error:action.payload.errorData,
                status:"error"
              };
            }
          default:
            {
              return {
                ...state,
                loading:false,
                error:action.payload.data,
                status:"complete"
              };
            }
        }
      }
    default:
      return state;
  }
};