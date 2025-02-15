import { ofType } from 'redux-observable';
import { debounceTime, switchMap, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { from, of } from 'rxjs';
import {
  requestCitiesInBBox,
  setCitiesInBBoxSuccess,
  setCitiesInBBoxError,
  applyCityFilters
} from '../slices/citiesSlice';
import {
  applyFilters,
  setDataPopulationRange,
  setPopulationRange
} from '../slices/filtersSlice';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export const citiesEpic = (action$, state$) =>
  action$.pipe(
    ofType(requestCitiesInBBox.type, applyFilters.type),
    debounceTime(200),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      if (action.type === requestCitiesInBBox.type) {
        const bboxStr = action.payload; // "south,west,north,east" as string

        const query = `
          [out:json][timeout:25];
          (
            node["place"="city"](${bboxStr});
          );
          out;
        `;
  
        return from(
          fetch(OVERPASS_URL, {
            method: 'POST',
            body: query,
          })
        ).pipe(
          switchMap((response) => {
            if (!response.ok) {
              throw new Error(`Overpass API error: ${response.status}`);
            }
            return response.json();
          }),
          switchMap((jsonData) => {
              const elements = jsonData.elements || [];
    
              const withPopulation = elements.map((el) => {
                let pop = 0;
                if (el.tags && el.tags.population) {
                  const parsed = parseInt(el.tags.population, 10);
                  if (!isNaN(parsed)) {
                    pop = parsed;
                  }
                }
                return {
                  ...el,
                  pop,
                };
              });
    
              withPopulation.sort((a, b) => b.pop - a.pop);
    
              // Take the top 20
              const top20 = withPopulation.slice(0, 20);

              const populations = top20.map(c => c.pop);
              const dataMin = populations.length > 0 ? Math.min(...populations) : 0;
              const dataMax = populations.length > 0 ? Math.max(...populations) : Infinity;
    
              // console.log('Top 20 biggest cities by population in bbox:', top20);
    
              return from([
                setCitiesInBBoxSuccess(top20),
                setDataPopulationRange({ min: dataMin, max: dataMax }),
                setPopulationRange({ min: dataMin, max: dataMax })
              ]);
            }),
          catchError((err) => {
            console.error('Error fetching cities:', err);
            return of(setCitiesInBBoxError(err.toString()));
          })
        );
      }

      if (action.type === applyFilters.type) {
        const currentCities = state.cities.allCities;
        return of(
          applyCityFilters(filterCities(currentCities, state.filters))
        )
      }

      return of(); // fallback
    })
  );


// helper function for filtering
const filterCities = (cities, filters) => {
  const { searchTerm, minPopulation, maxPopulation } = filters;
  return cities.filter(city => {
    const nameMatch = (city.tags?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const popMatch = city.pop >= minPopulation && city.pop <= maxPopulation;
    return nameMatch && popMatch;
  });
};