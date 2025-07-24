import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export function MainNav() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">Next.js Template</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary flex items-center text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-primary flex items-center text-sm font-medium transition-colors"
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
