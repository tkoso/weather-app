import styled from 'styled-components';

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

export default FiltersContainer;