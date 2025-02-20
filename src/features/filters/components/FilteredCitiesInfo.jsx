import React from 'react';
import { useSelector } from 'react-redux';
import { getFilteredCities } from '../../cities/selectors/citiesSelectors';

import InfoMessage from './InfoMessage';

export default function FilteredCitiesInfo() {
  const allCities = useSelector((state) => state.cities.allCities);
  const filteredCities = useSelector(getFilteredCities);

  if (allCities.length === filteredCities.length) {
    return null;
  }

  const totalVisible = allCities.length;
  if (totalVisible  === 0) {
    return null;
  }

  const filteredOutCount = totalVisible - filteredCities.length;

  return (
    <InfoMessage>
        {filteredOutCount} cities filtered out of {totalVisible} visible
    </InfoMessage>
  );
}
