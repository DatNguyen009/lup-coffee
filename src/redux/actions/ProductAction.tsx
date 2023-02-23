import { SEARCH_PRODUCT } from "./ActionTypes";

export const searchProductAction = (
  payload: any,
  callback = (error: any, data: any) => {}
) => {
  return {
    type: SEARCH_PRODUCT,
    payload,
    callback,
  };
};
