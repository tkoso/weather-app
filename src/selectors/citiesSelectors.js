import { createSelector } from 'reselect';

const getAllCities = state => state.cities.allCities;
const getSearchTerm = state => state.filters.searchTerm;
const getMinPopulation = state => state.filters.minPopulation;
const getMaxPopulation = state => state.filters.maxPopulation;

export const getFilteredCities = createSelector(
  [getAllCities, getSearchTerm, getMinPopulation, getMaxPopulation],
  (cities, searchTerm, minPop, maxPop) => {
    return cities.filter(city => {
      const nameMatch = (city.tags?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const popMatch = city.pop >= minPop && city.pop <= maxPop;
      return nameMatch && popMatch;
    });
  }
);