import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">About This Template</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          This is a modern Next.js template with TypeScript, Tailwind CSS, and other essential tools pre-configured.
        </p>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mt-6 mb-2">Features</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Next.js 14+ with App Router</li>
            <li>TypeScript for type safety</li>
            <li>Tailwind CSS for styling</li>
            <li>ESLint and Prettier for code quality</li>
            <li>Husky and lint-staged for Git hooks</li>
          </ul>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
