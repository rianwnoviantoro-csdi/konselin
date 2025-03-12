import { apiSlice } from "../../api";

export const accountApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAccountNames: builder.query({
      query: () => ({
        url: "getAccountNames",
      }),
      providesTags: ["Accounts"],
    }),
    register: builder.mutation({
      query: (payload) => {
        return {
          url: "register",
          params: payload, // Send the payload as-is
        };
      },
    }),
    changePassword: builder.mutation({
      query: (payload) => {
        return {
          url: "changePassword",
          params: payload, // Send the payload as-is
        };
      },
    }),
    getAllAccounts: builder.query({
      query: (payload) => ({
        url: "getAllAccounts",
        params: payload,
      }),
      providesTags: ["Accounts"],
    }),
  }),
});

export const {
  useGetAccountNamesQuery,
  useRegisterMutation,
  useChangePasswordMutation,
  useGetAllAccountsQuery,
} = accountApi;
