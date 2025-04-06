import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state
const initialState = {
  userBlogPayments: [],
  userBlogPayment: {},
  loading: false,
  error: null,
  success: false,
  isUpdated: false,
  isDeleted: false,
  userInfo: {
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
  },
};

// 4000003560000008
// Async Thunks
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/v1/order/new", orderData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/order/${id}`);
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const myOrders = createAsyncThunk(
  "order/myOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/orders/me");
      return data.orders;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getAllOrders = createAsyncThunk(
  "order/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/admin/orders");
      return data.orders;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// export const updateOrder = createAsyncThunk(
//   "order/updateOrder",
//   async ({ id, orderData }, { rejectWithValue }) => {
//     try {
//       console.log("Updating order with ID:", id); // Debugging
//       if (!id) throw new Error("Order ID is undefined!");

//       const { data } = await axios.put(`/api/v1/admin/order/${id}`, orderData);
//       return data.success;
//     } catch (error) {
//       console.error("Update Order Error:", error);
//       return rejectWithValue(error.response?.data?.message || "An error occurred");
//     }
//   }
// );
export const updateOrder = createAsyncThunk("order/update", async ({ id, myForm }, thunkAPI) => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.put(`/api/v1/admin/order/${id}`, myForm, config);
    return data.success;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/admin/order/${id}`);
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Create the slice

const orderSlice = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    orders: [],
    order: {},
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    deleteorderReset: (state) => {
      state.isDeleted = false;
      state.error = null;
    },
    UPDATE_ORDER_RESET: (state) => {
      state.isUpdated = false; // Reset update status
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(myOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(myOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(myOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.isDeleted = false;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOrder.fulfilled, (state) => {
        state.loading = false;
        state.isDeleted = true;
        state.success = true;
      })
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
    })
    .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
    })
    .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase(updateOrder.pending, (state) => {
      state.loading = true;
    })
    .addCase(updateOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.isUpdated = action.payload;
    })
    .addCase(updateOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearErrors, deleteorderReset, UPDATE_ORDER_RESET } = orderSlice.actions;
export default orderSlice.reducer;