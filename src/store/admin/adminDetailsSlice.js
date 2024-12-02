import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { APIRoutes, BASEURL } from "../../configs/globalConfig";
import { getAuthToken } from "../../util/auth";

export const fetchStaffDetails = createAsyncThunk(
  "/admin/getstaffdetails",
  async ({ staffId }, thunkAPI) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${BASEURL}${APIRoutes.getStaffDetails}?staffId=${staffId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the Bearer token to the request headers
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const staffDetailsSlice = createSlice({
  name: "staffDetails",
  initialState: {
    staffDetails: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStaffDetails.fulfilled, (state, action) => {
        console.log("action.payload.staffDetails");
        console.log(action.payload.staffDetails);
        state.loading = false;
        state.staffDetails = action.payload.staffDetails;
      })
      .addCase(fetchStaffDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default staffDetailsSlice.reducer;
