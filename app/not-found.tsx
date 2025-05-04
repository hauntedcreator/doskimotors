'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'

// Wrapper component with Suspense
function NotFoundWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  )
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
  )
}

export default NotFoundWrapper 