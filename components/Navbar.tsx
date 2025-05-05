'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, AnimatePresence } from 'framer-motion'
import Logo from './Logo'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Run on mount and window resize
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Scroll listener
    const scrollListener = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50)
    })

    return () => {
      window.removeEventListener('resize', checkMobile)
      scrollListener()
    }
  }, [scrollY])

  const handleLocationClick = () => {
    // Check if the user is on iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      window.location.href = 'maps://maps.apple.com/?q=7490+Opportunity+Rd+STE+2900+San+Diego+CA+92111'
    }
    // Check if the user is on Android
    else if (/Android/.test(navigator.userAgent)) {
      window.location.href = 'geo:0,0?q=7490+Opportunity+Rd+STE+2900+San+Diego+CA+92111'
    }
    // Default to web version
    else {
      window.open('https://www.google.com/maps/place/7490+Opportunity+Rd+STE+2900,+San+Diego,+CA+92111', '_blank')
    }
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isMobile || isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo - made smaller on mobile */}
          <Link href="/" className="flex items-center md:flex-1">
            <div className="mr-auto md:mr-0">
              <Logo size={isMobile ? 'small' : 'large'} textColor={isMobile || isScrolled ? 'black' : 'white'} />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <Link 
              href="/vehicles" 
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}
              style={{
                textShadow: isScrolled ? 'none' : '2px 2px 4px rgba(0, 0, 0, 0.5)'
              }}
            >
              Vehicles
            </Link>
            <Link 
              href="/financing" 
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}
              style={{
                textShadow: isScrolled ? 'none' : '2px 2px 4px rgba(0, 0, 0, 0.5)'
              }}
            >
              Financing
            </Link>
            <Link 
              href="/services" 
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}
              style={{
                textShadow: isScrolled ? 'none' : '2px 2px 4px rgba(0, 0, 0, 0.5)'
              }}
            >
              Services
            </Link>
            <Link 
              href="/tesla-repairs" 
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}
              style={{
                textShadow: isScrolled ? 'none' : '2px 2px 4px rgba(0, 0, 0, 0.5)'
              }}
            >
              Tesla Repairs
            </Link>
            <Link 
              href="/about" 
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}
              style={{
                textShadow: isScrolled ? 'none' : '2px 2px 4px rgba(0, 0, 0, 0.5)'
              }}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}
              style={{
                textShadow: isScrolled ? 'none' : '2px 2px 4px rgba(0, 0, 0, 0.5)'
              }}
            >
              Contact
            </Link>
            <button
              onClick={handleLocationClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Dealership Location
            </button>
          </div>

          {/* Mobile menu button - moved to the right with increased touch target */}
          <div className="md:hidden z-50">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-3 rounded-md text-gray-900 hover:text-blue-600"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-7 w-7" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-7 w-7" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - made fullscreen for better usability */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="pt-20 px-2 pb-3 h-full overflow-y-auto">
              <div className="space-y-2">
                <Link
                  href="/vehicles"
                  className="block px-4 py-4 rounded-md text-lg font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Vehicles
                </Link>
                <Link
                  href="/financing"
                  className="block px-4 py-4 rounded-md text-lg font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Financing
                </Link>
                <Link
                  href="/services"
                  className="block px-4 py-4 rounded-md text-lg font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="/tesla-repairs"
                  className="block px-4 py-4 rounded-md text-lg font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tesla Repairs
                </Link>
                <Link
                  href="/about"
                  className="block px-4 py-4 rounded-md text-lg font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block px-4 py-4 rounded-md text-lg font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="px-4 py-4">
                  <button 
                    onClick={() => {
                      handleLocationClick();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium shadow-sm"
                  >
                    Dealership Location
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar 