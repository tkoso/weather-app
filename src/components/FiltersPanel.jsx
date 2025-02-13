import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm, setPopulationRange } from '../slices/filtersSlice';
import styled from 'styled-components';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

const FiltersContainer = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  margin: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => theme.background};
  border-color: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
`;

export default function FiltersPanel() {
  const dispatch = useDispatch();
  const { 
    searchTerm = '', 
    minPopulation = 0, 
    maxPopulation = Infinity, 
    dataMinPopulation = 0, 
    dataMaxPopulation = Infinity 
  } = useSelector(state => state.filters || {});

  // Handler to update the range values
  const onRangeChange = (values) => {
    // values is an array: [newMin, newMax]
    dispatch(setPopulationRange({ min: values[0], max: values[1] }));
  };

  return (
    <FiltersContainer>      
      {/* name search input */}
      <div className="filter-group">
        <label>
          Search by name:
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            placeholder="Type city name..."
          />
        </label>
      </div>

      {/* population range slider with */}
      <div className="filter-group">
        <label>
          Population range:
          <Slider
            range
            min={dataMinPopulation}
            max={dataMaxPopulation}
            value={[minPopulation, maxPopulation]}
            onChange={onRangeChange}
            step={1000}
          />
          <div className="slider-labels">
            <span>Min: {minPopulation.toLocaleString()}</span>
            <br />
            <span>Max: {maxPopulation.toLocaleString()}</span>
          </div>
        </label>
      </div>
    </FiltersContainer>
  );
}