'use client'

import Link from 'next/link'
import { FaFacebookF, FaInstagram } from 'react-icons/fa'
import Logo from './Logo'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const Footer = () => {
  const footerRef = useRef(null)
  const isInView = useInView(footerRef, { once: true, amount: 0.3 })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  }

  // Logo animation variants
  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
        duration: 0.7,
        ease: "easeOut"
      } 
    }
  }

  return (
    <footer ref={footerRef} className="bg-gray-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 0.03, scale: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-64 -right-64 w-96 h-96 rounded-full bg-blue-500 blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 0.03, scale: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          className="absolute -bottom-64 -left-64 w-96 h-96 rounded-full bg-blue-400 blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div 
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {/* Logo and Description */}
          <motion.div 
            variants={item}
            className="col-span-1 md:col-span-2"
          >
            <motion.div
              variants={logoVariants}
              initial="initial"
              animate={isInView ? "animate" : "initial"}
            >
              <Logo size="extra-large" className="mb-4" />
            </motion.div>
            <motion.p 
              variants={item}
              className="text-gray-400 mt-4 max-w-md"
            >
              Your premier destination for luxury and performance Tesla vehicles. We pride ourselves on exceptional service and unbeatable deals.
            </motion.p>
            <motion.div 
              variants={container}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              className="flex space-x-4 mt-6"
            >
              <motion.a
                variants={item}
                whileHover={{ scale: 1.2, color: "#4267B2" }}
                href="https://www.facebook.com/DoskiMotors/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors"
              >
                <FaFacebookF size={24} />
              </motion.a>
              <motion.a
                variants={item}
                whileHover={{ scale: 1.2, color: "#E1306C" }}
                href="https://www.instagram.com/doskimotors/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors"
              >
                <FaInstagram size={24} />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={item}>
            <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-200">Quick Links</h3>
            <motion.ul 
              variants={container}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              className="space-y-2"
            >
              <motion.li variants={item}>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors hover:pl-1">
                  Home
                </Link>
              </motion.li>
              <motion.li variants={item}>
                <Link href="/vehicles" className="text-gray-400 hover:text-white transition-colors hover:pl-1">
                  Vehicles
                </Link>
              </motion.li>
              <motion.li variants={item}>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors hover:pl-1">
                  Services
                </Link>
              </motion.li>
              <motion.li variants={item}>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors hover:pl-1">
                  Contact
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={item}>
            <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-200">Contact Us</h3>
            <motion.address 
              variants={container}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              className="not-italic"
            >
              <motion.p variants={item} className="text-gray-400">7490 Opportunity Rd STE 2900</motion.p>
              <motion.p variants={item} className="text-gray-400">San Diego, CA 92111</motion.p>
              <motion.a
                variants={item}
                whileHover={{ color: "#fff", x: 2 }}
                href="tel:+16197843791"
                className="text-gray-400 transition-all block mt-2"
              >
                (619) 784-3791
              </motion.a>
            </motion.address>
            <motion.div variants={item}>
              <Link href="/dealer-login">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#3B82F6" }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Dealer Sign In
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="text-gray-400 text-sm"
            >
              © {new Date().getFullYear()} <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-200">Doski Motors</span>. All rights reserved.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="mt-4 md:mt-0"
            >
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <span className="mx-2 text-gray-600">|</span>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer 