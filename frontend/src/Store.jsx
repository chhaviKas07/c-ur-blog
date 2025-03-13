import { configureStore } from "@reduxjs/toolkit";
import {
  blogReducer,
  blogDetailsReducer,
  reviewReducer,
  adminBlogReducer,
} from "./Slices/ProductSlice";

import {
  userReducer,
  // loadUserReducer,
  updateProfileReducer,
  userAdminReducer,
} from "./Slices/UserSlice";

import { cartReducer } from "./Slices/CartSlice";

import { userBlogPaymentReducer } from "./Slices/OrderSlice";

const Store = configureStore({
  reducer: {
    blogs: blogReducer,
    blogDetails: blogDetailsReducer,
    user: userReducer,
    // loadUser: loadUserReducer,
    updateProfile: updateProfileReducer,
    cart: cartReducer,
    orders: userBlogPaymentReducer,
    userReviews: reviewReducer,
    adminBlogs: adminBlogReducer,
    userAdmin: userAdminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default Store;
