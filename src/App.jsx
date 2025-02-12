import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { requestUserLocation, incrementRecenterTrigger } from './slices/locationSlice';
import MapView from './components/MapView/MapView';
import MyStyledButton from './components/MyStyledButton';
import FiltersPanel from './components/FiltersPanel';

function App() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.location);

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
    <div style={{ textAlign: 'center' }}>
      <FiltersPanel />
      <MyStyledButton onClick={handleLocateMe}>
        Locate Me!
      </MyStyledButton>

      {loading && <p>Loading location...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <MapView />
    </div>
  );
}

export default App;
