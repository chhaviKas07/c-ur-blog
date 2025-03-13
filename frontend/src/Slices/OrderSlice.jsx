import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state
const initialState = {
  userBlogPayments: [],
  userBlogPayment: {},
  loading: false,
  error: null,
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
export const createUserBlogPayment = createAsyncThunk(
  "userBlogPayments/createUserBlogPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "/api/v1/blogpayment/new",
        paymentData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// export const myUserBlogPayments = createAsyncThunk(
//   "userBlogPayments/myUserBlogPayments",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.get("/api/v1/blogpayment/me");
//       return data.userBlogPayments;
//     } catch (error) {
//       return rejectWithValue(error.response.data.message);
//     }
//   }
// );

export const myBlogPayment = createAsyncThunk(
  "blogPayments/myBlogPayment",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/blogpayments/me");
      return data.userBlogPayments;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllUserBlogPayments = createAsyncThunk(
  "userBlogPayments/getAllUserBlogPayments",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/admin/blogpayments");
      return data.userBlogPayments;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateUserBlogPayment = createAsyncThunk(
  "userBlogPayments/updateUserBlogPayment",
  async ({ id, paymentData }, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.put(
        `/api/v1/admin/blogpayment/${id}`,
        paymentData,
        config
      );
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteUserBlogPayment = createAsyncThunk(
  "userBlogPayments/deleteUserBlogPayment",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/admin/blogpayment/${id}`);
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getUserBlogPaymentDetails = createAsyncThunk(
  "userBlogPayments/getUserBlogPaymentDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/blogpayment/${id}`);
      return data.userBlogPayment;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getAllUserBlogPayment = createAsyncThunk(
  "UserBlogPayments/getAllUserBlogPayment",
  async () => {
    const { data } = await axios.get("/api/v1/admin/blogpayments");
    return data.orders;
  }
);

// Create the slice
const userBlogPaymentSlice = createSlice({
  name: "userBlogPayments",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    deleteBlogPaymentReset: (state) => {
      state.isDeleted = false;
    },
    updateBlogPaymentReset: (state) => {
      state.isUpdated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUserBlogPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUserBlogPayment.fulfilled, (state, action) => {
        console.log("Payment Created:", action.payload); // Debugging log
        state.loading = false;
        state.userBlogPayment = action.payload.userBlogPayment;
      })
      .addCase(createUserBlogPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(myBlogPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(myBlogPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.userBlogPayments = action.payload;
      })
      .addCase(myBlogPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllUserBlogPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUserBlogPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.userBlogPayments = action.payload;
      })
      .addCase(getAllUserBlogPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUserBlogPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserBlogPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
      })
      .addCase(updateUserBlogPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteUserBlogPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserBlogPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = action.payload;
      })
      .addCase(deleteUserBlogPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getUserBlogPaymentDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserBlogPaymentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userBlogPayment = action.payload;
      })
      .addCase(getUserBlogPaymentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllUserBlogPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUserBlogPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getAllUserBlogPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export actions
export const { clearErrors, deleteBlogPaymentReset, updateBlogPaymentReset } =
  userBlogPaymentSlice.actions;

// Export the reducer
export const userBlogPaymentReducer = userBlogPaymentSlice.reducer;
