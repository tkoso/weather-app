import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MapContainer, TileLayer } from 'react-leaflet';
import RecenterMap from './RecenterMap';
import MapEventsHandler from './MapEventsHandler';
import CityMarkers from './CityMarkers';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import MyStyledButton from '../MyStyledButton';
import FiltersPanel from '../FiltersPanel';
import { toggleTheme } from '../../slices/themeSlice';
import ThemeToggleButton from '../ThemeToggleButton';
import { requestUserLocation, incrementRecenterTrigger } from '../../slices/locationSlice';
import { useDispatch } from 'react-redux';
import { setBoundingBox, requestCitiesInBBox } from '../../slices/citiesSlice';



const ControlContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: ${({ theme }) => theme.background};
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  * {
    pointer-events: all !important;
    touch-action: manipulation !important;
  }
`;

const MapContainerStyled = styled(MapContainer)`
  /* Disable touch actions on map when interacting with controls */
  .leaflet-container {
    touch-action: none;
  }
`;

export default function MapView() {
  const dispatch = useDispatch();
  const { latitude, longitude, zoom, recenterTrigger } = useSelector((state) => state.location);
  const theme = useSelector(state => state.theme.mode);

  const handleLocateMe = () => {
    // 1. Request user location (asynchronous epic)
    dispatch(requestUserLocation());
    // 2. Increment the recenter trigger so we always recenter even if lat/lng are the same
    dispatch(incrementRecenterTrigger());
  };

  useEffect(() => {
    // calculate initial bounding box to trigger setting bounding box (so that the user does not even
    // to move the map at all, just leave it as is and wait for the hourly updates)
    // it's just a rough estimate of the bounding box but it works (other ways I tried did not)
    const mapWidth = window.innerWidth;
    const mapHeight = window.innerHeight;

    const degreesPerPixelX = 360 / (256 * Math.pow(2, zoom));
    const degreesPerPixelY = 360 / (256 * Math.pow(2, zoom));

    const halfMapSpanLng = (mapWidth / 2) * degreesPerPixelX;
    const halfMapSpanLat = (mapHeight / 2) * degreesPerPixelY;

    const south = latitude - halfMapSpanLat;
    const north = latitude + halfMapSpanLat;
    const west = longitude - halfMapSpanLng;
    const east = longitude + halfMapSpanLng;

    const bboxStr = `${south},${west},${north},${east}`;

    dispatch(setBoundingBox(bboxStr));
    dispatch(requestCitiesInBBox(bboxStr));
  }, [dispatch, latitude, longitude, zoom]);


  return (
    <MapContainerStyled
      center={[latitude, longitude]}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: '100vh', width: '100%' }}
    >
      <ControlContainer>
        <FiltersPanel />
        <MyStyledButton onClick={handleLocateMe}>
          Locate Me!
        </MyStyledButton>
        <ThemeToggleButton 
          theme={theme} 
          onClick={() => dispatch(toggleTheme())}
         />
      </ControlContainer>

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url={
          theme === 'dark' 
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        }
      />

      {/* re-center if lat/lng or recenterTrigger changes */}
      <RecenterMap lat={latitude} lng={longitude} recenterTrigger={recenterTrigger} />

      {/* watch bounding box changes (moveend) */}
      <MapEventsHandler />

      {/* show city markers with weather tooltips */}
      <CityMarkers />
    </MapContainerStyled>
  );
}
