import { combineEpics } from 'redux-observable';
import { locationEpic } from '../epics/locationEpics';
import { citiesEpic } from '../epics/citiesEpics';
import { weatherEpic } from '../epics/weatherEpics';

const rootEpic = combineEpics(
  locationEpic,
  citiesEpic,
  weatherEpic
);

export default rootEpic;
