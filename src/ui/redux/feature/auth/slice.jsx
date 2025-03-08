import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  account: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.account = action.payload.data.user;
      state.token = action.payload.data.token;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logout: (state) => {
      state.account = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentAccount = (state) => state.auth.account;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
