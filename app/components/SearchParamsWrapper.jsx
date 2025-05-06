'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Inner component that safely uses useSearchParams
function SearchParamsContent({ children }) {
  // This component safely uses useSearchParams within a Suspense boundary
  const searchParams = useSearchParams();
  
  // Just pass any search params to children if needed
  return <>{children}</>;
}

// Wrapper component that adds Suspense boundary
export default function SearchParamsWrapper({ children, fallback = null }) {
  return (
    <Suspense fallback={fallback}>
      <SearchParamsContent>{children}</SearchParamsContent>
    </Suspense>
  );
} 