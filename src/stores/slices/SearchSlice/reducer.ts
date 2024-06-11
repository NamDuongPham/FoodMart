import { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import { SearchType } from "./";

const updateSearch: CaseReducer<
  { searches: SearchType[] },
  PayloadAction<SearchType>
> = (state, action) => {
  return {
    ...state,
    searches: [...state.searches, action.payload],
  };
};

const resetSearch: CaseReducer<{ searches: SearchType[] }> = (state) => {
  return {
    ...state,
    searches: [],
  };
};
const deleteSearch: CaseReducer<{ searches: SearchType[] },PayloadAction<string>> = (state, action) => {
  state.searches = state.searches.filter((search) => search.name !== action.payload);
};
export default {
  updateSearch,
  resetSearch,
  deleteSearch,
};
