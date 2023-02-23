import { CART_REDUCER } from "../reducers/ReducerTypes";
import { all, put, select, takeLatest } from "redux-saga/effects";
import {
  ADD_PRODUCT_TO_CART,
  SUCCESS,
  UPDATE_CART,
} from "../actions/ActionTypes";

function* addProductToCartSaga(action: any) {
  try {
    const { data } = yield select((state) => state[CART_REDUCER]);
    console.log("CartSaga---", { payload: action.payload, data });

    if (data.length === 0) {
      yield put({
        type: ADD_PRODUCT_TO_CART + SUCCESS,
        payload: action.payload,
      });
      return;
    }

    if (action.payload?.size) {
      const productFinded = data.findIndex(
        (item: any) =>
          item.index === action.payload?.index &&
          item.size === action.payload?.size
      );

      console.log("productFinded", productFinded);
      if (productFinded === -1) {
        yield put({
          type: ADD_PRODUCT_TO_CART + SUCCESS,
          payload: action.payload,
        });
        return;
      }

      const mapProduct = data.map((item: any) => {
        if (
          item.index === action.payload?.index &&
          item.size === action.payload?.size
        ) {
          return {
            ...item,
            quantity: item.quantity + action.payload?.quantity,
          };
        }

        return item;
      });

      yield put({
        type: UPDATE_CART + SUCCESS,
        payload: mapProduct,
      });

      return;
    }

    const productFinded = data.findIndex(
      (item: any) => item.index === action.payload?.index
    );

    console.log("productFinded", productFinded);
    if (productFinded === -1) {
      yield put({
        type: ADD_PRODUCT_TO_CART + SUCCESS,
        payload: action.payload,
      });
      return;
    }

    const mapProduct = data.map((item: any) => {
      if (item.index === action.payload?.index) {
        return {
          ...item,
          quantity: item.quantity + action.payload?.quantity,
        };
      }

      return item;
    });

    yield put({
      type: UPDATE_CART + SUCCESS,
      payload: mapProduct,
    });
  } catch (error) {
    console.log(error);
    action.callback && action.callback(error, null);
  }
}

function* updateCartSaga(action: any) {
  try {
    console.log("UpdateCartSaga---", action.payload);

    yield put({
      type: UPDATE_CART + SUCCESS,
      payload: action.payload,
    });
  } catch (error) {
    console.log(error);
    action.callback && action.callback(error, null);
  }
}

function* cartSaga() {
  yield all([takeLatest(ADD_PRODUCT_TO_CART, addProductToCartSaga)]);
  yield all([takeLatest(UPDATE_CART, updateCartSaga)]);
}

export default cartSaga;
