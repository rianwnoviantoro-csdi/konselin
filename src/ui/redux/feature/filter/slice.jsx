import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    searchValue: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const { searchValue } = filterSlice.actions;

export default filterSlice.reducer;
export const selectCurrentSearchValue = (state) => state.filter.search;
