import { createApi } from "@reduxjs/toolkit/query/react";

export const baseQuery = async ({ url, params }) => {
  try {
    if (!window.api?.[url]) {
      throw new Error(`Unknown IPC method: ${url}`);
    }

    const result = await window.api[url](params);
    return { data: result }; // Ensure correct format for RTK Query
  } catch (error) {
    console.log(error);
    return { error: { status: "CUSTOM_ERROR", message: error.message } };
  }
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Accounts", "Auth", "Filters", "Students", "Counselings"], // Define tags for caching
  endpoints: (builder) => ({}), // Other slices will extend this
});
