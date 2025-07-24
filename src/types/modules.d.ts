// Type declarations for modules without types

// Only declare modules if they haven't been declared elsewhere
type CSSModuleClasses = { readonly [key: string]: string };

// Use a namespace to avoid global scope pollution
declare global {
  // CSS Modules
  module '*.module.css' {
    const classes: CSSModuleClasses;
    export default classes;
  }

  // Image files
  module '*.png' {
    const content: string;
    export default content;
  }

  module '*.jpg' {
    const content: string;
    export default content;
  }

  module '*.jpeg' {
    const content: string;
    export default content;
  }

  // SVG files
  module '*.svg' {
    import type { FC, SVGProps } from 'react';
    const content: FC<SVGProps<SVGSVGElement>>;
    export default content;
  }
}

// Utils module
declare module '@/lib/utils' {
  import type { ClassValue } from 'clsx';

  export function cn(...inputs: ClassValue[]): string;
  export function formatDate(input: string | number): string;
  export function absoluteUrl(path: string): string;
  export function capitalize(str: string): string;
  export function truncate(str: string, length: number): string;
}
