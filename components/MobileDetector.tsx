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
        document.documentElement.classList.add('is-mobile')
        setIsMobile(true)
        
        // Add touch class to help with styling
        document.documentElement.classList.add('touchevents')
        
        // Debug class to help diagnose issues
        document.body.classList.add('mobile-debug')
      } else {
        document.body.classList.remove('is-mobile-device')
        document.body.classList.remove('mobile-debug')
        document.documentElement.classList.remove('touchevents')
        document.documentElement.classList.remove('is-mobile')
        setIsMobile(false)
      }

      // Make sure HTML uses a full viewport
      document.documentElement.style.height = '100%'
      document.body.style.minHeight = '100%'
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

    // Add one more mobile-specific reset stylesheet for emergency fixes
    let emergencyStylesheet = document.getElementById('mobile-emergency-fixes')
    if (!emergencyStylesheet) {
      emergencyStylesheet = document.createElement('style')
      emergencyStylesheet.id = 'mobile-emergency-fixes'
      emergencyStylesheet.innerHTML = `
        @media (max-width: 767px) {
          /* Force basic structure */
          html, body { 
            width: 100% !important; 
            height: auto !important;
            min-height: 100% !important;
            margin: 0 !important; 
            padding: 0 !important;
            overflow-x: hidden !important;
          }
          
          /* Force static positioning for layout */
          body.mobile-debug section,
          body.mobile-debug main > div,
          body.mobile-debug main > div > div {
            position: static !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            display: block !important;
            margin-bottom: 1rem !important;
          }
          
          /* Fix content scrolling */
          main {
            overflow-x: hidden !important;
            height: auto !important;
            min-height: 100% !important;
            padding-top: 60px !important;
            display: block !important;
          }
          
          /* Basic reset for hero section */
          .h-screen {
            height: auto !important;
            min-height: 100vh !important;
            position: relative !important;
            padding-top: 60px !important;
          }
          
          /* Override animations to prevent layout issues */
          * {
            animation: none !important;
            transition: none !important;
            transform: none !important;
          }
        }
      `
      document.head.appendChild(emergencyStylesheet)
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('resize', setVh)
      window.removeEventListener('orientationchange', setVh)
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
        
        /* Ensure spacing for content */
        body.is-mobile-device main {
          padding-top: 0;
        }
        
        /* Ensure content is visible */
        body.mobile-debug main > div {
          display: block !important;
          position: static !important;
          height: auto !important;
        }
      `}</style>
    )
  }

  return null
}

export default MobileDetector 