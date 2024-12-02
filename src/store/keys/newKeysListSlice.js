import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { APIRoutes, BASEURL } from "../../configs/globalConfig";

export const fetchNewKeys = createAsyncThunk(
  "keys/fetchNewKeys",
  async ({ page, limit }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASEURL}${APIRoutes.getNewKeys}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const newKeysSlice = createSlice({
  name: "newKeys",
  initialState: {
    keys: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewKeys.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNewKeys.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.keys = action.payload;
      })
      .addCase(fetchNewKeys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default newKeysSlice.reducer;
