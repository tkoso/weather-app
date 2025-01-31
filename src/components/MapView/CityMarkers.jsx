import React from 'react';
import { useSelector } from 'react-redux';
import { Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function classifyWeather(temp_c, conditionText) {
  const noRain = !conditionText?.toLowerCase().includes('rain');
  const tempIsGood = (temp_c >= 18 && temp_c <= 25);

  if (noRain && tempIsGood) return 'nice 😊';
  if (noRain || tempIsGood) return 'passable 🤨';
  return 'not nice 😢';
}

export default function CityMarkers() {
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
