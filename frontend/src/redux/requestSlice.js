import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/requests";

export const createRequest = createAsyncThunk(
  "requests/createRequest",
  //student's token
  async({requestData, token}, {rejectWithValue}) => {

    try {
      const response = await axios.post(`${API_URL}/create`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      return response.data;
    }catch(error){
      return rejectWithValue(error.response.data.message || "Error at request creation");
    }
  }
)

export const fetchStudentRequests = createAsyncThunk(
  "requests/fetchStudentRequests",
  async(token, {rejectWithValue}) => {
    try {
      const response = await axios.get(`${API_URL}/student`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data;
    }catch(error){
      return rejectWithValue(error.response.data.message || "Error at fetching requests");
    }
  }
)

const requestSlice = createSlice({
  name: "requests",
  initialState: {
    requests: [],
    loading: false,
    error: null,
    creationStatus: null,
  },
  reducers: {
    clearRequestStatus: (state) => {
      state.creationStatus = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.creationStatus = null;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.creationStatus = "success";
        state.requests.push(action.payload);
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.creationStatus = "failure";
      })
      .addCase(fetchStudentRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.requests = action.payload;
      })
      .addCase(fetchStudentRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
})

export const { clearRequestStatus } = requestSlice.actions;
export default requestSlice.reducer;