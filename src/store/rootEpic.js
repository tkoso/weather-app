import { combineEpics } from 'redux-observable';
import { locationEpic } from '../epics/locationEpics';
import { citiesEpic } from '../epics/citiesEpics';

const rootEpic = combineEpics(
  locationEpic,
  citiesEpic
);

export default rootEpic;
