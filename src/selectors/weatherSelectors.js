import { createSelector } from 'reselect';
import { getFilteredCities } from './citiesSelectors';

function classifyWeather(temp_c, conditionText) {
  const noRain = !conditionText?.toLowerCase().includes('rain');
  const tempIsGood = temp_c >= 18 && temp_c <= 25;
  if (noRain && tempIsGood) return 'nice 😊';
  if (noRain || tempIsGood) return 'passable 🤨';
  return 'not nice 😢';
}

export const getCitiesWithWeatherClassification = createSelector(
  [
    getFilteredCities,
    state => state.weather.weatherById, // weather mapping keyed by city id
  ],
  (cities, weatherById) => {
    return cities.map(city => {
      const wData = weatherById[city.id];
      const temp_c = wData?.temp_c ?? null;
      const condition = wData?.condition || '';
      return {
        ...city,
        weather: {
          ...wData,
          niceness: temp_c !== null ? classifyWeather(temp_c, condition) : 'unknown',
        }
      };
    });
  }
);
