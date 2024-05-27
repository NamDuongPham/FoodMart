import { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import { AdminType } from ".";

const updateAdmin: CaseReducer<AdminType, PayloadAction<AdminType>> = (
  state,
  action
) => {
  return {
    ...state,
    id: action.payload.id,
    name: action.payload.name,
    email: action.payload.email,
    nameOfRestaurant: action.payload.nameOfRestaurant,
    token: action.payload.token,
  };
};

const resetAdmin: CaseReducer<AdminType> = (state, _) => {
  return {
    ...state,
    id: "",
    name: "",
    email: "",
    nameOfRestaurant: "",
    token: "",
  };
};
export default {
  updateAdmin,
  resetAdmin,
};
