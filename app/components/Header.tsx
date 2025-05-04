'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/Logo'
import { memo } from 'react'

// Use memo to prevent unnecessary re-renders
const Header = memo(function Header() {
  const pathname = usePathname()

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
          
          <div className="flex items-center space-x-8">
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
            <Link
              href="https://www.google.com/maps/place/7490+Opportunity+Rd+STE+2900,+San+Diego,+CA+92111"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Dealership Location
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
})

export default Header 