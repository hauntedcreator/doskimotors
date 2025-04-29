'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll } from 'framer-motion'
import Logo from './Logo'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50)
    })
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
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo size="large" textColor={isScrolled ? 'black' : 'white'} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Dealership Location
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-400'
              }`}
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

      {/* Mobile menu */}
      <motion.div
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : -20 }}
        transition={{ duration: 0.2 }}
      >
        <div className={`px-2 pt-2 pb-3 space-y-1 shadow-lg ${
          isScrolled ? 'bg-white' : 'bg-gray-900'
        }`}>
          <Link
            href="/vehicles"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-400'
            }`}
          >
            Vehicles
          </Link>
          <Link
            href="/financing"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-400'
            }`}
          >
            Financing
          </Link>
          <Link
            href="/services"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-400'
            }`}
          >
            Services
          </Link>
          <Link
            href="/about"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-400'
            }`}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-400'
            }`}
          >
            Contact
          </Link>
          <button 
            onClick={handleLocationClick}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-lg"
          >
            Dealership Location
          </button>
        </div>
      </motion.div>
    </motion.nav>
  )
}

export default Navbar 