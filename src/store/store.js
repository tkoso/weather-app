import { configureStore } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from './rootEpic';

import locationReducer from '../slices/locationSlice';
import citiesReducer from '../slices/citiesSlice';

const epicMiddleware = createEpicMiddleware();

const store = configureStore({
  reducer: {
    location: locationReducer,
    cities: citiesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // using epics, not thunks
      serializableCheck: false,
    }).concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);

export default store;
