import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  weatherById: {}, // mapping city id to data retrieved from weather API
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    requestWeatherForCities: (state) => {
      state.loading = true;
      state.error = null;
    },
    setWeatherForCitiesSuccess: (state, action) => {
      state.loading = false;
      // action.payload = array of { cityId, weatherData }
      // We'll store them in state.weatherById
      const updates = action.payload;
      updates.forEach(({ cityId, weatherData }) => {
        state.weatherById[cityId] = weatherData;
      });
    },
    setWeatherForCitiesError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  requestWeatherForCities,
  setWeatherForCitiesSuccess,
  setWeatherForCitiesError,
} = weatherSlice.actions;

export default weatherSlice.reducer;
