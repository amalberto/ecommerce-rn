import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchLocalProfile, saveLocalProfile } from "../../db/profileRepository";
import { fetchProfileRemote, saveProfileRemote } from "../../firebase/databaseService";
import { getErrorMessage } from "../../utils/validators";

export const loadProfile = createAsyncThunk("profile/loadProfile", async (user, { rejectWithValue }) => {
  try {
    const localProfile = await fetchLocalProfile(user.uid);
    let remoteProfile = null;

    try {
      remoteProfile = await fetchProfileRemote(user.uid);
    } catch (error) {
      remoteProfile = null;
    }

    return {
      id: user.uid,
      email: user.email,
      displayName: user.displayName || remoteProfile?.displayName || localProfile?.displayName || "",
      avatarUri: localProfile?.avatarUri || remoteProfile?.avatarUri || null,
      updatedAt: localProfile?.updatedAt || remoteProfile?.updatedAt || null,
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "No se pudo cargar el perfil"));
  }
});

export const saveProfile = createAsyncThunk("profile/saveProfile", async ({ userId, profile }, { rejectWithValue }) => {
  try {
    const nextProfile = {
      id: userId,
      email: profile.email,
      displayName: profile.displayName,
      avatarUri: profile.avatarUri,
      updatedAt: new Date().toISOString(),
    };

    await saveLocalProfile(nextProfile);

    try {
      await saveProfileRemote(userId, nextProfile);
      return { ...nextProfile, syncError: null };
    } catch (error) {
      return { ...nextProfile, syncError: getErrorMessage(error, "Perfil guardado solo en SQLite") };
    }
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
        state.syncError = action.payload.syncError;
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;