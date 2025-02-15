import { interval, of } from 'rxjs';
import { withLatestFrom, switchMap } from 'rxjs/operators';
import { requestCitiesInBBox } from '../slices/citiesSlice';

export const hourlyUpdateEpic = (action$, state$) =>
  interval(3600000).pipe( // hourly updates
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const bbox = state.cities?.bbox;
      if (!bbox) {
        return of();
      }
      // dispatch the requestCitiesInBBox action with the current bounding box
      return of(requestCitiesInBBox(bbox));
    })
  );
