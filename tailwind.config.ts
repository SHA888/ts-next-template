/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          light: '#34d399',
          dark: '#059669',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          light: '#fbbf24',
          dark: '#d97706',
        },
        danger: {
          DEFAULT: 'hsl(var(--danger))',
          light: '#f87171',
          dark: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.primary.600'),
              '&:hover': {
                color: theme('colors.primary.700'),
              },
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {
      opacity: ['disabled', 'group-hover'],
      cursor: ['disabled'],
      backgroundColor: ['disabled', 'group-hover', 'focus-visible', 'hover'],
      textColor: ['disabled', 'group-hover', 'focus-visible', 'hover'],
      ringWidth: ['focus-visible', 'focus-within'],
      ringColor: ['focus-visible', 'focus-within'],
      ringOffsetWidth: ['focus-visible', 'focus-within'],
      ringOffsetColor: ['focus-visible', 'focus-within'],
      boxShadow: ['focus-visible', 'focus-within', 'hover'],
      borderWidth: ['last', 'first', 'focus-visible'],
      margin: ['last', 'first'],
      scale: ['group-hover'],
      translate: ['group-hover'],
      transform: ['group-hover'],
      transitionProperty: ['group-hover', 'hover'],
      visibility: ['group-hover'],
      display: ['group-hover'],
      animation: ['motion-safe', 'motion-reduce'],
      width: ['responsive', 'group-hover'],
      height: ['responsive', 'group-hover'],
      padding: ['responsive', 'group-hover'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
    require('tailwindcss-animate'),
    function ({ addVariant }) {
      addVariant('supports-backdrop', '@supports (backdrop-filter: blur(0))');
      addVariant('supports-grid', '@supports (display: grid)');
      addVariant('supports-contain', '@supports (contain: strict)');
      addVariant('supports-scroll-snap', '@supports (scroll-snap-type: x mandatory)');
    },
  ],
  // Optimize for production
  ...(process.env.NODE_ENV === 'production'
    ? {
        content: [
          './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
          './src/components/**/*.{js,ts,jsx,tsx,mdx}',
          './src/app/**/*.{js,ts,jsx,tsx,mdx}',
          './src/styles/**/*.css',
        ],
      }
    : {}),
  future: {
    hoverOnlyWhenSupported: true,
    respectDefaultRingColorOpacity: true,
    disableColorOpacityUtilitiesByDefault: false,
  },
};
