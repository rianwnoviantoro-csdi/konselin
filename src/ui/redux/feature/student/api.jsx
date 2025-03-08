import { apiSlice } from "../../api";

export const studentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addStudent: builder.mutation({
      query: (payload) => {
        return {
          url: "addStudent",
          params: payload, // Send the payload as-is
        };
      },
    }),
    getAllStudents: builder.query({
      query: (payload) => ({
        url: "getAllStudent",
        params: payload,
      }),
      providesTags: ["Students"],
    }),
    getAllStudentNames: builder.query({
      query: (payload) => ({
        url: "getAllStudentName",
        params: payload,
      }),
      providesTags: ["Students"],
    }),
    getAllStudentCounsul: builder.query({
      query: (payload) => ({
        url: "getStudentCounsul",
        params: payload,
      }),
      providesTags: ["Students"],
    }),
  }),
});

export const {
  useAddStudentMutation,
  useGetAllStudentsQuery,
  useGetAllStudentCounsulQuery,
} = studentApi;
