import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginWithEmail, logout, signupWithEmail } from "../../firebase/authService";
import { getErrorMessage } from "../../utils/validators";

export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    return await loginWithEmail(credentials);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "No se pudo iniciar sesion"));
  }
});

export const signupUser = createAsyncThunk("auth/signupUser", async (credentials, { rejectWithValue }) => {
  try {
    return await signupWithEmail(credentials);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "No se pudo crear la cuenta"));
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    await logout();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "No se pudo cerrar sesion"));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isReady: false,
    status: "idle",
    error: null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setAuthReady: (state) => {
      state.isReady = true;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setAuthUser, setAuthReady, clearAuthError } = authSlice.actions;
export default authSlice.reducer;