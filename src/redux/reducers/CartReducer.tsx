/* eslint-disable import/no-anonymous-default-export */
import {
  ADD_PRODUCT_TO_CART,
  SUCCESS,
  UPDATE_CART,
} from "../actions/ActionTypes";

const initialState = {
  pending: false,
  data: [],
  error: null,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_PRODUCT_TO_CART + SUCCESS:
      return {
        ...state,
        pending: false,
        data: [...state?.data, action.payload],
        error: null,
      };

    case UPDATE_CART + SUCCESS:
      return {
        ...state,
        pending: false,
        data: action.payload,
        error: null,
      };

    default:
      return {
        ...state,
      };
  }
};
