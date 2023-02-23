import { all, put, takeLatest } from "redux-saga/effects";
import { SEARCH_PRODUCT, SUCCESS } from "../actions/ActionTypes";

function* searchProductSaga(action: any) {
  try {
    console.log("searchProductSaga---", action.payload);

    yield put({
      type: SEARCH_PRODUCT + SUCCESS,
      payload: action.payload,
    });
  } catch (error) {
    console.log(error);
    action.callback && action.callback(error, null);
  }
}

function* cartSaga() {
  yield all([takeLatest(SEARCH_PRODUCT, searchProductSaga)]);
}

export default cartSaga;
