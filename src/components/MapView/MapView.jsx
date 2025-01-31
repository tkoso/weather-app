import React from 'react';
import { useSelector } from 'react-redux';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import RecenterMap from './RecenterMap';
import MapEventsHandler from './MapEventsHandler';
import CityMarkers from './CityMarkers';

export default function MapView() {
  const { latitude, longitude, zoom, recenterTrigger } = useSelector((state) => state.location);

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: '80vh', width: '100%', margin: '0 auto' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* re-center if lat/lng or recenterTrigger changes */}
      <RecenterMap lat={latitude} lng={longitude} recenterTrigger={recenterTrigger} />

      {/* watch bounding box changes (moveend) */}
      <MapEventsHandler />

      {/* show city markers with weather tooltips */}
      <CityMarkers />
    </MapContainer>
  );
}
