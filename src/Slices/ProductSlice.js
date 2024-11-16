import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  product: null, // Stores the currently selected product
  editProduct: false, // Indicates whether we're in edit mode
  loading: false, // Tracks loading state for product-related actions
  error: null, // Stores error messages
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // Set the current product
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    // Clear the current product
    clearProduct: (state) => {
      state.product = null;
    },
    // Toggle edit mode
    setEditProduct: (state, action) => {
      state.editProduct = action.payload;
    },
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Set error messages
    setError: (state, action) => {
      state.error = action.payload;
    },
    // Reset product state to initial values
    resetProductState: (state) => {
      state.product = null;
      state.editProduct = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setProduct,
  clearProduct,
  setEditProduct,
  setLoading,
  setError,
  resetProductState,
} = productSlice.actions;

export default productSlice.reducer;
