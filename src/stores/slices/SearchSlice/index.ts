import { createSlice } from "@reduxjs/toolkit";
import reducer from "./reducer";

export interface SearchType {
  name: string;
  searchAt: number;
  searches?:[] | undefined
}

const initState: { searches: SearchType[] } = {
  searches: [],
};

export const searchSlice = createSlice({
  name: "search",
  initialState: initState,
  reducers: reducer,
});

export const { updateSearch, resetSearch,deleteSearch } = searchSlice.actions;
export default searchSlice.reducer;
