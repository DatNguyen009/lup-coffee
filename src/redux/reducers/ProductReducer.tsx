/* eslint-disable import/no-anonymous-default-export */
import { SEARCH_PRODUCT, SUCCESS } from "../actions/ActionTypes";

const initialState = {
  pending: false,
  data: {
    search: "",
  },
  error: null,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case SEARCH_PRODUCT + SUCCESS:
      return {
        ...state,
        pending: false,
        data: {
          search: action.payload,
        },
        error: null,
      };

    default:
      return {
        ...state,
      };
  }
};
