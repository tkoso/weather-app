import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { requestUserLocation, incrementRecenterTrigger } from './slices/locationSlice';
import MapView from './components/MapView/MapView';
import MyStyledButton from './components/MyStyledButton';
import FiltersPanel from './components/FiltersPanel';
import { toggleTheme } from './slices/themeSlice';
import ThemeToggleButton from './components/ThemeToggleButton';
import styled from 'styled-components';
import Loader from './components/Loader';

const AppContainer = styled.div`
  text-align: center;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  /* You can add additional styling below */
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

function App() {
  const dispatch = useDispatch();
  const { loading: locationLoading, error } = useSelector((state) => state.location);
  const theme = useSelector((state) => state.theme.mode);
  const { loading: citiesLoading } = useSelector((state) => state.cities);

  const isLoading = locationLoading || citiesLoading;

  React.useEffect(() => { // it runs once when the component mounts so that user's centered in the beginning
    dispatch(requestUserLocation());
    dispatch(incrementRecenterTrigger());
  }, [dispatch]);

  const handleLocateMe = () => {
    // 1. Request user location (asynchronous epic)
    dispatch(requestUserLocation());
    // 2. Increment the recenter trigger so we always recenter even if lat/lng are the same
    dispatch(incrementRecenterTrigger());
  };

  return (
    <AppContainer>
      {isLoading && <Loader />}
      <FiltersPanel />
      <MyStyledButton onClick={handleLocateMe}>
        Locate Me!
      </MyStyledButton>
      <ThemeToggleButton 
        theme={theme} 
        onClick={() => dispatch(toggleTheme())}
      />

      {locationLoading && <p>Loading location...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <MapView />
    </AppContainer>
  );
}

export default App;
