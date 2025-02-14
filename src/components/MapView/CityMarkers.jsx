import React from 'react';
import { useSelector } from 'react-redux';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';

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

const WeatherPopup = styled.div`
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const WeatherIcon = styled.img`
  width: 40px;
  height: 40px;
`;

function classifyWeather(temp_c, conditionText) {
  const noRain = !conditionText?.toLowerCase().includes('rain');
  const tempIsGood = temp_c >= 18 && temp_c <= 25;
  if (noRain && tempIsGood) return 'nice 😊';
  if (noRain || tempIsGood) return 'passable 🤨';
  return 'not nice 😢';
}

export default function CityMarkers() {
  const { filteredCities } = useSelector((state) => state.cities);
  const { weatherById } = useSelector((state) => state.weather);

  return (
    <>
      {filteredCities.map((city) => {
        const cityName = city.tags?.name || 'Unnamed City';
        const cityId = city.id;
        const wData = weatherById[cityId];
        const tempText = wData?.temp_c !== undefined ? `${wData.temp_c}°C` : '...';
        const condText = wData?.condition || 'no data';
        const temp_c = wData?.temp_c ?? '?';
        const niceness = classifyWeather(temp_c, condText);
        const iconUrl = wData?.icon || null;
        const markerIcon = createMarkerIcon(niceness, iconUrl);

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
              </WeatherPopup>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
