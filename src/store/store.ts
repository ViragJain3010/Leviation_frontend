import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "@/Slice/Auth.Slice";
import ProductReducer from "@/Slice/Product.Slice";

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    products: ProductReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
