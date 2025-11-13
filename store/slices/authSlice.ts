import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  token: string | null;
  uid: string | null;
  email?: string | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  uid: null,
  email: null,
  status: "idle",
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload: { email: string; password: string; displayName?: string }) => {
    const res = await axios.post("/api/auth/register", payload);
    return res.data.data;
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }) => {
    const res = await axios.post("/api/auth/login", payload);
    return res.data.data;
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  return {success: true}
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.uid = null;
      state.email = null;
    },
    setAuth(state, action: PayloadAction<{ token?: string | null; uid?: string | null; email?: string | null }>) {
      state.token = action.payload.token ?? null;
      state.uid = action.payload.uid ?? null;
      state.email = action.payload.email ?? null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.uid = action.payload.uid;
        state.email = action.payload.email ?? null;
        state.status = "idle";
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.status = "failed";
        s.error = "Invalid email or password";
      })
      .addCase(registerUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.status = "idle";
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.status = "failed";
        s.error = "Error creating account, please enter correct details";
      })
      .addCase(logoutUser.fulfilled, (s) => {
        s.token = null;
        s.uid = null;
        s.email = null;
        s.status = "idle";
      });
  },
});

export const { logout, setAuth } = authSlice.actions;
export default authSlice.reducer;
