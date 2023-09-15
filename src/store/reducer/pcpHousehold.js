import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  data: null,
  loading: false,
  error: ""
};

export default function pcpHousehold(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_PCP_HOUSEHOLD: {
      return {
        ...state,
        data: null,
        loading: true,
        error: ""
      };
    }
    case actionTypes.RECEIVE_PCP_HOUSEHOLD: {
      switch (action.payload.status) {
        case 'ERROR':
          {
            return {
              ...state,
              data: null,
              loading: false,
              error: action.payload.errorData
            };
          }
        default:
          {
            return {
              ...state,
              data: action.payload.data,
              // data: mapToArray(action.payload.data),
              loading: false,
              error: ""
            };
          }
      }
    }
    default:
      return state;
  }
};

// Convert API response object desired form (array)
function mapToArray(data) {
  const hohPlans = data.hohPlans;
  const dependents = data.dependents;
  const hohPlansKeys = Object.keys(hohPlans);
  const dependentsKeys = Object.keys(dependents);
  const obj = {
    hohPlans: [],
    dependents: []
  }
  hohPlansKeys.forEach(key => {
    obj.hohPlans.push({
      ...hohPlans[key],
      memberId: key
    })
  })
  dependentsKeys.forEach(key => {
    obj.dependents.push({
      ...dependents[key],
      memberId: key
    })
  })
  return obj;
}