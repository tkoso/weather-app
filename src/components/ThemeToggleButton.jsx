import styled from 'styled-components';

const ToggleButton = styled.button`
  position: absolute;
  top: 0.1rem;
  right: 0.1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  background-color: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  z-index: 1001;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }
`;

export default function ThemeToggleButton({ onClick, theme }) {
  return (
    <ToggleButton onClick={onClick}>
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </ToggleButton>
  );
}