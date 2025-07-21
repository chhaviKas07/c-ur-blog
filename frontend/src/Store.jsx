import { configureStore,combineReducers } from "@reduxjs/toolkit";
import productSlice from "./productSlice"; // ✅ Import the default reducer
import userReducer, {
  updateProfileReducer,
  userAdminReducer
} from "./userSlice";
import userSlice from "./userSlice";
import  cartReducer  from "./CartSlice";
import orderReducer from "./orderSlice";

const reducer = combineReducers({
  products: productSlice,
  user: userSlice,
  cart: cartReducer,
  updateProfile: updateProfileReducer,
  userAdmin: userAdminReducer, 
  orders: orderReducer,
});

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
};

const store = configureStore({
  reducer,
  preloadedState: initialState,
  devTools: process.env.NODE_ENV !== "production", // Enable dev tools only in development
});

export default store;
