import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  position: fixed;
  top: 20px;
  left: 60px;
  border: 6px solid #f3f3f3;
  border-radius: 50%;
  border-top: 8px solid #007bff;
  width: 60px;
  height: 60px;
  animation: ${spin} 1s linear infinite;
  z-index: 1000;
  pointer-events: none;
`;

export default function Loader() {
  return <Spinner />;
}