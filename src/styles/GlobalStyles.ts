import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  /* Reset and Base Setup */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', sans-serif;
    font-size: ${({ theme }) => theme.fontSizes.body};
    color: ${({ theme }) => theme.colours.text};
    background-color: ${({ theme }) => theme.colours.background};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: color 0.3s ease;
  }

  img {
    max-width: 100%;
    display: block;
  }

  ul, ol {
    list-style: none;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  /* Reusable Utilities */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.container};
  }

  .section {
    padding: ${({ theme }) => theme.spacing.section} 0;
  }

  .text-center {
    text-align: center;
  }

  .divider {
    width: 6rem;
    height: 0.25rem;
    background-color: ${({ theme }) => theme.colours.primary};
    margin: 0 auto;
  }

  .text-heading {
    font-size: ${({ theme }) => theme.fontSizes.heading};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
  }

  .text-subheading {
    font-size: ${({ theme }) => theme.fontSizes.subheading};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }

  .text-body {
    font-size: ${({ theme }) => theme.fontSizes.body};
    font-weight: ${({ theme }) => theme.fontWeights.regular};
  }

  .text-small {
    font-size: ${({ theme }) => theme.fontSizes.small};
    font-weight: ${({ theme }) => theme.fontWeights.regular};
  }

  /* Optional Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colours.primary};
    border-radius: 5px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colours.surface};
  }
`
