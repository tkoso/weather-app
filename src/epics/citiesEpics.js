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
          // Overpass returns an object with an "elements" array
          const elements = jsonData.elements || [];
          // For now, let's console.log them all
          console.log('Cities in current bounding box:', elements);

          return setCitiesInBBoxSuccess(elements);
        }),
        catchError((err) => {
          console.error('Error fetching cities:', err);
          return of(setCitiesInBBoxError(err.toString()));
        })
      );
    })
  );
