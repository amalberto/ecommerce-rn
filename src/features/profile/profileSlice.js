import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchLocalProfile, saveLocalProfile } from "../../db/profileRepository";
import { getErrorMessage } from "../../utils/validators";

export const LOCAL_PROFILE_ID = "local-profile";

export const loadProfile = createAsyncThunk("profile/loadProfile", async (_, { rejectWithValue }) => {
  try {
    const localProfile = await fetchLocalProfile(LOCAL_PROFILE_ID);

    return localProfile || {
      id: LOCAL_PROFILE_ID,
      email: "",
      displayName: "Invitado",
      avatarUri: null,
      updatedAt: null,
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "No se pudo cargar el perfil"));
  }
});

export const saveProfile = createAsyncThunk("profile/saveProfile", async (profile, { rejectWithValue }) => {
  try {
    const nextProfile = {
      id: LOCAL_PROFILE_ID,
      email: profile.email || "",
      displayName: profile.displayName,
      avatarUri: profile.avatarUri,
      updatedAt: new Date().toISOString(),
    };

    await saveLocalProfile(nextProfile);
    return nextProfile;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "No se pudo guardar el perfil"));
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    status: "idle",
    error: null,
    syncError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(loadProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.syncError = null;
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;