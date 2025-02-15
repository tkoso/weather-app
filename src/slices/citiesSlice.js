import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allCities: [], // we'll store the raw array of returned city data
  filteredCities: [],
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
      const newCities = action.payload;
      state.allCities = newCities; // store the array of cities
      state.filteredCities = newCities; // default to all (unfiltered) initially
    },
    setCitiesInBBoxError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    applyCityFilters: (state, action) => {
      state.filteredCities = action.payload;
    }
  },
});

export const {
  requestCitiesInBBox,
  setCitiesInBBoxSuccess,
  setCitiesInBBoxError,
  applyCityFilters,
} = citiesSlice.actions;

export default citiesSlice.reducer;
