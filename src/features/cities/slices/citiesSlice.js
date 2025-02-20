import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allCities: [], // we'll store the raw array of returned city data
  loading: false,
  error: null,
  bbox: null,
};

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    setBoundingBox: (state, action) => { // useful to store it in state because it's used by hourlyUpdateEpics
      state.bbox = action.payload;
    },
    requestCitiesInBBox: (state) => {
      state.loading = true;
      state.error = null;
    },
    setCitiesInBBoxSuccess: (state, action) => {
      state.loading = false;
      const newCities = action.payload;
      state.allCities = newCities; // store the array of cities
    },
    setCitiesInBBoxError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setBoundingBox,
  requestCitiesInBBox,
  setCitiesInBBoxSuccess,
  setCitiesInBBoxError,
} = citiesSlice.actions;

export default citiesSlice.reducer;
