// Force static rendering with no client components
export const dynamic = 'force-static';

function Error() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-6xl font-bold text-red-600">Error</h1>
        <h2 className="text-3xl font-semibold mt-4 mb-6">Something went wrong</h2>
        <p className="text-lg text-gray-600 mb-8">
          We're sorry, but something went wrong on our end.
        </p>
        <a 
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="mr-2">←</span>
          Return to Homepage
        </a>
      </div>
    </div>
  );
}

Error.getInitialProps = () => {
  return { statusCode: 500 };
};

export default Error; 