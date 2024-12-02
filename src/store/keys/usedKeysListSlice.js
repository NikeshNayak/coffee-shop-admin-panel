import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { APIRoutes, BASEURL } from "../../configs/globalConfig";

export const fetchUsedKeys = createAsyncThunk(
  "usedKeys/fetchUsedKeys",
  async ({ page, limit }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASEURL}${APIRoutes.getUsedKeys}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const usedKeysSlice = createSlice({
  name: "usedKeys",
  initialState: {
    keys: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsedKeys.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsedKeys.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.keys = action.payload;
      })
      .addCase(fetchUsedKeys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default usedKeysSlice.reducer;
