import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api";
import authReducer from "./feature/auth/slice";
import filterReducer from "./feature/filter/slice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    filter: filterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
