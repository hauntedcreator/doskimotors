'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isReversing, setIsReversing] = useState(false)
  const reverseIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = 1.0

    const handleVideoEnd = () => {
      if (!video || isReversing) return
      
      video.pause()
      setIsReversing(true)

      setTimeout(() => {
        if (!video) return

        const fps = 60
        const timeStep = (1 / fps) * video.playbackRate

        reverseIntervalRef.current = setInterval(() => {
          if (!video) return

          if (video.currentTime <= 0) {
            if (reverseIntervalRef.current) {
              clearInterval(reverseIntervalRef.current)
            }
            setIsReversing(false)
            video.currentTime = 0
            video.play()
          } else {
            video.currentTime = Math.max(0, video.currentTime - timeStep)
          }
        }, 1000 / fps)
      }, 500)
    }

    const cleanup = () => {
      if (reverseIntervalRef.current) {
        clearInterval(reverseIntervalRef.current)
      }
    }

    video.addEventListener('ended', handleVideoEnd)
    window.addEventListener('blur', cleanup)
    window.addEventListener('beforeunload', cleanup)

    return () => {
      cleanup()
      if (video) {
        video.removeEventListener('ended', handleVideoEnd)
      }
      window.removeEventListener('blur', cleanup)
      window.removeEventListener('beforeunload', cleanup)
    }
  }, [isReversing])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background video with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-10" />
        <div className="absolute inset-0 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover z-0 transform scale-[1.01]"
            style={{ willChange: 'transform' }}
          >
            <source src="/videos/backgroundtesladoski.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-flex items-center rounded-full bg-blue-600/10 px-4 py-1.5 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30 mb-6">
              Premium Auto Dealer
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Find Your Perfect Car
            </h1>
          </motion.div>
          
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
                className="w-full px-6 py-4 text-lg rounded-lg text-gray-900 bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-lg"
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
            <button className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg">
              Search Now
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 flex justify-center gap-12 sm:gap-16"
          >
            <div className="text-center group cursor-pointer">
              <div className="mb-2 relative">
                <h3 className="text-4xl font-bold text-white group-hover:text-blue-400 transition-colors">500+</h3>
                <motion.div
                  className="absolute -inset-1 bg-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <p className="text-gray-300 font-medium">Premium Vehicles</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="mb-2 relative">
                <h3 className="text-4xl font-bold text-white group-hover:text-blue-400 transition-colors">24/7</h3>
                <motion.div
                  className="absolute -inset-1 bg-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />
              </div>
              <p className="text-gray-300 font-medium">Expert Support</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="mb-2 relative">
                <h3 className="text-4xl font-bold text-white group-hover:text-blue-400 transition-colors">100%</h3>
                <motion.div
                  className="absolute -inset-1 bg-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                />
              </div>
              <p className="text-gray-300 font-medium">Satisfaction Rate</p>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-12 flex justify-center items-center gap-8"
          >
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
              <span className="text-sm font-medium text-white">BBB Accredited</span>
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
              <span className="text-sm font-medium text-white">5-Star Rated</span>
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
              <span className="text-sm font-medium text-white">Licensed Dealer</span>
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
          <span className="text-white text-sm mb-2 font-medium">Scroll to explore</span>
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