# Style Guide

## Colors

### Primary Palette

- **Primary**: `hsl(240 5.9% 10%)` - Used for primary actions and important elements
- **Primary Foreground**: `hsl(0 0% 98%)` - Text on primary color

### Semantic Colors

- **Success**: `hsl(142.1 76.2% 36.3%)` - For success states and positive actions
- **Warning**: `hsl(38 92% 50%)` - For warning states
- **Info**: `hsl(221.2 83.2% 53.3%)` - For informational messages
- **Destructive**: `hsl(0 84.2% 60.2%)` - For error states and destructive actions

### Neutral Colors

- **Background**: `hsl(0 0% 100%)` - Page background
- **Foreground**: `hsl(240 10% 3.9%)` - Primary text color
- **Muted**: `hsl(240 3.8% 46.1%)` - Secondary text color
- **Border**: `hsl(240 5.9% 90%)` - Border colors

## Typography

### Font Family

- **Sans**: System UI, sans-serif (default)
- **Mono**: Menlo, Monaco, Consolas, monospace

### Text Styles

- **Display**: For large, attention-grabbing headings
- **Heading 1-6**: Semantic heading hierarchy
- **Body**: Base text style for paragraphs and content
- **Small**: For secondary text and captions

## Components

### Buttons

- **Primary**: Solid buttons for primary actions
- **Secondary**: Outlined buttons for secondary actions
- **Ghost**: Minimal buttons for less prominent actions
- **Link**: Text buttons that look like links

### Cards

- Used for grouping related content
- Includes header, content, and footer sections
- Supports hover and focus states

### Forms

- Input fields with proper labels and validation states
- Checkboxes and radio buttons with custom styling
- Consistent spacing and alignment

## Spacing System

Based on a 4px grid system:

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

## Breakpoints

- `xs`: 475px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1400px

## Dark Mode

All components support dark mode with automatic color scheme switching based on system preferences. The color palette is inverted for dark mode while maintaining contrast and readability.

## Custom Utilities

- **Text Balance**: `.text-balance` - Balances text across multiple lines
- **Scroll Snap**: Utilities for scroll snapping containers
- **Backdrop Blur**: `backdrop-blur-sm/md/lg` - For frosted glass effects

## Best Practices

1. Use semantic HTML elements where possible
2. Follow the spacing system for consistent layouts
3. Use Tailwind's responsive prefixes for mobile-first designs
4. Test components in both light and dark modes
5. Use the provided color variables for theming
