import { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from ".";

const updateUser: CaseReducer<UserType, PayloadAction<UserType>> = (
  state,
  action
) => ({ ...state, ...action.payload });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resetUser: CaseReducer<UserType> = (state, _) => {
  return {
    ...state,
    uid: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    token: "",
  };
};
export default {
  updateUser,
  resetUser,
};
