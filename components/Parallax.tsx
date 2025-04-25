'use client'

import { 
  useScroll, 
  useTransform, 
  motion, 
  MotionValue, 
  useMotionValue,
  useSpring as useFramerSpring,
  useAnimationFrame as useFramerAnimationFrame
} from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'

interface ParallaxProps {
  children?: React.ReactNode
  baseVelocity?: number
  image?: string
  className?: string
}

export function ParallaxSection({ children, image, className = "" }: ParallaxProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0])

  return (
    <motion.div
      ref={ref}
      className={`relative min-h-screen overflow-hidden ${className}`}
    >
      {image && (
        <motion.div 
          style={{ y }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={image}
            alt="Parallax background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
      )}
      <motion.div 
        style={{ opacity }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export function ParallaxText({ children, baseVelocity = 3 }: ParallaxProps) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const [velocity, setVelocity] = useState(0)
  
  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setVelocity(latest)
    })
  }, [scrollY])

  const smoothVelocity = useFramerSpring(velocity, {
    damping: 50,
    stiffness: 400
  })

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`)
  const directionFactor = useRef<number>(1)

  useFramerAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)

    if (typeof smoothVelocity === 'number' && smoothVelocity < 0) {
      directionFactor.current = -1
    } else if (typeof smoothVelocity === 'number' && smoothVelocity > 0) {
      directionFactor.current = 1
    }

    moveBy += directionFactor.current * moveBy * (typeof smoothVelocity === 'number' ? smoothVelocity : 0)
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className="parallax">
      <motion.div className="scroller" style={{ x }}>
        <span>{children}</span>
        <span>{children}</span>
        <span>{children}</span>
        <span>{children}</span>
      </motion.div>
    </div>
  )
}

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
} 