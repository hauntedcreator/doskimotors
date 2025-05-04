import React, { memo } from 'react'

interface LogoProps {
  className?: string
  textColor?: string
  size?: 'small' | 'medium' | 'large' | 'extra-large'
}

// Use memo to prevent unnecessary re-renders
const Logo = memo(({ className = '', textColor = 'white', size = 'medium' }: LogoProps) => {
  // Consistent text size classes that won't change based on color
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-3xl',
    large: 'text-4xl',
    'extra-large': 'text-5xl'
  }

  // Fixed dimensions for consistent logo sizing
  const dimensions = {
    small: { width: 45, height: 30 },
    medium: { width: 70, height: 45 },
    large: { width: 90, height: 60 },
    'extra-large': { width: 120, height: 80 }
  };
  
  // Ensure SVGs have consistent dimensions and positioning
  const logoSrc = textColor === 'white' 
    ? "/images/Logos/white.svg" 
    : "/images/Logos/black.svg";

  return (
    <div className={`flex items-center ${className}`}>
      {/* Fixed dimensions for consistent sizing */}
      <img 
        src={logoSrc}
        alt="Doski Motors Logo"
        width={dimensions[size].width}
        height={dimensions[size].height}
        style={{ 
          width: `${dimensions[size].width}px`,
          height: `${dimensions[size].height}px`,
          marginRight: '-12px', // Consistent margin
        }}
        className="object-contain"
        loading="eager"
        fetchPriority="high"
      />

      <div className="relative pl-2">
        <span className={`font-bold ${sizeClasses[size]} ${textColor === 'white' ? 'text-white' : 'text-gray-900'} tracking-tight`}>
          DOSKI
        </span>
        <span className={`ml-2 uppercase tracking-wider ${size === 'extra-large' ? 'text-xl' : size === 'large' ? 'text-base' : 'text-sm'} ${textColor === 'white' ? 'text-gray-300' : 'text-gray-600'}`}>
          MOTORS
        </span>
      </div>
    </div>
  )
})

// Add display name for debugging
Logo.displayName = 'Logo';

export default Logo 