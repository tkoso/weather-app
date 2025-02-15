import { combineEpics } from 'redux-observable';
import { locationEpic } from '../epics/locationEpics';
import { citiesEpic } from '../epics/citiesEpics';
import { weatherEpic } from '../epics/weatherEpics';
import { filtersEpic } from '../epics/filtersEpics';
import { hourlyUpdateEpic } from '../epics/hourlyUpdateEpics'

const rootEpic = combineEpics(
  locationEpic,
  citiesEpic,
  weatherEpic,
  filtersEpic,
  hourlyUpdateEpic
);

export default rootEpic;
