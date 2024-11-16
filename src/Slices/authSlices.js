import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  signupData: null, // Stores data from the signup process
  loading: false, // Indicates loading state for auth-related actions
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null, // Retrieve token from localStorage if available
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Save signup data
    setSignupData(state, action) {
      state.signupData = action.payload;
    },
    // Toggle loading state
    setLoading(state, action) {
      state.loading = action.payload;
    },
    // Set token and save it in localStorage
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem("token", JSON.stringify(action.payload)); // Save token to localStorage
    },
    // Clear token and remove it from localStorage
    clearToken(state) {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setSignupData, setLoading, setToken, clearToken } = authSlice.actions;

export default authSlice.reducer;
