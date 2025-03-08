import { apiSlice } from "../../api";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (payload) => ({
        url: "login",
        params: payload,
      }),
      transformResponse: (response) => {
        return {
          ...response,
          data: {
            ...response.data,
            user: {
              ...response.data.user,
              createdAt: new Date(response.data.user.createdAt).toISOString(),
              updatedAt: new Date(response.data.user.updatedAt).toISOString(),
            },
          },
        };
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
