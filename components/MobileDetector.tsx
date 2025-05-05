'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const MobileDetector = () => {
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Function to check if the device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      const isMobileDevice = mobileRegex.test(userAgent)
      const isSmallScreen = window.innerWidth < 768
      
      // Apply specific mobile class if on a mobile device or small screen
      if (isMobileDevice || isSmallScreen) {
        document.body.classList.add('is-mobile-device')
        setIsMobile(true)
        
        // Add touch class to help with styling
        document.documentElement.classList.add('touchevents')
      } else {
        document.body.classList.remove('is-mobile-device')
        document.documentElement.classList.remove('touchevents')
        setIsMobile(false)
      }
    }

    // Viewport height fix function
    const setVh = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    // Check on mount
    checkMobile()
    setVh()

    // Check on resize
    window.addEventListener('resize', checkMobile)
    window.addEventListener('resize', setVh)
    window.addEventListener('orientationchange', setVh)

    // Add meta viewport tag if needed
    const metaViewport = document.querySelector('meta[name="viewport"]')
    if (!metaViewport) {
      const meta = document.createElement('meta')
      meta.name = 'viewport'
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=5'
      document.head.appendChild(meta)
    }

    // Check if mobile stylesheet already exists
    let mobileStylesheet = document.getElementById('mobile-stylesheet')
    
    // If it doesn't exist, create it
    if (!mobileStylesheet) {
      mobileStylesheet = document.createElement('link')
      mobileStylesheet.rel = 'stylesheet'
      mobileStylesheet.id = 'mobile-stylesheet'
      mobileStylesheet.media = '(max-width: 767px)'
      
      // Use the direct path to the public folder
      mobileStylesheet.href = '/mobile.css'
      
      document.head.appendChild(mobileStylesheet)
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('resize', setVh)
      window.removeEventListener('orientationchange', setVh)
      
      // Don't remove the stylesheet on unmount to maintain consistency
      // This ensures the mobile styles persist throughout the application
    }
  }, [])

  // Add page-specific class to body
  useEffect(() => {
    // Remove any existing page classes
    document.body.classList.forEach(cls => {
      if (cls.endsWith('-page')) {
        document.body.classList.remove(cls)
      }
    })
    
    // Add class based on current path
    if (pathname === '/') {
      document.body.classList.add('index-page')
    } else {
      // Extract the page name from the path
      const pageName = pathname.split('/')[1]
      if (pageName) {
        document.body.classList.add(`${pageName}-page`)
      }
    }
  }, [pathname])

  if (isMobile) {
    return (
      <style jsx global>{`
        /* Add mobile-optimized body styles */
        body.is-mobile-device {
          -webkit-text-size-adjust: 100%;
          touch-action: manipulation;
        }

        /* Improve form elements for touch */
        body.is-mobile-device input,
        body.is-mobile-device select,
        body.is-mobile-device textarea,
        body.is-mobile-device button {
          font-size: 16px; /* Prevents iOS zoom */
        }

        /* Fix tap highlight color on mobile */
        body.is-mobile-device * {
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
        
        /* Mobile-friendly padding */
        body.is-mobile-device main {
          padding-top: 0;
        }
      `}</style>
    )
  }

  return null
}

export default MobileDetector 