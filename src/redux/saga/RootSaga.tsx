import { all, fork } from "redux-saga/effects";
import cartSaga from "./CartSaga";
import productSaga from "./ProductSaga";

export function* rootSaga() {
  yield all([fork(cartSaga), fork(productSaga)]);
}
