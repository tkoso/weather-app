import { ofType } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';
import {
  requestUserLocation,
  setUserLocationSuccess,
  setUserLocationError,
} from '../slices/locationSlice';

export const locationEpic = (action$) =>
  action$.pipe(
    ofType(requestUserLocation.type),
    mergeMap(() => {
      return from(
        new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject('Geolocation is not supported by this browser');
          } else {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          }
        })
      ).pipe(
        map((position) =>
          setUserLocationSuccess({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        ),
        catchError((err) => of(setUserLocationError(err.toString())))
      );
    })
  );
