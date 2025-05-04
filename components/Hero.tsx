'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/vehicles?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLocationClick = () => {
    // Check if the user is on iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      window.location.href = 'maps://maps.apple.com/?q=Doski+Motors+San+Diego'
    }
    // Check if the user is on Android
    else if (/Android/.test(navigator.userAgent)) {
      window.location.href = 'geo:0,0?q=Doski+Motors+San+Diego'
    }
    // Default to web version
    else {
      window.open('https://www.google.com/maps/search/Doski+Motors+San+Diego', '_blank')
    }
  }

  const scrollToTestimonials = () => {
    const testimonialsSection = document.getElementById('testimonials');
    if (testimonialsSection) {
      testimonialsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Simple video setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Make sure video is properly set up
    video.muted = true;
    video.playbackRate = 0.8; // Slightly slowed playback for better effect
    
    // Play the video
    video.play().catch(e => console.error("Video playback error:", e));
    
    return () => {
      video.pause();
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background video with enhanced overlay effects */}
      <div className="absolute inset-0 z-0">
        {/* Dynamic color overlay with multiple layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80 z-10" />
        
        {/* Logo highlight effect */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-900/10 to-transparent z-10"></div>
        
        {/* Spotlight effect for logo that fades out */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-64 z-20 pointer-events-none"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2, duration: 3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 via-blue-400/5 to-transparent"></div>
          <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-64 h-16 bg-white/10 blur-[50px] rounded-full"></div>
        </motion.div>
        
        {/* Dynamic animated accents */}
        <div className="absolute inset-0 z-5">
          {/* Pulsing blue accent in top left */}
          <motion.div 
            className="absolute top-10 left-20 w-96 h-96 rounded-full bg-blue-600/20 blur-[100px]"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          {/* Animated accent in bottom right */}
          <motion.div 
            className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-400/15 blur-[120px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />

          {/* Additional accent for dramatic effect */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full bg-blue-800/10 blur-[150px]"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>

        {/* Light streaks overlay for dynamic movement */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay z-5">
          <motion.div 
            className="absolute top-0 left-0 right-0 h-screen bg-[linear-gradient(115deg,transparent_0%,transparent_40%,rgba(255,255,255,0.4)_45%,transparent_50%,transparent_100%)]"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="absolute inset-0 overflow-hidden">
          {/* Video with camera animation */}
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              repeatType: "reverse", 
              ease: "easeInOut" 
            }}
            className="h-full w-full"
          >
            <motion.video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover z-0"
              initial={{ objectPosition: 'center 0%' }} // Start focused on the top where the logo is
              animate={{ objectPosition: 'center 40%' }} // Smoothly pan down to show more of the car
              transition={{ 
                duration: 8,
                delay: 2, // Give time to see the logo clearly
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 4
              }}
              style={{ 
                willChange: 'transform, object-position',
                filter: 'brightness(1.2) contrast(1.1)',
              }}
            >
              <source src="/videos/vroomdoski2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </motion.video>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Content with Better Visual Hierarchy and Impact */}
      <div className="relative z-20 flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center rounded-full bg-blue-600/30 px-4 py-2 text-sm font-medium text-blue-100 ring-1 ring-inset ring-blue-400/50 mb-6 backdrop-blur-sm"
            >
              <span className="mr-2 h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
              Premium Auto Dealer
            </motion.span>
            <h1 
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ 
                textShadow: '0 2px 10px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.3)',
                position: 'relative',
                zIndex: 1
              }}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block"
              >
                Drive
              </motion.span>{" "}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-block"
              >
                Your
              </motion.span>{" "}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="inline-block relative"
              >
                <span className="relative z-10">Dream</span>
                <motion.span 
                  className="absolute bottom-0 left-0 w-full h-[8px] bg-blue-500/70 -z-10 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                ></motion.span>
              </motion.span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mx-auto mt-4 max-w-xl text-lg md:text-xl lg:text-2xl text-gray-200 font-medium px-4"
            style={{ 
              textShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            Premium Vehicles. Exceptional Service. Unforgettable Experience.
          </motion.p>
          
          {/* Improved mobile-responsive search form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-8 w-full max-w-md mx-auto px-4 sm:px-0"
          >
            <form onSubmit={handleSearch} className="flex w-full">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search for vehicles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-l-lg border-0 py-3 px-4 text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center rounded-r-lg bg-blue-600 px-4 py-3 text-white shadow-lg hover:bg-blue-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
          </motion.div>
          
          {/* Action buttons with improved mobile responsiveness */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-8 space-y-4 sm:space-y-0 sm:flex sm:space-x-4 justify-center px-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link 
                href="/vehicles" 
                className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
              >
                <span>See All Vehicles</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <motion.span 
                className="absolute inset-0 -z-10 blur-xl bg-blue-600/40"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 flex justify-center gap-12 sm:gap-16"
          >
            <div className="text-center group cursor-pointer hover:scale-105 transition-transform">
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
            <div 
              onClick={scrollToTestimonials}
              className="text-center group cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="mb-2 relative">
                <h3 className="text-4xl font-bold text-white group-hover:text-blue-400 transition-colors">4.7</h3>
                <motion.div
                  className="absolute -inset-1 bg-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />
              </div>
              <p className="text-gray-300 font-medium">Google Rating</p>
            </div>
            <div className="text-center group cursor-pointer hover:scale-105 transition-transform">
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
            className="mt-12 flex flex-wrap justify-center items-center gap-6 sm:gap-8"
          >
            <div 
              onClick={() => window.open('https://www.bbb.org/', '_blank')}
              className="group flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/20"
            >
              <svg
                className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">BBB Accredited</span>
                <span className="text-xs text-gray-300 group-hover:text-gray-200">A+ Rating</span>
              </div>
            </div>

            <div 
              onClick={scrollToTestimonials}
              className="group flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/20"
            >
              <svg
                className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L14.4 9.6H22L16 14.4L18.4 22L12 17.2L5.6 22L8 14.4L2 9.6H9.6L12 2Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">Google Rating</span>
                <span className="text-xs text-gray-300 group-hover:text-gray-200">4.7/5</span>
              </div>
            </div>

            <div 
              onClick={() => window.open('https://www.dmv.ca.gov/portal/', '_blank')}
              className="group flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/20"
            >
              <svg
                className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12L11 14L15 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">Licensed Dealer</span>
                <span className="text-xs text-gray-300 group-hover:text-gray-200">CA DMV Verified</span>
              </div>
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