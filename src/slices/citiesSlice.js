import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cities: [],       // we'll store the raw array of returned city data
  loading: false,
  error: null,
};

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    requestCitiesInBBox: (state) => {
      state.loading = true;
      state.error = null;
    },
    setCitiesInBBoxSuccess: (state, action) => {
      state.loading = false;
      state.cities = action.payload;  // store the array of cities
    },
    setCitiesInBBoxError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  requestCitiesInBBox,
  setCitiesInBBoxSuccess,
  setCitiesInBBoxError,
} = citiesSlice.actions;

export default citiesSlice.reducer;
