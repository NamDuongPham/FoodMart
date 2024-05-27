import { createSlice } from "@reduxjs/toolkit";
import reducer from "./reducer";

export interface AdminType {
  id:string
  email: string;
  name: string;
  nameOfRestaurant: string;
  token: string;
}

const initState = {
  id:"",
  email: "",
  name: "",
  nameOfRestaurant: "",
  token: "",
};

export const adminSlice = createSlice({
  name: "admin",
  initialState: initState,
  reducers: reducer,
});

// Action creators are generated for each case reducer function
export const { updateAdmin, resetAdmin } = adminSlice.actions;

export default adminSlice.reducer;
