import { ofType } from 'redux-observable';
import { mergeMap, switchMap, map, catchError, filter } from 'rxjs/operators';
import { from, of } from 'rxjs';
import {
  requestWeatherForCities,
  setWeatherForCitiesSuccess,
  setWeatherForCitiesError,
} from '../slices/weatherSlice';
import { setCitiesInBBoxSuccess } from '../../cities/slices/citiesSlice';

const API_BASE = 'https://api.weatherapi.com/v1/current.json';
const CACHE_DURATION = 60 * 60 * 1000; // if cached data is older than 60 minutes, fetch new data

export const weatherEpic = (action$, state$) =>
  action$.pipe(
    ofType(setCitiesInBBoxSuccess.type), // once we have the city data, dispatch requestWeatherForCities:
    mergeMap((action) => {
      const cities = action.payload; // action.payload = the array of top 20 biggest cities from Overpass

      return of(requestWeatherForCities()).pipe(
        switchMap(() => {
          const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
          return of(API_KEY).pipe(
            filter(key => !!key), // if API_KEY is correct (not empty / undefined etc.), proceed
            switchMap((key) => {
              const now = Date.now();
              // checking each city: fetching only if no cached weather or cache is outdated.
              const citiesToFetch = cities.filter(city => {
                const cached = state$.value.weather.weatherById[city.id];
                return !cached || (now - cached.timestamp > CACHE_DURATION);
              });

              const fetchPromises = citiesToFetch.map((city) => {
                const { lat, lon, id } = city;
                const url = `${API_BASE}?key=${key}&q=${lat},${lon}`;
                return fetch(url)
                  .then((res) => {
                    if (!res.ok) {
                      throw new Error(`Weather API error for city ${id}`);
                    }
                    return res.json();
                  })
                  .then((weatherJson) => ({
                    cityId: id,
                    weatherData: {
                      temp_c: weatherJson.current.temp_c,
                      condition: weatherJson.current.condition.text,
                      icon: weatherJson.current.condition.icon,
                      feelslike_c: weatherJson.current.feelslike_c,
                      timestamp: Date.now(), // timestamp for caching
                    },
                  }))
                  .catch((err) => ({
                    cityId: id,
                    weatherData: {
                      temp_c: null,
                      condition: `Error: ${err.message}`,
                      icon: '',
                      timestamp: Date.now(),
                    },
                  }));
              });

              return from(Promise.all(fetchPromises)).pipe(
                map((results) => {
                  // results is an array of { cityId, weatherData }
                  return setWeatherForCitiesSuccess(results);
                }),
                catchError((err) => {
                  return of(setWeatherForCitiesError(err.toString()));
                })
              );
            })
          );
        })
      );
    })
  );
