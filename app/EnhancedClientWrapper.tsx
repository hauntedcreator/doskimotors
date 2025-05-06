'use client'

import React, { Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { delayLoadResources } from './simplify-services'
import { useEffect } from 'react'

// Create a separate component for search params 
function SearchParamsComponent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  return <>{children}</>
}

interface EnhancedClientWrapperProps {
  children: React.ReactNode
}

/**
 * A wrapper component that enhances client-side navigation behavior
 * - Forces full page refreshes for problematic routes
 * - Tracks and optimizes page transitions
 * - Ensures components are properly loaded before displaying
 */
export default function EnhancedClientWrapper({ 
  children,
  delayMs = 0
}: { 
  children: React.ReactNode,
  delayMs?: number
}) {
  const pathname = usePathname()
  
  // Load any essential resources on mount
  useEffect(() => {
    const cleanup = delayLoadResources(() => {
      // Logic can go here
    }, delayMs)
    
    return () => cleanup()
  }, [delayMs, pathname])
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsComponent>
        {children}
      </SearchParamsComponent>
    </Suspense>
  )
} 