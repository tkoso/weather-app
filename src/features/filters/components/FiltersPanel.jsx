import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm, setPopulationRange } from '../slices/filtersSlice';
import styled from 'styled-components';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import { useMap } from 'react-leaflet';
import MyStyledButton from '../../location/components/MyStyledButton';

import FiltersContainer from './FiltersContainer';
import SliderContainer from './SliderContainer';
import SliderLabels from './SliderLabels';
import FilterGroup from './FilterGroup';
import FilterLabel from './FilterLabel';


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
                <div>
                  <span className="range-display">
                    Selected: {minPopulation.toLocaleString()} - {maxPopulation.toLocaleString()}
                  </span>
                  <span className="available-range">
                    Available: {dataMinPopulation.toLocaleString()} - {dataMaxPopulation.toLocaleString()}
                  </span>
                </div>
              </SliderLabels>
            </label>
          </SliderContainer>
        </>
      )}
      </FiltersContainer>
      
  );
}