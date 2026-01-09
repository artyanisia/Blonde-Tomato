import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import sessionReducer from "./sessionSlice";
import requestReducer from "./requestSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sessions: sessionReducer,
    requests: requestReducer
  },
});
