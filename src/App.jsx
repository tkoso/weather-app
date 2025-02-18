import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { requestUserLocation, incrementRecenterTrigger } from './slices/locationSlice';
import MapView from './components/MapView/MapView';
import styled from 'styled-components';
import Loader from './components/Loader';
import FilteredCitiesInfo from './components/FilteredCitiesInfo'

const AppContainer = styled.div`
  text-align: center;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

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
