import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Helper pentru localStorage
const saveAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const initialState = {
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user")),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

// Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      return {
        token: data.token,
        user: { id: data.userId, role: data.role, name: data.name },
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login error");
    }
  }
);

// Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/register`, userData);
      return { token: data.token, user: data.user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration error"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      clearAuth();
    },
  },
  extraReducers: (builder) => {
    // Pending pentru ambele
    builder.addMatcher(
      (action) => action.type.endsWith("/pending"),
      (state, action) => {
        console.log("Pending:", action.type);
        state.loading = true;
        state.error = null;
      }
    );

    // Fulfilled pentru ambele
    builder.addMatcher(
      (action) => action.type.endsWith("/fulfilled"),
      (state, action) => {
        console.log(" Fulfilled:", action.type, action.payload);
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        saveAuth(action.payload.token, action.payload.user);
        console.log("State după fulfilled:", { ...state });
      }
    );

    // Rejected pentru ambele
    builder.addMatcher(
      (action) => action.type.endsWith("/rejected"),
      (state, action) => {
        console.log(" Rejected:", action.type, action.payload);
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        clearAuth();
      }
    );
  },
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;
