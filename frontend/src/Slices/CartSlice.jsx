// // CartSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Define the initial state
// const initialState = {
//   cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
//   shippingInfo: JSON.parse(localStorage.getItem("shippingInfo")) || {},
// };

// // Async Thunks
// // export const addItemsToCart = createAsyncThunk(
// //   "cart/addItemsToCart",
// //   async ({ id, quantity }, { dispatch, getState }) => {
// //     const { data } = await axios.get(`/api/v1/blog/${id}`);
// //     const item = {
// //       blog: data.blog._id,
// //       title: data.blog.title,
// //       description: data.blog.description,
// //       image: data.blog.images[0].url,
// //       quantity,
// //     };

// //     dispatch(cartSlice.actions.addToCart(item));

// //     localStorage.setItem(
// //       "cartItems",
// //       JSON.stringify(getState().cart.cartItems)
// //     );
// //   }
// // );

// // CartSlice.js
// export const addItemsToCart = createAsyncThunk(
//   "cart/addItemsToCart",
//   async ({ id, quantity }, { dispatch, getState }) => {
//     if (!id) {
//       throw new Error("Invalid blog ID");
//     }
//     const { data } = await axios.get(`/api/v1/blog/${id}`);
//     const item = {
//       blog: data.blog._id,
//       title: data.blog.title,
//       description: data.blog.description,
//       image: data.blog.images[0].url,
//       quantity,
//     };

//     dispatch(cartSlice.actions.addToCart(item));

//     localStorage.setItem(
//       "cartItems",
//       JSON.stringify(getState().cart.cartItems)
//     );
//   }
// );

// export const removeItemsFromCart = createAsyncThunk(
//   "cart/removeItemsFromCart",
//   async (id, { dispatch, getState }) => {
//     dispatch(cartSlice.actions.removeCartItem(id));
//     localStorage.setItem(
//       "cartItems",
//       JSON.stringify(getState().cart.cartItems)
//     );
//   }
// );

// export const saveShippingInfo = createAsyncThunk(
//   "cart/saveShippingInfo",
//   async (data, { dispatch }) => {
//     dispatch(cartSlice.actions.sav(data));
//     localStorage.setItem("shippingInfo", JSON.stringify(data));
//   }
// );

// // Create the slice
// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart: (state, action) => {
//       const item = action.payload;
//       const isItemExist = state.cartItems.find((i) => i.blog === item.blog);

//       if (isItemExist) {
//         state.cartItems = state.cartItems.map((i) =>
//           i.blog === isItemExist.blog ? item : i
//         );
//       } else {
//         state.cartItems.push(item);
//       }
//     },
//     removeCartItem: (state, action) => {
//       state.cartItems = state.cartItems.filter(
//         (i) => i.blog !== action.payload
//       );
//     },
//     saveShippingInfo: (state, action) => {
//       state.shippingInfo = action.payload;

//       localStorage.setItem("shippingInfo", JSON.stringify(action.payload));
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(addItemsToCart.fulfilled, (state, action) => {})
//       .addCase(removeItemsFromCart.fulfilled, (state, action) => {})
//       .addCase(saveShippingInfo.fulfilled, (state, action) => {});
//   },
// });

// export const { addToCart, removeCartItem, saveShippingInfo } =
//   cartSlice.actions;

// export const cartReducer = cartSlice.reducer;

// export default cartReducer; // Ensure this default export is used in the store

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state
const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
  userInfo: JSON.parse(localStorage.getItem("userInfo")) || {},
};

// Async Thunks
export const addItemsToCart = createAsyncThunk(
  "cart/addItemsToCart",
  async ({ id, quantity }) => {
    if (!id) {
      throw new Error("Invalid blog ID");
    }
    const { data } = await axios.get(`/api/v1/blog/${id}`);
    const item = {
      blog: data.blog._id,
      title: data.blog.title,
      description: data.blog.description,
      image: data.blog.images[0].url,
      quantity,
    };

    return item; // Return the item to be used in the fulfilled case
  }
);

export const removeItemsFromCart = createAsyncThunk(
  "cart/removeItemsFromCart",
  async (id) => {
    return id; // Return the id to be used in the fulfilled case
  }
);

export const saveShippingInfo = createAsyncThunk(
  "cart/saveShippingInfo",
  async (data) => {
    return data; // Return the data to be used in the fulfilled case
  }
);

// Create the slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const isItemExist = state.cartItems.find((i) => i.blog === item.blog);

      if (isItemExist) {
        state.cartItems = state.cartItems.map((i) =>
          i.blog === isItemExist.blog ? item : i
        );
      } else {
        state.cartItems.push(item);
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (i) => i.blog !== action.payload
      );

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;

      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemsToCart.fulfilled, (state, action) => {
        // Dispatch addToCart action directly to handle item addition
        state.cartItems = [...state.cartItems, action.payload];
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      })
      .addCase(removeItemsFromCart.fulfilled, (state, action) => {
        // Dispatch removeCartItem action directly to handle item removal
        state.cartItems = state.cartItems.filter(
          (i) => i.blog !== action.payload
        );
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      })
      .addCase(saveShippingInfo.fulfilled, (state, action) => {
        // Dispatch saveShippingInfo action directly to handle shipping info save
        state.userInfo = action.payload;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      });
  },
});

// Export actions
export const {
  addToCart,
  removeCartItem,
  saveShippingInfo: saveShippingInfoSync,
} = cartSlice.actions;

// Export the reducer
export const cartReducer = cartSlice.reducer;
export default cartReducer;
