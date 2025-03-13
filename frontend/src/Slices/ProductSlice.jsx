import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk action to fetch blogs with search functionality
export const getBlogs = createAsyncThunk(
  "blogs/getBlogs",
  async (
    { keyword = "", currentPage = 1, category, likes = 0 },
    { rejectWithValue }
  ) => {
    try {
      let link = `/api/v1/blogs?keyword=${keyword}&page=${currentPage}&likes[gte]=${likes}`;
      if (category) {
        link = `/api/v1/blogs?keyword=${keyword}&page=${currentPage}&category=${category}&likes[gte]=${likes}`;
      }

      const { data } = await axios.get(link);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk action to fetch blog details by ID
export const getBlogDetails = createAsyncThunk(
  "blogs/getBlogDetails",
  async (id) => {
    try {
      const response = await axios.get(`/api/v1/blog/${id}`);
      return response.data.blog; // Ensure this returns the correct data structure
    } catch (error) {
      throw new Error("Error fetching blog details: " + error.message);
    }
  }
);

export const newReview = createAsyncThunk(
  "reviews/newReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.put(`/api/v1/review`, reviewData, config);
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getAllReviews = createAsyncThunk(
  "reviews/getAllReviews",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/reviews?id=${id}`);
      return data.reviews;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteReviews = createAsyncThunk(
  "reviews/deleteReviews",
  async ({ reviewId, blogId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/reviews?id=${reviewId}&blogId=${blogId}`
      );
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getAdminBlog = createAsyncThunk(
  "adminBlogs/getAdminBlog",
  async () => {
    const { data } = await axios.get("/api/v1/admin/blogs");
    return data.blogs;
  }
);

// export const createBlog = createAsyncThunk(
//   "blogs/createBlog",
//   async (blogData) => {
//     const config = { headers: { "Content-Type": "application/json" } };
//     const { data } = await axios.post(
//       "/api/v1/admin/blog/new",
//       blogData,
//       config
//     );
//     return data;
//   }
// );

// export const createBlog = createAsyncThunk(
//   "blogs/createBlog",
//   async (blogData, { rejectWithValue }) => {
//     try {
//       const config = { headers: { "Content-Type": "multipart/form-data" } };
//       const { data } = await axios.post(
//         "/api/v1/admin/blog/new",
//         blogData,
//         config
//       );
//       if (data && Array.isArray(data.images)) {
//         return data;
//       }
//       throw new Error("Invalid response format");
//     } catch (error) {
//       console.error(
//         "Error creating blog:",
//         error.response ? error.response.data.message : error.message
//       );
//       return rejectWithValue(
//         error.response ? error.response.data.message : error.message
//       );
//     }
//   }
// );

export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (myForm, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await axios.post(
        "/api/v1/admin/blog/new",
        myForm,
        config
      );
      console.log("API Response:", data); // Log the response for debugging

      return {
        success: data.success,
        blog: data.blog,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, blogData }) => {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.put(
      `/api/v1/admin/blog/${id}`,
      blogData,
      config
    );
    return data.success;
  }
);

export const deleteBlog = createAsyncThunk("blogs/deleteBlog", async (id) => {
  const { data } = await axios.delete(`/api/v1/admin/blog/${id}`);
  return data.success;
});

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    loading: false,
    error: null,
    blogsCount: 0,
    resultPerPage: 0,
    filteredBlogsCount: 0,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs;
        state.blogsCount = action.payload.blogsCount;
        state.resultPerPage = action.payload.resultPerPage;
        state.filteredBlogsCount = action.payload.filteredBlogsCount;
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const blogDetailsSlice = createSlice({
  name: "blogDetails",
  initialState: {
    blog: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBlogDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.blog = action.payload;
        state.error = null;
      })
      .addCase(getBlogDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    newReview: { loading: false, success: false, error: null },
    allReviews: { reviews: [], loading: false, error: null },
    deleteReview: { loading: false, isDeleted: false, error: null },
  },
  reducers: {
    clearReviewErrors: (state, action) => {
      state.newReview.error = null;
      state.allReviews.error = null;
      state.deleteReview.error = null;
    },
    resetNewReview: (state) => {
      state.newReview.success = false;
    },
    resetDeleteReview: (state) => {
      state.deleteReview.isDeleted = false;
    },
  },
  extraReducers: (builder) => {
    // New Review
    builder
      .addCase(newReview.pending, (state) => {
        state.newReview.loading = true;
      })
      .addCase(newReview.fulfilled, (state, action) => {
        state.newReview.loading = false;
        state.newReview.success = action.payload;
      })
      .addCase(newReview.rejected, (state, action) => {
        state.newReview.loading = false;
        state.newReview.error = action.payload;
      });

    // Get All Reviews
    builder
      .addCase(getAllReviews.pending, (state) => {
        state.allReviews.loading = true;
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.allReviews.loading = false;
        state.allReviews.reviews = action.payload;
      })
      .addCase(getAllReviews.rejected, (state, action) => {
        state.allReviews.loading = false;
        state.allReviews.error = action.payload;
      });

    // Delete Review
    builder
      .addCase(deleteReviews.pending, (state) => {
        state.deleteReview.loading = true;
      })
      .addCase(deleteReviews.fulfilled, (state, action) => {
        state.deleteReview.loading = false;
        state.deleteReview.isDeleted = action.payload;
      })
      .addCase(deleteReviews.rejected, (state, action) => {
        state.deleteReview.loading = false;
        state.deleteReview.error = action.payload;
      });
  },
});

const adminblogSlice = createSlice({
  name: "adminBlogs",
  initialState: {
    blogs: [],
    loading: false,
    error: null,
    success: false,
    blog: null,
    isUpdated: false,
    isDeleted: false,
  },
  reducers: {
    clearAdminErrors: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    deleteBlogReset: (state) => {
      state.isDeleted = false;
    },
    updateBlogReset: (state) => {
      state.isUpdated = false;
    },
    newBlogRequest(state) {
      state.loading = true;
    },
    newBlogSuccess(state, action) {
      state.loading = false;
      state.success = action.payload.success;
      state.blog = action.payload.blog;
    },
    newBlogFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    newBlogReset(state) {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(getAdminBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.blog = action.payload.blog;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = action.payload;
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearErrors: clearBlogErrors } = blogSlice.actions;
export const { clearErrors: clearBlogDetailErrors } = blogDetailsSlice.actions;
export const { clearReviewErrors, resetNewReview, resetDeleteReview } =
  reviewSlice.actions;
// Export Actions and Reducer
export const {
  clearAdminErrors,
  clearSuccess,
  deleteBlogReset,
  updateBlogReset,
  newBlogRequest,
  newBlogSuccess,
  newBlogFail,
  newBlogReset,
} = adminblogSlice.actions;

export const blogReducer = blogSlice.reducer;
export const blogDetailsReducer = blogDetailsSlice.reducer;
export const reviewReducer = reviewSlice.reducer;
export const adminBlogReducer = adminblogSlice.reducer;
