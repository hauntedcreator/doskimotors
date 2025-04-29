'use client';

import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function FinanceConfirmation() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Application Submitted Successfully!
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Thank you for submitting your finance application. We will review your information shortly.
          </p>
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-900">What happens next?</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                  1
                </div>
              </div>
              <div className="ml-4">
                <p className="text-base font-medium text-gray-900">Application Review</p>
                <p className="mt-1 text-sm text-gray-500">
                  Our finance team will review your application within 24-48 business hours.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                  2
                </div>
              </div>
              <div className="ml-4">
                <p className="text-base font-medium text-gray-900">Initial Contact</p>
                <p className="mt-1 text-sm text-gray-500">
                  A finance specialist will contact you to discuss your application and available options.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                  3
                </div>
              </div>
              <div className="ml-4">
                <p className="text-base font-medium text-gray-900">Documentation</p>
                <p className="mt-1 text-sm text-gray-500">
                  We'll guide you through any additional documentation needed to complete your application.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <h3 className="text-xl font-semibold text-gray-900">Need assistance?</h3>
          <div className="mt-4 text-sm text-gray-600">
            <p>Contact our finance team:</p>
            <ul className="mt-2 space-y-2">
              <li>📞 Phone: (555) 123-4567</li>
              <li>📧 Email: finance@dealership.com</li>
              <li>⏰ Hours: Monday - Friday, 9:00 AM - 6:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
} 