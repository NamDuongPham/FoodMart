import { createSlice } from "@reduxjs/toolkit";
import reducer from "./reducer";

export interface UserType {
  uid:string
  email: string;
  name: string;
  phone: string;
  address: string;
  token: string;
}

const initState = {
  uid:"",
  email: "",
  name: "",
  phone: "",
  address: "",
  token: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: initState,
  reducers: reducer,
});

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
