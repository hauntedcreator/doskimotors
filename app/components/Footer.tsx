'use client'

import Link from 'next/link'
import { FaFacebookF, FaInstagram } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Logo from '@/components/Logo'
import { memo } from 'react'

// Use memo to prevent unnecessary re-renders
const Footer = memo(function Footer() {
  const socialLinks = {
    facebook: 'https://www.facebook.com/doskimotors',
    instagram: 'https://www.instagram.com/doskimotors'
  }

  return (
    <footer className="bg-[#16181F] text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo and Social Links */}
          <div>
            <div className="flex items-center mb-6">
              <Logo textColor="white" size="large" />
            </div>
            <p className="text-gray-400 mb-8 leading-relaxed max-w-md">
              Your premier destination for luxury and performance vehicles. We pride ourselves on exceptional service and unbeatable deals.
            </p>
            <div className="flex space-x-4">
              <a 
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow us on Facebook"
              >
                <FaFacebookF size={24} />
              </a>
              <a 
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Quick Links</h2>
            <nav className="flex flex-col space-y-3">
              <Link href="/" prefetch={false} className="text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/about" prefetch={false} className="text-gray-400 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/services" prefetch={false} className="text-gray-400 hover:text-white transition-colors">
                Services
              </Link>
              <Link href="/contact" prefetch={false} className="text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Contact Info</h2>
            <div className="space-y-3 text-gray-400">
              <p>7490 Opportunity Rd STE 2900</p>
              <p>San Diego, CA 92111</p>
              <p>(619) 784-3791</p>
              <Link 
                href="/dealer-login"
                prefetch={false}
                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Dealer Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Simple Effect */}
        <div className="relative mt-16 pt-8">
          {/* Simplified Effect */}
          <div className="absolute inset-x-0 top-0 flex justify-center">
            <div className="absolute -top-4 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60"></div>
          </div>
          
          <div className="border-t border-gray-800 flex flex-col md:flex-row justify-between items-center pt-8">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Doski Motors. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" prefetch={false} className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/terms" prefetch={false} className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
})

export default Footer 