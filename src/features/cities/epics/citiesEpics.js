import { ofType } from 'redux-observable';
import { debounceTime, switchMap, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { from, of } from 'rxjs';
import {
  requestCitiesInBBox,
  setCitiesInBBoxSuccess,
  setCitiesInBBoxError,
} from '../slices/citiesSlice';
import {
  setDataPopulationRange,
  setPopulationRange
} from '../../filters/slices/filtersSlice';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export const citiesEpic = (action$, state$) =>
  action$.pipe(
    ofType(requestCitiesInBBox.type),
    debounceTime(2000), // debounce the api queries so that we don't overload it and only the latest is considered
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

              const {
                dataMinPopulation: cachedMin,
                dataMaxPopulation: cachedMax,
                minPopulation,
                maxPopulation,
              } = state.filters;

              // only update if new values widen the range.
              const newDataMin = (cachedMax === Infinity && cachedMin === 0)
                ? dataMin
                : Math.min(cachedMin, dataMin);
              const newDataMax = (cachedMax === Infinity && cachedMin === 0)
                ? dataMax
                : Math.max(cachedMax, dataMax);

              const actionsToDispatch = [
                setCitiesInBBoxSuccess(top20),
                setDataPopulationRange({ min: newDataMin, max: newDataMax }),
              ];
  
              // if active filters are still at their defaults, update them
              if (minPopulation === 0 && maxPopulation === Infinity) {
                actionsToDispatch.push(setPopulationRange({ min: dataMin, max: dataMax }));
              }
  
              return from(actionsToDispatch);
            }),
          catchError((err) => {
            console.error('Error fetching cities:', err);
            return of(setCitiesInBBoxError(err.toString()));
          })
        );
      }

      return of(); // fallback
    })
  );