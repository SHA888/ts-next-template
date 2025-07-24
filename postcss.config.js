// Configuration based on environment
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: {
    // Tailwind CSS
    'tailwindcss/nesting': {},
    tailwindcss: {},

    // Autoprefixer - adds vendor prefixes using data from Can I Use
    autoprefixer: {
      // Don't remove outdated prefixes (like -webkit-) for better browser support
      remove: false,
      // Don't add outdated prefixes (like -ms-) for better performance
      add: true,
      // Don't add IE 10-11 prefixes for better performance
      flexbox: 'no-2009',
      // Enable CSS Grid polyfill for IE 11
      grid: 'autoplace',
    },

    // CSSNano - minification (production only)
    ...(isProduction
      ? {
          cssnano: {
            preset: [
              'default',
              {
                discardComments: {
                  removeAll: true,
                },
                // Don't minify CSS custom properties (CSS variables)
                // to avoid issues with CSS Modules and CSS Variables
                normalizeUrl: false,
                reduceIdents: false,
                // Don't merge rules as it can break CSS specificity
                mergeRules: false,
              },
            ],
          },
        }
      : {}),

    // PostCSS Preset Env - enables modern CSS features
    'postcss-preset-env': {
      stage: 1, // Enable all polyfills
      features: {
        // Enable CSS nesting
        'nesting-rules': true,
        // Enable custom media queries
        'custom-media-queries': true,
        // Enable custom properties (CSS variables)
        'custom-properties': true,
        // Enable all color functions
        'color-functional-notation': true,
        // Enable the :focus-visible pseudo-class
        'focus-visible-pseudo-class': { preserve: false },
        // Enable the :focus-within pseudo-class
        'focus-within-pseudo-class': { preserve: false },
      },
      // Don't warn about features that are polyfilled
      enableClientSidePolyfills: false,
      // Don't add any browser-specific prefixes (handled by autoprefixer)
      autoprefixer: false,
    },

    // PostCSS Import - resolve @import rules
    'postcss-import': {},

    // PostCSS Flexbugs Fixes - fixes flexbox issues in older browsers
    'postcss-flexbugs-fixes': {},

    // PostCSS Normalize - normalize browser defaults
    'postcss-normalize': {
      // Don't force normalize.css to be included
      forceImport: false,
    },

    // PostCSS Custom Properties - better CSS variables support
    'postcss-custom-properties': {
      // Don't remove variables that are only used in :root
      preserve: true,
      // Don't add fallbacks for variables (handled by postcss-preset-env)
      importFrom: [],
    },

    // PostCSS Nested - enables nested rules (alternative to postcss-nesting)
    'postcss-nested': {},

    // PostCSS Assets - inline or copy assets referenced in CSS
    'postcss-assets': {
      // Base path for assets
      loadPaths: ['public/'],
      // Cache busting for assets
      cachebuster: isProduction,
    },
  },
};
