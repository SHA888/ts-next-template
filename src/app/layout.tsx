import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { MainNav } from '@/components/main-nav';

// Import global styles
import '@/app/globals.css';
import '@/styles/animations.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: 'Next.js Template',
    template: '%s | Next.js Template',
  },
  description: 'A modern Next.js template with TypeScript, Tailwind CSS, and more',
  keywords: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Template'],
  authors: [
    {
      name: 'Your Name',
      url: 'https://yourwebsite.com',
    },
  ],
  creator: 'Your Name',
  publisher: 'Your Company',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yourwebsite.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourwebsite.com',
    siteName: 'Next.js Template',
    title: 'Next.js Template',
    description: 'A modern Next.js template with TypeScript, Tailwind CSS, and more',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js Template',
    description: 'A modern Next.js template with TypeScript, Tailwind CSS, and more',
    creator: '@yourusername',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#000000',
      },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} scroll-smooth`}
      style={{ scrollBehavior: 'smooth' }}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-background min-h-screen font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <MainNav />
            <main className="flex-1">
              <div className="container py-8">{children}</div>
            </main>
            <footer className="border-t py-6">
              <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                <p className="text-muted-foreground text-center text-sm leading-loose md:text-left">
                  Built with Next.js, TypeScript, and Tailwind CSS.
                </p>
                <p className="text-muted-foreground text-center text-sm md:text-right">
                  © {new Date().getFullYear()} Next.js Template. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
