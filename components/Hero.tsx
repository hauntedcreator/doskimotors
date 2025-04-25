'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background with gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('/images/hero-bg.jpg')"
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Discover Your Dream Car
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl text-xl text-gray-300 sm:text-2xl"
          >
            Experience luxury and performance like never before
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
          >
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by brand or model..."
                className="w-full px-6 py-4 text-lg rounded-lg text-gray-900 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <motion.span 
                className="absolute inset-0 -z-10 bg-blue-500/20 rounded-lg blur-xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.3, 0.5] 
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </div>
            <button className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md">
              Search Now
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 flex justify-center gap-8"
          >
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white">500+</h3>
              <p className="text-gray-300">Vehicles</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white">24/7</h3>
              <p className="text-gray-300">Support</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white">100%</h3>
              <p className="text-gray-300">Satisfaction</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center">
          <span className="text-white text-sm mb-2">Scroll to explore</span>
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="h-6 w-4 rounded-full border-2 border-white p-1"
          >
            <div className="h-1 w-1 rounded-full bg-white" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Hero 