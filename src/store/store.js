import { configureStore } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from './rootEpic';

import locationReducer from '../slices/locationSlice';
import citiesReducer from '../slices/citiesSlice';
import weatherReducer from '../slices/weatherSlice';
import filtersReducer from '../slices/filtersSlice';
import themeReducer from '../slices/themeSlice';

const epicMiddleware = createEpicMiddleware();

const store = configureStore({
  reducer: {
    location: locationReducer,
    cities: citiesReducer,
    weather: weatherReducer,
    filters: filtersReducer,
    theme: themeReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // using epics, not thunks
      serializableCheck: false,
    }).concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);

export default store;
