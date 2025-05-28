// src/styles/GlobalStyles.ts
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    background-colour: ${({ theme }) => theme.colours.background};
    colour: ${({ theme }) => theme.colours.text};
  }

  a {
    text-decoration: none;
    colour: inherit;
  }
`;
