import { combineReducers } from "redux";
import { CLEAR_APP_STATE } from "../actions/ActionTypes";
import CartReducer from "./CartReducer";
import ProductReducer from "./ProductReducer";

const appReducer = combineReducers({
  cartReducer: CartReducer,
  productReducer: ProductReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === CLEAR_APP_STATE) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
