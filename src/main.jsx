import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './app/store/store';
import App from './app/App';
import { ThemeProvider } from 'styled-components';
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme } from './features/theme/theme';

const Root = () => {
  const theme = useSelector(state => state.theme.mode);
  
  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <App />
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Root />
    </Provider>
  </React.StrictMode>
);