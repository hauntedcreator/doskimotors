'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from './LogoutButton'
import { FiUser } from 'react-icons/fi'

export default function DashboardHeader() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              href="/"
              className="flex items-center px-2 py-2"
            >
              <span className="text-2xl font-bold">DOSKI</span>
              <span className="text-2xl font-light ml-2">MOTORS</span>
            </Link>
            <div className="ml-4 flex items-center">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                Dealer Dashboard
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              <FiUser className="text-blue-600" size={16} />
              <span className="text-sm font-medium">Admin</span>
            </div>
            <LogoutButton className="px-3 py-1 rounded-full hover:bg-gray-100" />
          </div>
        </div>
      </nav>
    </header>
  )
} 