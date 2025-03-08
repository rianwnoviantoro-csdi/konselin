import { apiSlice } from "../../api";

export const filterApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    filterStudentName: builder.query({
      query: () => ({
        url: "filterStudentName",
      }),
      providesTags: ["Filters"],
    }),
    filterCounsulerName: builder.query({
      query: () => ({
        url: "filterCounsulerName",
      }),
      providesTags: ["Filters"],
    }),
    filterClass: builder.query({
      query: () => ({
        url: "filterClass",
      }),
      providesTags: ["Filters"],
    }),
    filterCounselingType: builder.query({
      query: () => ({
        url: "filterCounselingType",
      }),
      providesTags: ["Filters"],
    }),
  }),
});

export const {
  useFilterStudentNameQuery,
  useFilterClassQuery,
  useFilterCounsulerNameQuery,
  useFilterCounselingTypeQuery,
} = filterApi;
