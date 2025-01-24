import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapContainer, Marker, Tooltip, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { requestCitiesInBBox } from '../slices/citiesSlice';

function classifyWeather(temp_c, conditionText) {
  const noRain = !conditionText?.toLowerCase().includes('rain');
  const tempIsGood = (temp_c >= 18 && temp_c <= 25);

  if (noRain && tempIsGood) return 'nice 😊';
  if (noRain || tempIsGood) return 'passable 🤨';
  return 'not nice 😢';
}



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
  const { cities } = useSelector((state) => state.cities);
  const { weatherById } = useSelector((state) => state.weather);

  return (
    <>
      {cities.map((city) => {
        const cityName = city.tags?.name || 'Unnamed City';
        const cityId = city.id;
        
        // read weather data if we have it
        const wData = weatherById[cityId];
        const tempText = wData?.temp_c !== undefined
          ? `${wData.temp_c}°C`
          : '...';
        const condText = wData?.condition || 'no data';
        const temp_c = wData?.temp_c ?? '?';
        const niceness = classifyWeather(temp_c, condText);

        return (
          <Marker key={cityId} position={[city.lat, city.lon]}>
            <Tooltip permanent direction="top" offset={[0, -20]}>
              <div style={{ textAlign: 'center' }}>
                <strong>{cityName}</strong>
                <br />
                Temp: {tempText}
                <br />
                Condition: {condText}
                <br />
                Weather is <em>{niceness}</em>
                <br />
                {/* displaying the icon: */}
                {wData?.icon && (
                  <img src={wData.icon} alt="weather icon" />
                )}
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
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
