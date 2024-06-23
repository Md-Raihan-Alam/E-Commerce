// create slice
// initialize initial state
// slice -> name,mention initial state, actions
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: number;
  name: string;
  price: number;
}

type CartState = CartItem[];

const initialState: CartState = [];
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
    resetCart() {
      return [];
    },
  },
});
export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
