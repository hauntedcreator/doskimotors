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
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
    'extra-large': 'text-4xl'
  }

  // Fixed dimensions for consistent logo sizing
  const dimensions = {
    small: { width: 32, height: 22 },
    medium: { width: 60, height: 40 },
    large: { width: 75, height: 50 },
    'extra-large': { width: 90, height: 60 }
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
          marginRight: '-8px', // Reduced margin
        }}
        className="object-contain"
        loading="eager"
        fetchPriority="high"
      />

      <div className="relative pl-1">
        <span className={`font-bold ${sizeClasses[size]} ${textColor === 'white' ? 'text-white' : 'text-gray-900'} tracking-tight`}>
          DOSKI
        </span>
        <span className={`ml-1 uppercase tracking-wider ${size === 'extra-large' ? 'text-base' : size === 'large' ? 'text-sm' : 'text-xs'} ${textColor === 'white' ? 'text-gray-300' : 'text-gray-600'}`}>
          MOTORS
        </span>
      </div>
    </div>
  )
})

// Add display name for debugging
Logo.displayName = 'Logo';

export default Logo 