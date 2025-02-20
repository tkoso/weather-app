import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  latitude: 0,   // default lat
  longitude: 0,  // default lng
  zoom: 13,
  loading: false,
  error: null,
  // This extra field ensures repeated centering
  recenterTrigger: 0,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    requestUserLocation: (state) => {
      state.loading = true;
      state.error = null;
    },
    setUserLocationSuccess: (state, action) => {
      state.loading = false;
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    setUserLocationError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // This increments whenever user wants to re-center
    incrementRecenterTrigger: (state) => {
      state.recenterTrigger += 1;
    },
  },
});

export const {
  requestUserLocation,
  setUserLocationSuccess,
  setUserLocationError,
  incrementRecenterTrigger,
} = locationSlice.actions;

export default locationSlice.reducer;
