import styled from 'styled-components';

const AppContainer = styled.div`
  text-align: center;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

export default AppContainer;
