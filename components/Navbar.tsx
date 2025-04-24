import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600';
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <div className="relative w-32 h-8">
              <Image
                src="/doski-logo.png"
                alt="Doski Motors Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link href="/" className={`${isActive('/')} transition-colors duration-200`}>
              Home
            </Link>
            <Link href="/about" className={`${isActive('/about')} transition-colors duration-200`}>
              About
            </Link>
            <Link href="/services" className={`${isActive('/services')} transition-colors duration-200`}>
              Services
            </Link>
            <Link href="/contact" className={`${isActive('/contact')} transition-colors duration-200`}>
              Contact
            </Link>
            <Link href="/admin" className={`${isActive('/admin')} transition-colors duration-200`}>
              Admin
            </Link>
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} transition-all duration-200 ease-in-out`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          <Link 
            href="/" 
            className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            href="/services" 
            className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Services
          </Link>
          <Link 
            href="/contact" 
            className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <Link 
            href="/admin" 
            className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
} 