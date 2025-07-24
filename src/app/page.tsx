import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          Welcome to TS Next Template
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          A modern Next.js template with TypeScript, Tailwind CSS, and more.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/about"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            About Page
          </Link>
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Documentation
          </a>
        </div>
      </div>
    </div>
  );
}
