import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">About This Template</h1>
        <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
          This is a modern Next.js template with TypeScript, Tailwind CSS, and other essential tools
          pre-configured.
        </p>

        <div className="space-y-4">
          <h2 className="mb-2 mt-6 text-2xl font-semibold">Features</h2>
          <ul className="list-disc space-y-2 pl-6">
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
            className="text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
