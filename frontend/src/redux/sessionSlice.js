import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_BASE_URL from "../api.config";

const API_URL = `${API_BASE_URL}/api/sessions`;

export const createSession = createAsyncThunk(
  "sessions/createSession",
  async ({ sessionData, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, sessionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error at session creation"
      );
    }
  }
);

export const fetchSessions = createAsyncThunk(
  "sessions/getSessions",
  async ({ token, role }, { rejectWithValue }) => {
    try {
      const url = role === "Student" ? `${API_URL}/all` : API_URL;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Error at session fetching");
    }
  }
);

const sessionSlice = createSlice({
  name: "sessions",
  initialState: {
    sessions: [],
    loading: false,
    error: null,
    creationStatus: null,
  },
  reducers: {
    clearSessionStatus: (state) => {
      state.creationStatus = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createSession.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.creationStatus = null;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.creationStatus = "success";
        state.sessions.push(action.payload);
      })
      .addCase(createSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.creationStatus = "failure";
      })
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSessionStatus } = sessionSlice.actions;
export default sessionSlice.reducer;
