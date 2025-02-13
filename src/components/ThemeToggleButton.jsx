import styled from 'styled-components';

const ToggleButton = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  background-color: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;

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