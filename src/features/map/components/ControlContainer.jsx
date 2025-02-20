import styled from 'styled-components';

const ControlContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: ${({ theme }) => theme.background};
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  * {
    pointer-events: all !important;
    touch-action: manipulation !important;
  }
`;

export default ControlContainer;