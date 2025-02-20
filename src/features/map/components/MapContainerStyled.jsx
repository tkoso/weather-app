import styled from 'styled-components';
import { MapContainer } from 'react-leaflet';

const MapContainerStyled = styled(MapContainer)`
  /* Disable touch actions on map when interacting with controls */
  .leaflet-container {
    touch-action: none;
  }
`;

export default MapContainerStyled;