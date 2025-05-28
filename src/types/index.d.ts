// src/types/index.d.ts
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colours: {
      background: string;
      text: string;
      primary: string;
      error: string;
      success: string;
    };
  }
}