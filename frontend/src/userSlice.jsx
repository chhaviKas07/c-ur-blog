import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/v1/login",
      { email, password },
      config
    );
    dispatch(loginSuccess(data.user));
  } catch (error) {
    console.error(
      "Login Error:",
      error.response ? error.response.data : error.message
    );
    dispatch(
      loginFail(error.response ? error.response.data.message : error.message)
    );
  }
};


export const register = createAsyncThunk("user/register", async (userData, thunkAPI) => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.post("/api/v1/register", userData, config);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

//  Load User
// export const loadUser = createAsyncThunk(
//   "user/loadUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get("/api/v1/me");
//       return response.data.user;
//     } catch (error) {
//       return rejectWithValue(
//         error.response ? error.response.data.message : error.message
//       );
//     }
//   }
// );
export const loadUser = createAsyncThunk("user/loadUser", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("/api/v1/me");
    return data.user;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Don't show toast here, just return
      return rejectWithValue(null);
    }
    return rejectWithValue(error.response.data.message);
  }
});


// logout user
export const logout = () => async (dispatch) => {
  try {
    await axios.get(`/api/v1/logout`);
    dispatch(logoutSuccess());
  } catch (error) {
    // Handle error
  }
};


export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("Sending formData:", userData); // Debugging

      const config = {
        headers: {
          "Content-Type": "multipart/form-data", // Allow file uploads
        },
        withCredentials: true,
      };

      const { data } = await axios.put("/api/v1/me/update", userData, config);
      return data.success;
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);



// updating password
export const updatePassword = createAsyncThunk(
  "profile/updatePassword",
  async (passwords, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.put(
        "/api/v1/password/update",
        passwords,
        config
      );
      return data.success; // Adjust based on your API response
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `/api/v1/password/forgot`,
        { email },
        config
      );
      return data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, passwords }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `/api/v1/password/reset/${token}`,
        passwords,
        { headers: { "Content-Type": "application/json" } }
      );
      return data.success;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);

export const getAllUsers = createAsyncThunk("users/getAllUsers", async () => {
  const { data } = await axios.get("/api/v1/admin/users");
  return data.users;
});

export const getUserDetails = createAsyncThunk(
  "users/getUserDetails",
  async (id) => {
    const { data } = await axios.get(`/api/v1/admin/user/${id}`);
    return data.user;
  }
);

export const updateUser = createAsyncThunk(
  "userAdmin/updateUser",
  async ({ id, userData }, thunkAPI) => {
    try {
      const { data } = await axios.put(`/api/v1/admin/user/${id}`, userData);
      return data.success;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);


export const deleteUser = createAsyncThunk(
  "profile/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/admin/user/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  user: {},
  loading: false,
  isAuthenticated: false,
  error: null,
  isUpdated: false,
  isPasswordUpdated: false,
  message: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFail: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.isAuthenticated = false;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      });
  },
});

const updateProfileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileErrors: (state) => {
      state.error = null;
    },
    updateProfileReset: (state) => {
      state.isUpdated = false;
    },
    updatePasswordReset: (state) => {
      state.isPasswordUpdated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.isPasswordUpdated = action.payload;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const userAdminSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearAdminErrors: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    deleteUserReset: (state) => {
      state.isDeleted = false;
    },
    updateUserReset: (state) => {
      state.isUpdated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase("UPDATE_USER_REQUEST", (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export Actions and Reducer
export const { clearProfileErrors, updateProfileReset, updatePasswordReset } =
  updateProfileSlice.actions;

export const {
  loginRequest,
  loginSuccess,
  loginFail,
  logoutSuccess,
  registerRequest,
  registerSuccess,
  registerFail,
  clearErrors,
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
} = userSlice.actions;

export const userReducer = userSlice.reducer;

export const updateProfileReducer = updateProfileSlice.reducer;

export const {
  clearAdminErrors,
  clearSuccess,
  deleteUserReset,
  updateUserReset,
} = userAdminSlice.actions;

export const userAdminReducer = userAdminSlice.reducer;



export default userSlice.reducer;
