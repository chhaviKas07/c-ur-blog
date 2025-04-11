// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Initial State
// const initialState = {
//   cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
//   shippingInfo: JSON.parse(localStorage.getItem("shippingInfo")) || {},
// };

// // ✅ Cart Slice
// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addItemsToCart: (state, action) => {
//       const { product, quantity, price, image, name, description, stock } = action.payload;
//       const existingItem = state.cartItems.find((item) => item.product === product);

//       if (existingItem) {
//         existingItem.quantity = quantity;
//       } else {
//         state.cartItems.push({ product, quantity, price, image, name, description, stock });
//       }

//       localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
//     },

//     removeItemsFromCart: (state, action) => {
//       const id = action.payload;
//       state.cartItems = state.cartItems.filter(item => item.product !== id);
//       localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
//     },

//     setShippingInfo: (state, action) => {
//       state.shippingInfo = action.payload;
//       localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//     .addCase(addItemsToCartThunk.pending, () => {
//       console.log("Adding item to cart...");
//     })
//     .addCase(addItemsToCartThunk.fulfilled, (state, action) => {
//       const item = action.payload;
//       const existingItem = state.cartItems.find(i => i.product === item.product);
    
//       console.log("🛒 Existing Item in Cart:", existingItem);
//       console.log("🛒 Incoming Item Quantity:", item.quantity);
    
//       if (existingItem) {
//         existingItem.quantity = item.quantity;
//       } else {
//         state.cartItems.push({
//           product: item.product,
//           name: item.name,
//           price: item.price,
//           image: item.image,
//           description: item.description,
//           stock: item.stock,
//           quantity: item.quantity,
//         });
//       }
    
//       localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
//     });
    
//   },
// });

// // ✅ Thunk: Add Items to Cart
// export const addItemsToCartThunk = createAsyncThunk(
//   "cart/addItem",
//   async ({ id, quantity }, thunkAPI) => {
//     try {
//       const { data } = await axios.get(`/api/v1/product/${id}`);
//       const product = data.product; // ✅ this is necessary!

//       return {
//         product: product._id,
//         name: product.name,
//         price: product.price,
//         image: product.images[0].url,
//         stock: product.stock,
//         description: product.description, // optional
//         quantity,
//       };
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data.message);
//     }
//   }
// );

// // ✅ Thunk: Remove Items from Cart
// export const removeItemsFromCartThunk = createAsyncThunk(
//   "cart/removeItemsFromCart",
//   async (id, { dispatch }) => {
//     dispatch(cartSlice.actions.removeItemsFromCart(id));
//     return id;
//   }
// );

// // ✅ Thunk: Save Shipping Info
// export const saveShippingInfo = createAsyncThunk(
//   "cart/saveShippingInfo",
//   async (data, { dispatch }) => {
//     dispatch(cartSlice.actions.setShippingInfo(data));
//     return data;
//   }
// );

// // ✅ Exports
// export const {
//   addItemsToCart: addItemAction,
//   removeItemsFromCart,
//   setShippingInfo
// } = cartSlice.actions;

// export default cartSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial State
const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
  shippingInfo: JSON.parse(localStorage.getItem("shippingInfo")) || {},
};

// ✅ Cart Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemsToCart: (state, action) => {
      const { product, quantity, price, image, name, description, stock } = action.payload;
      const existingItem = state.cartItems.find((item) => item.product === product);

      if (existingItem) {
        existingItem.quantity = quantity;
      } else {
        state.cartItems.push({ product, quantity, price, image, name, description, stock });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    removeItemsFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter(item => item.product !== id);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    setShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    }
  },

  extraReducers: (builder) => {
    builder
    .addCase(addItemsToCartThunk.pending, () => {
      console.log("Adding item to cart...");
    })
    .addCase(addItemsToCartThunk.fulfilled, (state, action) => {
      const { product: id, quantity: delta, stock } = action.payload;
      const existingItem = state.cartItems.find(item => item.product === id);

      if (existingItem) {
        const availableStock = stock - existingItem.quantity;
        const safeAddition = Math.min(delta, availableStock);
        
        if (safeAddition <= 0) {
          console.warn("❌ Stock limit reached");
          return;
        }
        
        existingItem.quantity += safeAddition;
      } else {
        state.cartItems.push({
          product: id,
          quantity: Math.min(delta, stock),
          price: action.payload.price,
          image: action.payload.image,
          name: action.payload.name,
          stock: action.payload.stock
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    })
    .addCase(removeItemsFromCartThunk.fulfilled, (state, action) => {
      const { product: id, quantity: delta } = action.payload; // Delta is NEGATIVE
      const existingItem = state.cartItems.find(item => item.product === id);

      if (existingItem) {
          const newQuantity = existingItem.quantity + delta;
          existingItem.quantity = Math.max(1, newQuantity); // Don't go below 1

          localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
  });
    
  },
});

// ✅ Thunk: Add Items to Cart
export const addItemsToCartThunk = createAsyncThunk(
  "cart/addItem",
  async ({ id, quantity: delta }, thunkAPI) => {
    try {
      const { data } = await axios.get(`/api/v1/product/${id}`);
      return {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0]?.url,
        stock: data.product.stock,
        quantity: delta // Now represents delta
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
// ✅ Thunk: Remove Items from Cart
export const removeItemsFromCartThunk = createAsyncThunk(
  "cart/removeItemsFromCart",
//   async (id, { dispatch }) => {
//     dispatch(cartSlice.actions.removeItemsFromCart(id));
//     return id;
//   }
// );
async ({ id, quantity: delta }, thunkAPI) => {
  try {
      const { data } = await axios.get(`/api/v1/product/${id}`);
      return {
          product: data.product._id,
          name: data.product.name,
          price: data.product.price,
          image: data.product.images[0]?.url,
          stock: data.product.stock,
          quantity: -delta // DELTA is NEGATIVE
      };
  } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
  }
}
);

// ✅ Thunk: Save Shipping Info
export const saveShippingInfo = createAsyncThunk(
  "cart/saveShippingInfo",
  async (data, { dispatch }) => {
    dispatch(cartSlice.actions.setShippingInfo(data));
    return data;
  }
);

// ✅ Exports
export const {
  addItemsToCart: addItemAction,
  removeItemsFromCart,
  setShippingInfo,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
