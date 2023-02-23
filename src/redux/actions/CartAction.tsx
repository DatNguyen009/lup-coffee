import { ADD_PRODUCT_TO_CART, UPDATE_CART } from "./ActionTypes";

export const addProductToCartAction = (
  payload: any,
  callback = (error: any, data: any) => {}
) => {
  return {
    type: ADD_PRODUCT_TO_CART,
    payload,
    callback,
  };
};

export const updateCartAction = (
  payload: any,
  callback = (error: any, data: any) => {}
) => {
  return {
    type: UPDATE_CART,
    payload,
    callback,
  };
};
