// Type definitions for next-themes
// Project: https://github.com/pacocoursey/next-themes

declare module 'next-themes' {
  import React from 'react';

  export type Theme = 'light' | 'dark' | 'system';

  interface ThemeProviderProps {
    children: React.ReactNode;
    /** Default theme */
    defaultTheme?: Theme;
    /** HTML attribute modified based on the active theme. Accepts `class` or `data-*` (meaning any data attribute, `data-mode`, `data-color`, etc.) */
    attribute?: string | 'class';
    /** Mapping of theme name to HTML attribute value. Object where key is the theme name and value is the attribute value */
    value?: Record<Theme, string>;
    /** Nonce string to pass to the inline script for CSP headers */
    nonce?: string;
    /** Whether to transition between themes using CSS transitions */
    enableSystem?: boolean;
    /** Disable all CSS transitions when switching themes */
    disableTransitionOnChange?: boolean;
    /** Whether to indicate to browsers which color scheme is used (dark or light) for built-in UI like inputs and buttons */
    enableColorScheme?: boolean;
    /** Key used to store theme setting in localStorage */
    storageKey?: string;
    /** List of themes supported by your application */
    themes?: string[];
    /** Forced theme name for the current page */
    forcedTheme?: string | null;
  }

  export const ThemeProvider: React.FC<ThemeProviderProps>;

  export function useTheme(): {
    /** Active theme name */
    theme: string | undefined;
    /** Function to update the theme */
    setTheme: (theme: string) => void;
    /** Active theme name (resolved from system preference) */
    resolvedTheme: string | undefined;
    /** System theme preference (dark or light) */
    systemTheme: 'dark' | 'light' | undefined;
    /** List of all available themes */
    themes: string[];
  };
}
