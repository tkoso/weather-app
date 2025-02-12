import { combineEpics } from 'redux-observable';
import { locationEpic } from '../epics/locationEpics';
import { citiesEpic } from '../epics/citiesEpics';
import { weatherEpic } from '../epics/weatherEpics';
import { filtersEpic } from '../epics/filtersEpics';

const rootEpic = combineEpics(
  locationEpic,
  citiesEpic,
  weatherEpic,
  filtersEpic
);

export default rootEpic;
