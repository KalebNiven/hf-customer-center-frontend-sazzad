import * as actionTypes from "../actions/actionTypes";
import { toCamelCase } from "../../utils/strings.js";

export const initialState = {
  oopList: null,
  loading: false,
  error: "",
};

export default function oop(state = initialState, action) {
  switch (action.type) {
    case actionTypes.REQUEST_CUSTOMER_OOP: {
      return {
        ...state,
        oopList: null,
        loading: true,
        error: "",
      };
    }
    case actionTypes.RECEIVE_CUSTOMER_OOP: {
      switch (action.payload.status) {
        case "ERROR": {
          return {
            ...state,
            oopList: null,
            loading: false,
            error: action.payload.errorData,
          };
        }
        default: {
          function mapOOP(items) {
            const result = {};
            items.forEach(
              (item) => (result[toCamelCase(item.accum_name)] = { ...item })
            );
            return result;
          }
          const value = action.payload.data.map((item) => ({
            memberId: item.memberId,
            oop: mapOOP(item.oop),
            oopLength: item.oop.length,
          }));
          return {
            ...state,
            oopList: value,
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
