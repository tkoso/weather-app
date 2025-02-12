import { ofType } from 'redux-observable';
import { debounceTime, map } from 'rxjs/operators';
import { setSearchTerm, setPopulationRange, applyFilters } from '../slices/filtersSlice';
import { of } from 'rxjs';

export const filtersEpic = (action$) =>
  action$.pipe(
    // listen for either name or population changes
    ofType(setSearchTerm.type, setPopulationRange.type),
    // wait 200ms after the last change
    debounceTime(200),
    // then dispatch "applyFilters"
    map(() => applyFilters())
  );
