import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm, setPopulationRange } from '../slices/filtersSlice';
import styled from 'styled-components';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import { useMap } from 'react-leaflet';
import MyStyledButton from './MyStyledButton';

const FiltersContainer = styled.div`
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  margin: 0.7rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-color: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
`;

const SliderContainer = styled.div`
  font-size: 1.0rem;
  padding: 0.5rem 0.75rem;
  background: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 6px;
  margin: 1rem 0;
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textSecondary};

  span {
    background: ${({ theme }) => theme.backgroundSecondary};
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }
`;

const FilterGroup = styled.div`
  margin: 0.7rem 0;
  &:first-child {
    margin-top: 1rem;
  }
`;

const FilterLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 0.75rem;
  font-weight: 500;
`;

export default function FiltersPanel() {
  const [expanded, setExpanded] = React.useState(false);
  const dispatch = useDispatch();
  const map = useMap();
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
      <MyStyledButton onClick={() => setExpanded(!expanded)}>
        {expanded ? '▲ Filters' : '▼ Filters'}
      </MyStyledButton>
      
      {expanded && (
        <>
          <FilterGroup>
            {/* name search input */}
            <FilterLabel>
              Search by name:
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                placeholder="Type city name..."
              />
            </FilterLabel>
          </FilterGroup>

          {/* population range slider with */}
          <SliderContainer>
            <label>
              Population range:
              <Slider
                range
                min={dataMinPopulation}
                max={dataMaxPopulation}
                value={[minPopulation, maxPopulation]}
                onChange={onRangeChange}
                step={1000}
                /* TODO: think about swapping deprecated attribute */
                onBeforeChange={() => {
                  if (map && map.dragging) {
                    map.dragging.disable();
                  }
                }}
                onChangeComplete={() => {
                  if (map && map.dragging) {
                    map.dragging.enable();
                  }
                }}
              />
              <SliderLabels>
                <span>Min: {minPopulation.toLocaleString()}</span>
                <br />
                <span>Max: {maxPopulation.toLocaleString()}</span>
              </SliderLabels>
            </label>
          </SliderContainer>
        </>
      )}
      </FiltersContainer>
      
  );
}