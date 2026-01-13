import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/requests";

export const createRequest = createAsyncThunk(
  "requests/createRequest",
  //student's token
  async ({ requestData, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/create`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Error at request creation"
      );
    }
  }
);

export const fetchStudentRequests = createAsyncThunk(
  "requests/fetchStudentRequests",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/student`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Error at fetching requests"
      );
    }
  }
);

export const fetchProfessorRequests = createAsyncThunk(
  "requests/fetchProfessorRequests",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/professor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Error at fetching requests"
      );
    }
  }
);

export const approveRequest = createAsyncThunk(
  "requests/approveRequest",
  async ({ requestId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/${requestId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Error at approving request"
      );
    }
  }
);

export const rejectRequest = createAsyncThunk(
  "requests/rejectRequest",
  async ({ requestId, rejectionReason, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/${requestId}/reject`,
        { rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Error at rejecting request"
      );
    }
  }
);

export const rejectThesisRequest = createAsyncThunk(
  "requests/rejectThesisRequest",
  async ({ requestId, rejectionReason, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/${requestId}/rejectThesis`,
        { rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Error at rejecting thesis request"
      );
    }
  }
);
export const uploadStudentFile = createAsyncThunk(
  "requests/uploadStudentFile",
  async ({ requestId, formData, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/${requestId}/uploadStudentFile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Error at uploading student file"
      );
    }
  }
);

export const uploadProfessorFile = createAsyncThunk(
  "requests/uploadProfessorFile",
  async ({ requestId, formData, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/${requestId}/uploadProfessorFile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Error at uploading professor file"
      );
    }
  }
);

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
    },
  },
  extraReducers: (builder) => {
    builder
      //createRequest
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
      //fetchStudentRequests
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
      //fetchProfessorRequests
      .addCase(fetchProfessorRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfessorRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.requests = action.payload;
      })
      .addCase(fetchProfessorRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //approveRequest
      .addCase(approveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const index = state.requests.findIndex(
          (req) => req.id === action.payload.id
        );
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
      })
      .addCase(approveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //rejectRequest
      .addCase(rejectRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const index = state.requests.findIndex(
          (req) => req.id === action.payload.id
        );
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
      })
      .addCase(rejectRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //rejectThesisRequest
      .addCase(rejectThesisRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectThesisRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const index = state.requests.findIndex(
          (req) => req.id === action.payload.id
        );
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
      })
      .addCase(rejectThesisRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //uploadStudentFile
      .addCase(uploadStudentFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadStudentFile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const index = state.requests.findIndex(
          (req) => req.id === action.payload.id
        );
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
      })
      .addCase(uploadStudentFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //uploadProfessorFile
      .addCase(uploadProfessorFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfessorFile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const index = state.requests.findIndex(
          (req) => req.id === action.payload.id
        );
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
      })
      .addCase(uploadProfessorFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRequestStatus } = requestSlice.actions;
export default requestSlice.reducer;
