import React from 'react';
import { useSelector } from 'react-redux';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// This sub-component re-centers the map whenever lat/lng OR recenterTrigger changes
function RecenterMap({ lat, lng, recenterTrigger }) {
  const map = useMap();

  React.useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, recenterTrigger, map]);

  return null;
}

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
      <RecenterMap lat={latitude} lng={longitude} recenterTrigger={recenterTrigger} />
    </MapContainer>
  );
}
