import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { getFilteredCities } from '../selectors/citiesSelectors';

const InfoMessage = styled.div`
  position: fixed;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1rem;
  font-weight: bold;
  color: #a80000;
  background-color: rgba(255, 200, 200, 0.5); /* light red transparent background */
  padding: 0.5rem 1rem;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

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
