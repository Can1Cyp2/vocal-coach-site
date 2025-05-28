// src/App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  const base = process.env.NODE_ENV === 'production' ? '/vocal-coach-site' : '/';

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter basename="/vocal-coach-site">
        <GlobalStyles />
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
