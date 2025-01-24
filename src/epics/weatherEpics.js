import { ofType } from 'redux-observable';
import { mergeMap, switchMap, map, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';
import {
  requestWeatherForCities,
  setWeatherForCitiesSuccess,
  setWeatherForCitiesError,
} from '../slices/weatherSlice';
import { setCitiesInBBoxSuccess } from '../slices/citiesSlice';

const API_BASE = 'https://api.weatherapi.com/v1/current.json';

export const weatherEpic = (action$, state$) =>
  action$.pipe(
    ofType(setCitiesInBBoxSuccess.type), // once we have the city data, dispatch requestWeatherForCities:
    mergeMap((action) => {
      const cities = action.payload; // action.payload = the array of top 20 biggest cities from Overpass

      return of(requestWeatherForCities()).pipe(
        switchMap(() => {
          const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
          if (!API_KEY) {
            return of(
              setWeatherForCitiesError('No Weather API key found in env!')
            );
          }

          const fetchPromises = cities.map((city) => {
            const { lat, lon, id } = city;

            // WeatherAPI can fetch by lat,lon:
            const url = `${API_BASE}?key=${API_KEY}&q=${lat},${lon}`;

            return fetch(url)
              .then((res) => {
                if (!res.ok) {
                  throw new Error(`Weather API error for city ${id}`);
                }
                return res.json();
              })
              .then((weatherJson) => {
                return {
                  cityId: id,
                  weatherData: {
                    temp_c: weatherJson.current.temp_c,
                    condition: weatherJson.current.condition.text,
                    icon: weatherJson.current.condition.icon,
                    feelslike_c: weatherJson.current.feelslike_c,
                    // we can put more data here if we want
                  },
                };
              })
              .catch((err) => {
                console.error(err);
                // even if one city fails, we don't want the entire Promise.all to fail
                // we'll return a fallback
                return {
                  cityId: id,
                  weatherData: {
                    temp_c: null,
                    condition: `Error: ${err.message}`,
                    icon: '',
                  },
                };
              });
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
