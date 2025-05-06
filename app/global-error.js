'use client';

// Error boundaries must be Client Components
export default function GlobalError({
  error,
  reset,
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
          <div className="max-w-lg w-full text-center">
            <h1 className="text-6xl font-bold text-red-600">Error</h1>
            <h2 className="text-3xl font-semibold mt-4 mb-6">Something went wrong</h2>
            <p className="text-lg text-gray-600 mb-8">
              We're sorry, but something went wrong on our end.
            </p>
            <button
              onClick={() => reset()}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mr-4"
            >
              Try again
            </button>
            <a 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Return home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
} 