import React from 'react';
import { useDispatch } from 'react-redux';
import { useMapEvents } from 'react-leaflet';
import { requestCitiesInBBox, setBoundingBox } from '../../slices/citiesSlice';

export default function MapEventsHandler() {
  const dispatch = useDispatch();

  useMapEvents({
    moveend: (e) => {
      const map = e.target;
      const bounds = map.getBounds();
      const south = bounds.getSouth();
      const west = bounds.getWest();
      const north = bounds.getNorth();
      const east = bounds.getEast();

      const bboxStr = `${south},${west},${north},${east}`;

      dispatch(setBoundingBox(bboxStr));
      dispatch(requestCitiesInBBox(bboxStr));
    },
  });

  return null;
}
