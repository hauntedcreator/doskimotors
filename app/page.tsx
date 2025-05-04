'use client'

import Hero from '@/components/Hero'
import Reviews from '@/components/Reviews'
import Footer from '@/components/Footer'
import FeaturedVehicles from '@/components/FeaturedVehicles'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

export default function Home() {
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  })
  
  const smoothYProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  const opacity = useTransform(smoothYProgress, [0, 0.2], [0, 1])
  const scale = useTransform(smoothYProgress, [0, 0.2], [0.95, 1])
  const y = useTransform(smoothYProgress, [0, 0.2], [50, 0])
  
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if (!isMounted) {
    return (
      <main className="min-h-screen bg-white">
        <Hero />
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden border-none">
          <div className="mx-auto max-w-7xl">
            <FeaturedVehicles />
          </div>
        </section>
        <Reviews />
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white" ref={scrollRef}>
      <Hero />
      
      {/* Remove all background styling and use pure white */}
      <motion.div 
        className="relative overflow-hidden bg-white"
        style={{ opacity, y }}
      >
        <motion.section
          className="py-16 px-4 sm:px-6 lg:px-8 relative"
          style={{ scale }}
        >
          <div className="mx-auto max-w-7xl">
            <FeaturedVehicles />
          </div>
        </motion.section>
      </motion.div>
      
      {/* Completely remove any divider elements between sections */}
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white"
      >
        <Reviews />
      </motion.div>
      
      <Footer />
    </main>
  )
} 