// Type definitions for CSS modules and related files

/**
 * CSS Module class names mapping
 */
interface CSSModuleClasses {
  readonly [key: string]: string;
}

/**
 * Extended CSSStyleDeclaration with CSS custom properties support
 */
interface CSSStyleDeclaration {
  [key: `--${string}`]: string | number | undefined;
}

// CSS Module file type declarations
declare module '*.module.css' {
  const classes: CSSModuleClasses;
  export default classes;
}

declare module '*.module.scss' {
  const classes: CSSModuleClasses;
  export default classes;
}

declare module '*.module.sass' {
  const classes: CSSModuleClasses;
  export default classes;
}

declare module '*.module.less' {
  const classes: CSSModuleClasses;
  export default classes;
}

// Global CSS files
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

// Tailwind CSS types
declare module 'tailwindcss/colors' {
  type ColorShade = {
    [key: string | number]: string;
  };

  export const colors: {
    [key: string]: string | ColorShade;
  };
}

// PostCSS loader options
type PostCSSPlugin = string | [string, Record<string, unknown>] | Record<string, unknown>;

interface PostCSSLoaderOptions {
  postcssOptions: {
    plugins: PostCSSPlugin[];
    syntax?: 'sugarss' | 'postcss-scss' | 'postcss-sass' | 'postcss-less';
  };
}

// Add global CSS types
declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.less';
