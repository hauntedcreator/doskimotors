'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageCarouselProps {
  images: string[]
  alt: string
  priority?: boolean
}

export default function ImageCarousel({ 
  images, 
  alt,
  priority = false
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const imageList = images?.length > 0 ? images : [images[0]]
  const hasMultipleImages = imageList.length > 1

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (hasMultipleImages) {
      setCurrentIndex((prev) => (prev + 1) % imageList.length)
    }
  }

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (hasMultipleImages) {
      setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length)
    }
  }

  return (
    <div className="relative w-full h-full group">
      <Image
        src={imageList[currentIndex]}
        alt={`${alt} - Image ${currentIndex + 1}`}
        fill
        className="object-cover transition-all duration-300"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
      />
      
      {/* Always show arrows, but gray them out if there's only one image */}
      <button
        onClick={goToPrev}
        className={`absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 transition-all duration-200 z-20 ${
          hasMultipleImages 
            ? 'bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 cursor-pointer'
            : 'bg-black/20 text-white/50 cursor-not-allowed opacity-50'
        }`}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 transition-all duration-200 z-20 ${
          hasMultipleImages 
            ? 'bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 cursor-pointer'
            : 'bg-black/20 text-white/50 cursor-not-allowed opacity-50'
        }`}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Image Counter */}
      {hasMultipleImages && (
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20">
          {currentIndex + 1} / {imageList.length}
        </div>
      )}
    </div>
  )
} 