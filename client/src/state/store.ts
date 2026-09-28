import { configureStore } from "@reduxjs/toolkit";
import authReducer, { sessionExpired } from "./authSlice";
import productsReducer from "./productsSlice";
import { setUnauthorizedHandler } from "../api/axiosInstance";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
  },
});

setUnauthorizedHandler(() => {
  store.dispatch(sessionExpired());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
