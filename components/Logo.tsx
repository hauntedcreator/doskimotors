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
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
    'extra-large': 'text-3xl'
  }

  // Fixed dimensions for consistent logo sizing
  const dimensions = {
    small: { width: 28, height: 18 },
    medium: { width: 45, height: 30 },
    large: { width: 60, height: 40 },
    'extra-large': { width: 75, height: 50 }
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
          marginRight: '-4px', // Reduced margin
        }}
        className="object-contain"
        loading="eager"
        fetchPriority="high"
      />

      <div className="relative pl-0">
        <span className={`font-bold ${sizeClasses[size]} ${textColor === 'white' ? 'text-white' : 'text-gray-900'} tracking-tight`}>
          DOSKI
        </span>
        <span className={`ml-1 uppercase tracking-wider ${size === 'extra-large' ? 'text-xs' : size === 'large' ? 'text-xs' : 'text-xs'} ${textColor === 'white' ? 'text-gray-300' : 'text-gray-600'}`}>
          MOTORS
        </span>
      </div>
    </div>
  )
})

// Add display name for debugging
Logo.displayName = 'Logo';

export default Logo 