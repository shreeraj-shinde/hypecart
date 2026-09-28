import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authApi from "../api/authApi";
import { setAccessToken } from "../api/axiosInstance";
import type { AuthUser } from "../api/authApi";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  status: "idle" | "loading" | "error";
  bootstrapped: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: "idle",
  bootstrapped: false,
  error: null,
};

const extractErrorMessage = (error: unknown): string => {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data
  ) {
    return String((error.response.data as { message: unknown }).message);
  }
  return "Something went wrong. Please try again.";
};

export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (payload: authApi.SignupPayload, { rejectWithValue }) => {
    try {
      return await authApi.signup(payload);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: authApi.LoginPayload, { rejectWithValue }) => {
    try {
      return await authApi.login(payload);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const refreshThunk = createAsyncThunk(
  "auth/refresh",
  async (_: void, { rejectWithValue }) => {
    try {
      return await authApi.refresh();
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const meThunk = createAsyncThunk(
  "auth/me",
  async (_: void, { rejectWithValue }) => {
    try {
      return await authApi.me();
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  try {
    await authApi.logout();
  } catch {
    // best-effort: clear the local session regardless of server response
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionExpired: (state) => {
      state.user = null;
      state.accessToken = null;
      setAccessToken(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = { name: action.payload.name, email: action.payload.email };
        state.accessToken = action.payload.accessToken;
        setAccessToken(action.payload.accessToken);
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = { name: action.payload.name, email: action.payload.email };
        state.accessToken = action.payload.accessToken;
        setAccessToken(action.payload.accessToken);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })
      .addCase(refreshThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshThunk.fulfilled, (state, action) => {
        state.status = "idle";
        state.bootstrapped = true;
        state.accessToken = action.payload.accessToken;
        setAccessToken(action.payload.accessToken);
      })
      .addCase(refreshThunk.rejected, (state) => {
        state.status = "idle";
        state.bootstrapped = true;
        state.user = null;
        state.accessToken = null;
        setAccessToken(null);
      })
      .addCase(meThunk.fulfilled, (state, action) => {
        state.user = { name: action.payload.name, email: action.payload.email };
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
        state.accessToken = null;
        setAccessToken(null);
      });
  },
});

export const { sessionExpired } = authSlice.actions;
export default authSlice.reducer;
