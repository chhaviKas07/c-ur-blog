import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const user = JSON.parse(localStorage.getItem("user"));
// const shippingInfoKey = user && user._id ? `shippingInfo_${user._id}` : null;
// Initial State
// const initialState = {
//   cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
//   // shippingInfo: JSON.parse(localStorage.getItem("shippingInfo")) || {},
//     // shippingInfo: JSON.parse(localStorage.getItem(shippingInfoKey)) || {},
//   shippingInfo: shippingInfoKey
//     ? JSON.parse(localStorage.getItem(shippingInfoKey)) || {}
//     : {},
//   };
const getInitialShippingInfo = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const key = user && user._id ? `shippingInfo_${user._id}` : null;
  if (key) {
    return JSON.parse(localStorage.getItem(key)) || {};
  }
  return {};
};

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
  shippingInfo: getInitialShippingInfo(),
};

// ✅ Cart Slice
const cartSlice = createSlice({
  name: "cart",
  // initialState: {shippingInfo: {},},
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

      // localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      localStorage.setItem(
        "cartItems",
        JSON.stringify(
          state.cartItems.map((item) => ({
            ...item,
            image: item.image || item.images?.[0]?.url || "", // ensure image
            product: item.product || item._id,                // ensure product id
          }))
        )
      );
    },

    removeItemsFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter(item => item.product !== id);
      // localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      localStorage.setItem(
        "cartItems",
        JSON.stringify(
          state.cartItems.map((item) => ({
            ...item,
            image: item.image || item.images?.[0]?.url || "", // ensure image
            product: item.product || item._id,                // ensure product id
          }))
        )
      );
    },
    setShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;

      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user._id && Object.keys(action.payload).length > 0) {
        // Only save if shipping info is not empty
        localStorage.setItem(`shippingInfo_${user._id}`, JSON.stringify(action.payload));
      }
    },
    loadShippingInfoForUser: (state, action) => {
      const userId = action.payload;
      const key = `shippingInfo_${userId}`;
      const info = JSON.parse(localStorage.getItem(key)) || {};
      state.shippingInfo = info;
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(addItemsToCartThunk.pending, () => {
        // console.log("Adding item to cart...");
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

          // ✅ Update other fields as well
          existingItem.name = action.payload.name;
          existingItem.description = action.payload.description;
          existingItem.price = action.payload.price;
          existingItem.image = action.payload.image;
          existingItem.stock = action.payload.stock;
        } else {
          state.cartItems.push({
            product: id,
            quantity: Math.min(delta, stock),
            price: action.payload.price,
            image: action.payload.image,
            name: action.payload.name,
            description: action.payload.description, // ✅ Also here
            stock: action.payload.stock,
          });
        }

        // localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        localStorage.setItem(
          "cartItems",
          JSON.stringify(
            state.cartItems.map((item) => ({
              ...item,
              image: item.image || item.images?.[0]?.url || "", // ensure image
              product: item.product || item._id,                // ensure product id
            }))
          )
        );
      })
      .addCase(removeItemsFromCartThunk.fulfilled, (state, action) => {
        const { product: id, quantity: delta } = action.payload; // Delta is NEGATIVE
        const existingItem = state.cartItems.find(item => item.product === id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + delta;
          existingItem.quantity = Math.max(1, newQuantity); // Don't go below 1

          // localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
          localStorage.setItem(
            "cartItems",
            JSON.stringify(
              state.cartItems.map((item) => ({
                ...item,
                image: item.image || item.images?.[0]?.url || "", // ensure image
                product: item.product || item._id,                // ensure product id
              }))
            )
          );
        }
      })
      .addCase(decrementItemQtyThunk.fulfilled, (state, action) => {
        const { product: id, quantity: delta } = action.payload;
        const existingItem = state.cartItems.find(item => item.product === id);

        if (existingItem && existingItem.quantity > 1) {
          existingItem.quantity += delta; // delta = -1
          // localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
          localStorage.setItem(
            "cartItems",
            JSON.stringify(
              state.cartItems.map((item) => ({
                ...item,
                image: item.image || item.images?.[0]?.url || "", // ensure image
                product: item.product || item._id,                // ensure product id
              }))
            )
          );
        }
      })
      ;

  },
});

