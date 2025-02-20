import { combineEpics } from 'redux-observable';
import { locationEpic } from '../../features/location/epics/locationEpics';
import { citiesEpic } from '../../features/cities/epics/citiesEpics';
import { weatherEpic } from '../../features/weather/epics/weatherEpics';
import { filtersEpic } from '../../features/filters/epics/filtersEpics';
import { hourlyUpdateEpic } from '../../features/cities/epics/hourlyUpdateEpics'

const rootEpic = combineEpics(
  locationEpic,
  citiesEpic,
  weatherEpic,
  filtersEpic,
  hourlyUpdateEpic
);

export default rootEpic;
