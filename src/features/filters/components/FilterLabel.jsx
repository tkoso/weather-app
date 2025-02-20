import styled from 'styled-components';

const FilterLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 0.75rem;
  font-weight: 500;
`;

export default FilterLabel;