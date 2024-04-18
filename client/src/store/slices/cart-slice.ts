// create slice
// initialize initial state
// slice -> name,mention initial state, actions
import { createSlice } from "@reduxjs/toolkit";
const initialState: any = [];
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      console.log(action);
      state.push(action.payload);
    },
    removeFromCart(state, action) {
      return state.filter((item: any) => item.id !== action.payload);
    },
  },
});
export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
