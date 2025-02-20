import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { requestUserLocation, incrementRecenterTrigger } from '../features/location/slices/locationSlice';
import MapView from '../features/map/components/MapView';
import Loader from './components/Loader';
import './components/AppContainer';
import FilteredCitiesInfo from '../features/filters/components/FilteredCitiesInfo'
import AppContainer from './components/AppContainer';



function App() {
  const dispatch = useDispatch();
  const { loading: locationLoading, error } = useSelector((state) => state.location);
  
  const { loading: citiesLoading } = useSelector((state) => state.cities);

  const isLoading = locationLoading || citiesLoading;

  React.useEffect(() => { // it runs once when the component mounts so that user's centered in the beginning
    dispatch(requestUserLocation());
    dispatch(incrementRecenterTrigger());
  }, [dispatch]);

  return (
    <AppContainer>

      <MapView />
      {isLoading && <Loader />}
      <FilteredCitiesInfo />


      {locationLoading && <p>Loading location...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}


    </AppContainer>
  );
}

export default App;
