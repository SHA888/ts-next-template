// Type definitions for next-themes
// Project: https://github.com/pacocoursey/next-themes

// This is a type-only import, no actual import happens at runtime
import type React from 'react';

type Theme = 'light' | 'dark' | 'system';

// Extend the module declarations
declare module 'next-themes' {
  export interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: Theme;
    attribute?: string | 'class';
    value?: Record<Theme, string>;
    nonce?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    enableColorScheme?: boolean;
    storageKey?: string;
    themes?: string[];
    forcedTheme?: string | null;
  }

  // Export the component with proper typing
  export const ThemeProvider: React.FC<ThemeProviderProps>;

  // Export the useTheme hook with proper typing
  export function useTheme(): {
    theme: string | undefined;
    setTheme: (theme: string) => void;
    resolvedTheme: string | undefined;
    systemTheme: 'dark' | 'light' | undefined;
    themes: string[];
  };

  // Re-export the Theme type
  export type { Theme };
}
