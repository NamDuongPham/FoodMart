// import { Product } from "@/types/Product";
import { createSlice } from "@reduxjs/toolkit";
// import reducer from "./reducer";
// interface IProduct {
//   product: Product;
// }
const initState = {
  cart: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: initState,
  reducers: {
    // addToCart: (state, action) => {
    //   state.cart.push(action.payload);
    // },
  },
});

// Action creators are generated for each case reducer function
// export const {addToCart} = cartSlice.actions;

export default cartSlice.reducer;
