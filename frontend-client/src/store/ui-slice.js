import { createSlice } from "@reduxjs/toolkit";
import { SERVER_URL } from "../data/api";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isAuth: false,
    user: {},
    products: [],
    cart: {
      items: [],
      totalQuantity: 0,
      totalAmount: 0,
    },
    popupIsVisible: false,
    clickedId: "",
    clickedCategory: "",
    livechatIsVisible: false,
    loading: false,
  },
  reducers: {
    status(state, action) {
      state.isAuth = action.payload.isAuth;
      state.user = action.payload.user;
    },
    shop(state, action) {
      state.products = action.payload;
    },
    cart(state, action) {
      state.cart = action.payload;
    },
    popup(state, action) {
      state.popupIsVisible = action.payload.popupIsVisible;
      state.clickedId = action.payload.clickedId;
    },
    category(state, action) {
      state.clickedCategory = action.payload;
    },
    livechat(state) {
      state.livechatIsVisible = !state.livechatIsVisible;
    },
    loading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;

// get login status
export const getLoginStatus = () => {
  return async (dispatch) => {
    try {
      const res = await fetch(`${SERVER_URL}/auth/login-status`, {
        credentials: "include",
      });
      const data = await res.json();
      // console.log("getLoginStatus: ", data);
      if (data.errorMsg) return console.log(data.errorMsg);
      dispatch(uiActions.status(data));
    } catch (err) {
      console.error(err);
    }
  };
};

// get products
export const getProducts = () => {
  return async (dispatch) => {
    try {
      const res = await fetch(`${SERVER_URL}/shop/products`);
      const data = await res.json();
      // console.log("getProducts: ", data);
      if (data.errorMsg) console.log(data.errorMsg);
      dispatch(uiActions.shop(data));
    } catch (err) {
      console.error(err);
    }
  };
};

// get cart status
export const getCart = () => {
  return async (dispatch) => {
    try {
      const res = await fetch(`${SERVER_URL}/shop/cart`, {
        credentials: "include",
      });
      const data = await res.json();
      // console.log("getCart: ", data);
      if (data.expired) {
        dispatch(uiActions.status({ isAuth: false, user: {} }));
        return console.log(data.errorMsg);
      }
      dispatch(uiActions.cart(data));
    } catch (err) {
      console.error(err);
    }
  };
};

// post cart
export const postCart = (id, qty) => {
  return async (dispatch) => {
    dispatch(uiActions.loading(true));
    try {
      const res = await fetch(`${SERVER_URL}/shop/cart`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          productId: id,
          quantity: qty,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // console.log("postCart: ", data);
      if (data.expired) {
        dispatch(uiActions.status({ isAuth: false, user: {} }));
        dispatch(uiActions.loading(false));
        return console.log(data.errorMsg);
      }
      dispatch(uiActions.cart(data));
      dispatch(uiActions.loading(false));
    } catch (err) {
      console.error(err);
    }
  };
};

export default uiSlice;
