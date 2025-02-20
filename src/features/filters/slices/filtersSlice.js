import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchTerm: '',
  minPopulation: 0,
  maxPopulation: Infinity,
  dataMinPopulation: 0,
  dataMaxPopulation: Infinity,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload; // update the name filter
    },
    setPopulationRange: (state, action) => {
      const { min, max } = action.payload;
      state.minPopulation = min;
      state.maxPopulation = max;
    },
    setDataPopulationRange: (state, action) => {
      const { min, max } = action.payload;
      state.dataMinPopulation = min;
      state.dataMaxPopulation = max;
    },
    // we'll dispatch this after 200ms debounce to actually apply the filters
    applyFilters: (state) => {
      // no direct state changes here - the actual filtering happens in the cities logic
    },
  },
});

export const { setSearchTerm, setDataPopulationRange, setPopulationRange, applyFilters } = filtersSlice.actions;

export default filtersSlice.reducer;
