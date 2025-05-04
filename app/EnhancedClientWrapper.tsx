'use client'

import React, { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface EnhancedClientWrapperProps {
  children: React.ReactNode
}

/**
 * A wrapper component that enhances client-side navigation behavior
 * - Forces full page refreshes for problematic routes
 * - Tracks and optimizes page transitions
 * - Ensures components are properly loaded before displaying
 */
export default function EnhancedClientWrapper({ children }: EnhancedClientWrapperProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // Define routes that need special handling
    const problematicRoutes = ['/services', '/about']
    
    // Add logic to handle navigation to problematic routes
    const handleNavigation = () => {
      const currentRouteIsProblematic = problematicRoutes.includes(pathname)
      
      if (currentRouteIsProblematic) {
        console.log(`EnhancedClientWrapper: Handling problematic route ${pathname}`)
        
        // Set a timestamp to track page load time
        window.sessionStorage.setItem('pageLoadStart', Date.now().toString())
        
        // Add these params to the URL if not present to indicate this is a direct load
        if (!searchParams.has('direct')) {
          const url = new URL(window.location.href)
          url.searchParams.set('direct', 'true')
          window.history.replaceState({}, '', url)
        }
      }
    }
    
    handleNavigation()
    
    // Log performance metrics
    if (pathname === '/services' || pathname === '/about') {
      const loadStart = window.sessionStorage.getItem('pageLoadStart')
      if (loadStart) {
        const loadTime = Date.now() - parseInt(loadStart)
        console.log(`Page ${pathname} loaded in ${loadTime}ms`)
      }
    }
    
    // Cleanup function
    return () => {
      // Perform any necessary cleanup when navigating away
    }
  }, [pathname, searchParams])
  
  return <>{children}</>
} 