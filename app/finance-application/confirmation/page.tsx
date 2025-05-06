'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Footer from '../../components/Footer';

// Component that safely uses useSearchParams
function ConfirmationContent() {
  // Main component that uses useSearchParams
  // Even if we don't directly see useSearchParams in the code,
  // we need to ensure it's wrapped in a Suspense boundary
  const searchParams = useSearchParams();
  const firstName = searchParams.get('firstName') || 'Customer';
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, duration: 0.5 }}
            className="inline-block mb-6"
          >
            <CheckCircleIcon className="h-24 w-24 text-green-500" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4"
          >
            Application Submitted!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-lg sm:text-xl text-gray-600 mb-10"
          >
            Thank you, {firstName}! Your financing application has been successfully submitted. Our team will review your application and reach out to you within 24-48 hours.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              href="/vehicles"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Browse Vehicles
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Return Home
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function FinanceConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
} 