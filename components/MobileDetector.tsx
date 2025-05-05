'use client'

import { useEffect, useState } from 'react'

const MobileDetector = () => {
  const [isMobile, setIsMobile] = useState(false)

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
      
      // Use the correct path - ensure we load from the right location
      // First try the app directory path
      mobileStylesheet.href = '/app/mobile.css'
      
      document.head.appendChild(mobileStylesheet)
      
      // Set a fallback in case the first path doesn't work
      mobileStylesheet.onerror = () => {
        mobileStylesheet!.href = '/mobile.css'
      }
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
          padding-top: 4rem;
        }
      `}</style>
    )
  }

  return null
}

export default MobileDetector 