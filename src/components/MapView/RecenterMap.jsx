import React from 'react';
import { useMap } from 'react-leaflet';

export default function RecenterMap({ lat, lng, recenterTrigger }) {
  const map = useMap();

  React.useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, recenterTrigger, map]);

  return null;
}
