// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Define initial state
// const initialState = {
//   cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
//   shippingInfo: JSON.parse(localStorage.getItem("shippingInfo")) || {},
  
// };

// // Async Thunks
// export const addItemsToCart = createAsyncThunk(
//   "cart/addItemsToCart",
//   async ({ id, quantity }, { dispatch, getState, rejectWithValue }) => {
//     try {
//       if (!id || typeof id !== "string") {
//         throw new Error("Invalid product ID");
//       }

//       console.log("Fetching product with ID:", id);
//       const { data } = await axios.get(`/api/v1/product/${id}`);

//       if (!data.product || data.product.stock === undefined) {
//         throw new Error("Product not found or stock unavailable");
//       }

//       const item = {
//         product: data.product._id,
//         name: data.product.name,
//         description: data.product.description,
//         image: data.product.images[0].url,
//         price: data.product.price,
//         quantity,
//         stock: data.product.stock,  // ✅ Ensure stock is included
//       };

//       dispatch(cartSlice.actions.addItemsToCart(item));
//       localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));

//       return item;
//     } catch (error) {
//       console.error("Error fetching product:", error.message);
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );


// export const removeItemsFromCart = createAsyncThunk(
//   "cart/removeItemsFromCart",
//   async (id, { dispatch, getState }) => {
//     dispatch(removeItem(id)); // ✅ Fixed action name

//     // ✅ Update localStorage correctly
//     localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
//   }
// );

//  export const saveShippingInfo = createAsyncThunk(
//     "cart/saveShippingInfo",
//     async (data, { dispatch }) => {
//       dispatch(cartSlice.actions.setShippingInfo(data));
//       localStorage.setItem("shippingInfo", JSON.stringify(data));
//     }
//   );
  
// // Create the slice
// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addItem: (state, action) => {  // ✅ Renamed from addItemsToCart to avoid conflict
//       const { product, quantity, price, image, name, description, stock } = action.payload;

//       console.log("🛠 Debug: Adding to cart", { product, quantity, stock });

//       if (!product) {
//         console.error("❌ Error: No product ID provided to add to cart.");
//         return;
//       }

//       const existingItem = state.cartItems.find((item) => item.product === product);

//       if (existingItem) {
//         existingItem.quantity = quantity;
//       } else {
//         state.cartItems.push({ product, quantity, price, image, name, description, stock });
//       }

//       localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
//     },

//     removeItemsFromCart: (state, action) => {
//       console.log("🗑 Removing item from cart:", action.payload);
//       state.cartItems = state.cartItems.filter((item) => item.product !== action.payload);
//       localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
//     },    
    
//     setShippingInfo: (state, action) => {
//       state.shippingInfo = action.payload;
//       localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
//     },
//   },
// });

// // ✅ Export corrected actions
// export const { addItem, removeItem, setShippingInfo } = cartSlice.actions;

// // ✅ Export reducer
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
  },

  extraReducers: (builder) => {
    builder
      .addCase(addItemsToCartThunk.pending, () => {
        console.log("Adding item to cart...");
      })
      .addCase(addItemsToCartThunk.fulfilled, (state, action) => {
        const item = action.payload;
        const existingItemIndex = state.cartItems.findIndex(
          (i) => i.product === item.product
        );
      
        if (existingItemIndex !== -1) {
          // ✅ Update quantity only
          state.cartItems[existingItemIndex].quantity = item.quantity;
        } else {
          state.cartItems.push(item);
        }
      })
  },
});

// ✅ Thunk: Add Items to Cart
export const addItemsToCartThunk = createAsyncThunk(
  "cart/addItemsToCart",
  async ({ id, quantity }, { dispatch, rejectWithValue }) => {
    try {
      if (!id || typeof id !== "string") {
        throw new Error("Invalid product ID");
      }

      const { data } = await axios.get(`/api/v1/product/${id}`);

      if (!data.product || data.product.stock === undefined) {
        throw new Error("Product not found or stock unavailable");
      }

      const item = {
        product: data.product._id,
        name: data.product.name,
        description: data.product.description,
        image: data.product.images?.[0]?.url || "default.jpg",
        price: data.product.price,
        quantity,
        stock: data.product.stock,
      };

      dispatch(cartSlice.actions.addItemsToCart(item));
      return item;
    } catch (error) {
      console.error("Error fetching product:", error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Thunk: Remove Items from Cart
export const removeItemsFromCartThunk = createAsyncThunk(
  "cart/removeItemsFromCart",
  async (id, { dispatch }) => {
    dispatch(cartSlice.actions.removeItemsFromCart(id));
    return id;
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
  setShippingInfo
} = cartSlice.actions;

export default cartSlice.reducer;
