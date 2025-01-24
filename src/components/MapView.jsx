import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { requestCitiesInBBox } from '../slices/citiesSlice';

// This sub-component re-centers the map whenever lat/lng OR recenterTrigger changes
function RecenterMap({ lat, lng, recenterTrigger }) {
  const map = useMap();

  React.useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, recenterTrigger, map]);

  return null;
}

function MapEventsHandler() {
  const dispatch = useDispatch();
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      const south = bounds.getSouth();
      const west = bounds.getWest();
      const north = bounds.getNorth();
      const east = bounds.getEast();
      const bboxStr = `${south},${west},${north},${east}`;
      dispatch(requestCitiesInBBox(bboxStr));
    },
  });

  return null;
}

function CityMarkers() {
  const {cities} = useSelector((state) => state.cities);

  return (
    <>
      {cities.map((city) => {
        const cityName = city.tags && city.tags.name ? city.tags.name : 'Unnamed City';
        return (
          <Marker
            key={city.id}
            position={[city.lat, city.lon]}
          >
            <Popup>{cityName}</Popup>
          </Marker>
        );
      })}
    </>
  )
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

      <MapEventsHandler />

      <CityMarkers />
    </MapContainer>
  );
}
