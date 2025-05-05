'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/Logo'
import { memo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Use memo to prevent unnecessary re-renders
const Header = memo(function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              href="/"
              className="flex items-center px-2 py-2"
              prefetch={false} // Disable prefetching for better initial load
            >
              <Logo textColor="black" size="medium" />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/vehicles"
              prefetch={false}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                pathname === '/vehicles'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Vehicles
            </Link>
            <Link
              href="/financing"
              prefetch={false}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                pathname === '/financing'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Financing
            </Link>
            <Link
              href="/services"
              prefetch={false}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                pathname === '/services'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Services
            </Link>
            <Link
              href="/tesla-repairs"
              prefetch={false}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                pathname === '/tesla-repairs'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Tesla Repairs
            </Link>
            <Link
              href="/about"
              prefetch={false}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                pathname === '/about'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              prefetch={false}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                pathname === '/contact'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Contact
            </Link>
            <button
              onClick={handleLocationClick}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Dealership Location
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-blue-600"
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

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 shadow-lg bg-gray-900">
                <Link
                  href="/vehicles"
                  prefetch={false}
                  className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:text-blue-400 hover:bg-gray-800`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Vehicles
                </Link>
                <Link
                  href="/financing"
                  prefetch={false}
                  className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:text-blue-400 hover:bg-gray-800`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Financing
                </Link>
                <Link
                  href="/services"
                  prefetch={false}
                  className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:text-blue-400 hover:bg-gray-800`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="/tesla-repairs"
                  prefetch={false}
                  className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:text-blue-400 hover:bg-gray-800`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tesla Repairs
                </Link>
                <Link
                  href="/about"
                  prefetch={false}
                  className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:text-blue-400 hover:bg-gray-800`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  prefetch={false}
                  className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:text-blue-400 hover:bg-gray-800`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <button 
                  onClick={() => {
                    handleLocationClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-lg"
                >
                  Dealership Location
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
})

export default Header 