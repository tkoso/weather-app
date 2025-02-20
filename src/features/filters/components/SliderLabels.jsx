import styled from 'styled-components';

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textSecondary};

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .range-display {
    background: ${({ theme }) => theme.backgroundSecondary};
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    white-space: nowrap;
  }

  .available-range {
    color: ${({ theme }) => theme.textTertiary};
    font-size: 0.75rem;
  }
`;

export default SliderLabels;