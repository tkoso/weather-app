import { combineEpics } from 'redux-observable';
import { locationEpic } from '../epics/locationEpics';

const rootEpic = combineEpics(locationEpic);

export default rootEpic;
