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

    // Add custom mobile stylesheet
    const style = document.createElement('link')
    style.rel = 'stylesheet'
    style.href = '/mobile.css'
    style.id = 'mobile-stylesheet'
    style.media = '(max-width: 767px)'
    document.head.appendChild(style)

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('resize', setVh)
      window.removeEventListener('orientationchange', setVh)
      
      const mobileStylesheet = document.getElementById('mobile-stylesheet')
      if (mobileStylesheet) {
        mobileStylesheet.remove()
      }
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
      `}</style>
    )
  }

  return null
}

export default MobileDetector 