import { ofType } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';
import {
  requestCitiesInBBox,
  setCitiesInBBoxSuccess,
  setCitiesInBBoxError,
} from '../slices/citiesSlice';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export const citiesEpic = (action$) =>
  action$.pipe(
    ofType(requestCitiesInBBox.type),
    mergeMap((action) => {
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
        mergeMap((response) => {
          if (!response.ok) {
            throw new Error(`Overpass API error: ${response.status}`);
          }
          return response.json();
        }),
        map((jsonData) => {
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
  
            console.log('Top 20 biggest cities by population in bbox:', top20);
  
            return setCitiesInBBoxSuccess(top20);
          }),
        catchError((err) => {
          console.error('Error fetching cities:', err);
          return of(setCitiesInBBoxError(err.toString()));
        })
      );
    })
  );
