'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

// Main page component with Suspense boundary
export default function NotFound404Page() {
  // This component doesn't use useSearchParams so no suspense needed at this level
  return (
    <Suspense fallback={<NotFoundSkeleton />}>
      <NotFoundContent />
    </Suspense>
  );
}

// Actual content component
function NotFoundContent() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-3xl font-semibold mt-4 mb-6">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}

// Skeleton component for loading state
function NotFoundSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="h-32 w-32 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mt-6 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mt-4 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-40 mx-auto mt-8 animate-pulse"></div>
      </div>
    </div>
  );
} 