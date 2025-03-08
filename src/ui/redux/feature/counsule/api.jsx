import { apiSlice } from "../../api";

export const counsuleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCounseling: builder.mutation({
      query: (payload) => {
        return {
          url: "addCounseling",
          params: payload, // Send the payload as-is
        };
      },
    }),
    getStudentCounsul: builder.query({
      query: (payload) => ({
        url: "getStudentCounsul",
        params: payload,
      }),
      providesTags: ["Counselings"],
    }),
    getAllCounseling: builder.query({
      query: (payload) => ({
        url: "getAllCounseling",
        params: payload,
      }),
      providesTags: ["Counselings"],
    }),
    getCounselingById: builder.query({
      query: (payload) => ({
        url: "getCounselingById",
        params: payload,
      }),
      providesTags: ["Counselings"],
    }),
  }),
});

export const {
  useAddCounselingMutation,
  useGetStudentCounsulQuery,
  useGetAllCounselingQuery,
  useGetCounselingByIdQuery,
} = counsuleApi;
