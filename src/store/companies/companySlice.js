// companySlice.js (Redux Toolkit)
import { createSlice } from '@reduxjs/toolkit';

const companySlice = createSlice({
  name: 'company',
  initialState: {
    selectedCompany: null,
  },
  reducers: {
    setSelectedCompany: (state, action) => {
      state.selectedCompany = action.payload;
    },
  },
});

export const { setSelectedCompany } = companySlice.actions;
export default companySlice.reducer;
