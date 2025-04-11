import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from "react-toastify";

// Get products
// export const getProducts = createAsyncThunk(
//     "products/getProducts",
//     async ({ keyword = "", page = 1, price = [0, 25000], category = "", ratings = 0 }) => {
//       try {
//         let query = `/api/v1/products?keyword=${keyword}&page=${page}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;
//         if (category) {
//           query += `&category=${category}`;
//         }
  
//         console.log("Fetching from API:", query); // Debugging
  
//         const { data } = await axios.get(query);
//         return data;
//       } catch (error) {
//         throw new Error(error.response?.data?.message || "Failed to fetch products");
//       }
//     }
//   );

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async ({ keyword = "", currentPage = 1, price = [0, 25000], category = "", ratings = 0 }, thunkAPI) => {
    try {
      let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;

      if (category) {
        link += `&category=${category}`;
      }

      const { data } = await axios.get(link);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);



// Get product details
export const getProductDetails = createAsyncThunk(
  'product/getProductDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/product/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getAllProductsAdmin = createAsyncThunk(
  "products/getAllAdmin",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get("/api/v1/admin/products");
      return data.products; // assuming you return only the array
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);


// Create new product
// export const createProduct = createAsyncThunk(
//   'product/createProduct',
//   async (productData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`/api/v1/admin/product/new`, productData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data.message);
//     }
//   }
// );
// export const createProduct = createAsyncThunk(
//   "product/createProduct",
//   async (productData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`/api/v1/admin/product/new`, productData);
//       return response.data;
//     } catch (error) {
//       console.error("Create Product Error:", error);
//       return rejectWithValue(error.response?.data?.message || "Something went wrong");
//     }
//   }
// );

// export const createProduct = createAsyncThunk(
//   "product/create",
//   async (productData, { rejectWithValue }) => {
//     try {
//       const config = { headers: { "Content-Type": "application/json" } };
//       const { data } = await axios.post("/api/v1/admin/product/new", productData, config);
      
//       console.log("Created Product Response:", data); // Debugging log
//       return data.product; // Ensure product is returned
//     } catch (error) {
//       return rejectWithValue(error.response.data.message);
//     }
//   }
// );
export const createProduct = createAsyncThunk(
  "product/create",
  async (productData, thunkAPI) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      const { data } = await axios.post(`/api/v1/admin/product/new`, productData, config);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);




// Create new review
// export const createReview = createAsyncThunk(
//   'product/createReview',
//   async (reviewData, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(`/api/v1/review`, reviewData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data.message);
//     }
//   }
// );

export const createReview = createAsyncThunk(
  'product/createReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/v1/review`, reviewData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);



// Get all reviews
export const getReviews = createAsyncThunk(
  'product/getReviews',
  async (productId, { rejectWithValue }) => {
    try {
      // const response = await axios.get(`/api/v1/reviews?productId=${productId}`);
      const response = await axios.get(`/api/v1/reviews?id=${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/v1/admin/product/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/v1/admin/product/${id}`, productData, {
      headers: { "Content-Type":"application/json",},
    });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async ({ reviewId, productId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/reviews?id=${reviewId}&productId=${productId}`);
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);



// Product slice
const productSlice = createSlice({
    name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
    products: [],
    product: {}, // ✅ Stores a single product
    success: false,
    reviews: [], // ✅ Stores reviews
    isDeleted: false, // ✅ Tracks deletion
    isUpdated: false, // ✅ Tracks updates
    productsCount: 0,
    resultPerPage: 0,
    filteredProductsCount: 0,
  },
    reducers: {
      clearErrors: (state) => {
        state.error = null;
      },
      resetSuccess: (state) => {
        state.success = false;
      },
      NEW_REVIEW_RESET: (state) => {
        state.success = false;
      },
      resetDeleteState: (state) => {
        state.isDeleted = false;
        state.deleteError = null;
      },
      newProductReset: (state) => {
        state.success = false;
        state.error = null;
      },
      resetDeleteReview: (state) => {
        state.isDeleted = false;
        state.error = null;
      },
      UPDATE_PRODUCT_RESET: (state) => {
        state.isUpdated = false; // Reset update state
      },
    },
  extraReducers: (builder) => {
    builder
      // Get products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      // .addCase(getProducts.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.products = action.payload.products;
      // })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Redux Payload:", action.payload); 
        state.products = action.payload.products || [];
  state.productsCount = action.payload.productsCount;
  state.resultPerPage = action.payload.resultPerPage;
  state.filteredProductsCount = action.payload.filteredProductsCount || 0;
      })      
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get product details
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllProductsAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProductsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.adminProducts = action.payload;
      })
      .addCase(getAllProductsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create new product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products.push(action.payload); // Add new product to state
        toast.success("Product Created Successfully");
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Something went wrong");
      })

      // Create new review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // Get reviews
      .addCase(getReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
        state.isDeleted = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.loading = false;
        state.isUpdated = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Delete Review Success
      .addCase(deleteReview.fulfilled, (state) => {
        state.loading = false;
        state.isDeleted = true;
      })
      // Delete Review Failure
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors,resetSuccess, NEW_REVIEW_RESET, resetDeleteState, newProductReset,resetDeleteReview,UPDATE_PRODUCT_RESET } = productSlice.actions;

export default productSlice.reducer;
