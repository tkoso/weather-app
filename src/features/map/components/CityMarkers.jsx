import React from 'react';
import { useSelector } from 'react-redux';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getCitiesWithWeatherClassification } from '../../weather/selectors/weatherSelectors';

import WeatherPopup from './WeatherPopup';
import WeatherIcon from './WeatherIcon';

function createMarkerIcon(niceness, iconUrl) {
  const emoji = niceness.split(' ').at(-1);
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: rgba(255, 255, 255, 0.66);
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 2px solid ${getBorderColor(niceness)};
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        padding: 4px;
      ">
        <div style="font-size: 20px; line-height: 1">${emoji}</div>
        ${iconUrl ? 
          `<img src="${iconUrl}" 
                style="width: 30px; height: 30px; margin-top: 2px" 
                alt="weather icon" />` 
          : ''
        }
      </div>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50]
  });
}

function getBorderColor(niceness) {
  switch(niceness) {
    case 'nice 😊': return '#4CAF50';
    case 'passable 🤨': return '#FFC107';
    default: return '#F44336';
  }
}

export default function CityMarkers() {
  const cities = useSelector(getCitiesWithWeatherClassification);

  return (
    <>
      {cities.map((city) => {
        const cityName = city.tags?.name || 'Unnamed City';
        const cityId = city.id;
        const wData = city.weather;
        const tempText = wData?.temp_c !== undefined ? `${wData.temp_c}°C` : '...';
        const condText = wData?.condition || 'no data';
        const niceness = wData?.niceness || 'unkown';
        const iconUrl = wData?.icon || null;
        const markerIcon = createMarkerIcon(niceness, iconUrl);
        const minutesOld = wData && wData.timestamp ? Math.floor((Date.now() - wData.timestamp) / 60000) : null;

        return (
          <Marker 
            key={cityId} 
            position={[city.lat, city.lon]} 
            icon={markerIcon}
          >
            <Popup>
              <WeatherPopup>
                <strong>{cityName}</strong>
                <span>Temp: {tempText}</span>
                <span>Condition: {condText}</span>
                <span>Weather is <em>{niceness}</em></span>
                {iconUrl && <WeatherIcon src={iconUrl} alt="weather icon" />}
                {minutesOld !== null && (
                  <span style={{ fontSize: '12px', color: 'gray' }}>
                    Updated {minutesOld} minute{minutesOld === 1 ? '' : 's'} ago
                  </span>
                )}
              </WeatherPopup>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