// ✅ Thunk: Add Items to Cart
// export const addItemsToCartThunk = createAsyncThunk(
//   "cart/addItem",
//   async ({ id, quantity: delta }, thunkAPI) => {
//     console.log("🛒 Cart Item:", item.name, "Qty:", item.quantity, "Stock:", item.stock);
//     try {
//       const { data } = await axios.get(`/api/v1/product/${id}`);
//       return {
//         product: data.product._id,
//         name: data.product.name,
//         price: data.product.price,
//         image: data.product.images[0]?.url,
//         stock: data.product.stock,
//         quantity: delta // Now represents delta
//       };
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data.message);
//     }
//   }
// );
export const addItemsToCartThunk = createAsyncThunk(
  "cart/addItem",
  async ({ id, quantity: delta }, thunkAPI) => {
    try {
      const { data } = await axios.get(`/api/v1/product/${id}`);
      const product = data.product;
      // console.log("🛒 Cart Item:", product.name, "Qty:", delta, "Stock:", product.stock);

      // return {
      //   product: product._id,
      //   name: product.name,
      //   price: product.price,
      //   image: product.images[0]?.url,
      //   stock: product.stock,
      //   quantity: delta, // delta is change in quantity
      // };
      return {
        product: product._id,
        name: product.name,
        description: product.description, // ✅ ADD THIS
        price: product.price,
        image: product.images[0]?.url,
        stock: product.stock,
        quantity: delta,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
// ✅ Thunk: Remove Items from Cart
// export const removeItemsFromCartThunk = createAsyncThunk(
//   "cart/removeItemsFromCart",
// //   async (id, { dispatch }) => {
// //     dispatch(cartSlice.actions.removeItemsFromCart(id));
// //     return id;
// //   }
// // );
// async ({ id, quantity: delta }, thunkAPI) => {
//   try {
//       const { data } = await axios.get(`/api/v1/product/${id}`);
//       return {
//           product: data.product._id,
//           name: data.product.name,
//           price: data.product.price,
//           image: data.product.images[0]?.url,
//           stock: data.product.stock,
//           quantity: -delta // DELTA is NEGATIVE
//       };
//   } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data.message);
//   }
// }
// );
export const decrementItemQtyThunk = createAsyncThunk(
  "cart/decrementItemQty",
  async ({ id }, thunkAPI) => {
    const { data } = await axios.get(`/api/v1/product/${id}`);
    return {
      product: data.product._id,
      quantity: -1, // negative delta
    };
  }
);
export const removeItemsFromCartThunk = createAsyncThunk(
  "cart/removeItemsFromCart",
  async (id, thunkAPI) => {
    // Directly remove from store
    thunkAPI.dispatch(cartSlice.actions.removeItemsFromCart(id));
    return id;
  }
);

export const saveShippingInfoThunk = createAsyncThunk(
  "cart/saveShippingInfo",
  async (data, { dispatch }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log("💾 Saving shipping info for user:", user?._id, data);

    dispatch(setShippingInfo(data));

    if (user && user._id && Object.keys(data).length > 0) {
      localStorage.setItem(`shippingInfo_${user._id}`, JSON.stringify(data));
      // console.log(
      //   "✅ Shipping info saved:",
      //   localStorage.getItem(`shippingInfo_${user._id}`)
      // );
    }

    return data;
  }
);



export const loadShippingInfo = createAsyncThunk(
  "cart/loadShippingInfo",
  async (_, { dispatch }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) return;

    const saved = localStorage.getItem(`shippingInfo_${user._id}`);
    if (saved) {
      const shippingInfo = JSON.parse(saved);
      dispatch(setShippingInfo(shippingInfo));
    }
  }
);

export const loadShippingInfoForUser = (userId) => (dispatch) => {
  try {
    const key = `shippingInfo_${userId}`;
    const storedShipping = localStorage.getItem(key);
    // console.log("🔍 Trying to load shipping info from localStorage with key:", key);

    if (storedShipping) {
      const parsed = JSON.parse(storedShipping);
      // console.log("✅ Found shipping info:", parsed);
      dispatch(setShippingInfo(parsed));
    } else {
      console.warn("❌ No shipping info found in localStorage for key:", key);
    }
  } catch (err) {
    console.error("💥 Error loading shipping info:", err);
  }
};

export const {
  addItemsToCart: addItemAction,
  removeItemsFromCart,
  setShippingInfo,
  clearCart,
} = cartSlice.actions;

// Export thunks separately (they are not from actions)
// export {saveShippingInfoThunk };

export default cartSlice.reducer;
