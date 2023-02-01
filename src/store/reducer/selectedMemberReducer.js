import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  dependentPcpId: null
};

export default function selectedMember(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_DD_SELECTED_MEMBER: {
      return {
        ...state,
        dependentPcpId: action.payload.id
      };
    }
    default:
      return state;
  }
};