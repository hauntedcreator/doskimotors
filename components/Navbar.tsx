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
  const [currentPath, setCurrentPath] = useState('/')

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Set current path
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname)
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

  // Determine if we're on a subpage
  const isSubpage = currentPath !== '/'
  const isHomePage = currentPath === '/'
  
  // Set transparent navbar for home, white for subpages
  const navBgClass = (isMobile && !isHomePage) || (isScrolled && isHomePage) || (!isHomePage) 
    ? 'bg-white shadow-sm' 
    : 'bg-transparent'

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBgClass}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center z-10">
            <div className="flex items-center">
              <Logo 
                size={isMobile ? 'small' : 'large'} 
                textColor={isMobile && !isHomePage ? 'black' : isScrolled && isHomePage ? 'black' : !isHomePage ? 'black' : 'white'} 
                className="py-0"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <Link 
              href="/vehicles" 
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${
                isScrolled || isSubpage ? 'text-gray-900' : 'text-white'
              }`}
              style={{
                textShadow: !isSubpage && !isScrolled ? '2px 2px 4px rgba(0, 0, 0, 0.5)' : 'none'
              }}
            >
              Vehicles
            </Link>
            <Link 
              href="/financing" 
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${
                isScrolled || isSubpage ? 'text-gray-900' : 'text-white'
              }`}
              style={{
                textShadow: !isSubpage && !isScrolled ? '2px 2px 4px rgba(0, 0, 0, 0.5)' : 'none'
              }}
            >
              Financing
            </Link>
            <Link 
              href="/services" 
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${
                isScrolled || isSubpage ? 'text-gray-900' : 'text-white'
              }`}
              style={{
                textShadow: !isSubpage && !isScrolled ? '2px 2px 4px rgba(0, 0, 0, 0.5)' : 'none'
              }}
            >
              Services
            </Link>
            <Link 
              href="/tesla-repairs" 
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${
                isScrolled || isSubpage ? 'text-gray-900' : 'text-white'
              }`}
              style={{
                textShadow: !isSubpage && !isScrolled ? '2px 2px 4px rgba(0, 0, 0, 0.5)' : 'none'
              }}
            >
              Tesla Repairs
            </Link>
            <Link 
              href="/about" 
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${
                isScrolled || isSubpage ? 'text-gray-900' : 'text-white'
              }`}
              style={{
                textShadow: !isSubpage && !isScrolled ? '2px 2px 4px rgba(0, 0, 0, 0.5)' : 'none'
              }}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${
                isScrolled || isSubpage ? 'text-gray-900' : 'text-white'
              }`}
              style={{
                textShadow: !isSubpage && !isScrolled ? '2px 2px 4px rgba(0, 0, 0, 0.5)' : 'none'
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

          {/* Mobile menu button - using same color as logo text */}
          <div className="md:hidden z-50">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                isMobile && !isHomePage ? 'text-gray-900' : 
                isScrolled && isHomePage ? 'text-gray-900' : 
                !isHomePage ? 'text-gray-900' : 'text-white'
              } hover:text-blue-600`}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - simplified with all pages visible */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ top: '56px', height: 'calc(100vh - 56px)', zIndex: 40 }}
          >
            <div className="h-full overflow-y-auto">
              {/* Menu Items - simple list with no fancy styling */}
              <div className="flex flex-col">
                <MobileMenuItem href="/vehicles" label="Vehicles" onClick={() => setIsMenuOpen(false)} />
                <MobileMenuItem href="/financing" label="Financing" onClick={() => setIsMenuOpen(false)} />
                <MobileMenuItem href="/services" label="Services" onClick={() => setIsMenuOpen(false)} />
                <MobileMenuItem href="/tesla-repairs" label="Tesla Repairs" onClick={() => setIsMenuOpen(false)} />
                <MobileMenuItem href="/about" label="About" onClick={() => setIsMenuOpen(false)} />
                <MobileMenuItem href="/contact" label="Contact" onClick={() => setIsMenuOpen(false)} />
                
                <div className="px-4 py-4 mt-2">
                  <button 
                    onClick={() => {
                      handleLocationClick();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-base font-medium"
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

// Simple component for mobile menu item
const MobileMenuItem = ({ href, label, onClick }) => (
  <Link
    href={href}
    className="block w-full text-left border-b border-gray-100"
    onClick={onClick}
  >
    <div className="px-4 py-3 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50">
      {label}
    </div>
  </Link>
)

export default Navbar 