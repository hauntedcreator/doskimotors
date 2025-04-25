import React from 'react'

interface LogoProps {
  className?: string
  textColor?: string
  size?: 'small' | 'medium' | 'large'
}

const Logo = ({ className = '', textColor = 'white', size = 'medium' }: LogoProps) => {
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-3xl',
    large: 'text-4xl'
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <span className={`font-bold ${sizeClasses[size]} ${textColor === 'white' ? 'text-white' : 'text-gray-900'} tracking-tight`} style={{
          textShadow: textColor === 'white' ? '2px 2px 4px rgba(0, 0, 0, 0.5)' : 'none'
        }}>
          DOSKI
        </span>
        <span className={`ml-2 uppercase tracking-wider ${size === 'large' ? 'text-lg' : 'text-sm'} ${textColor === 'white' ? 'text-gray-300' : 'text-gray-600'}`} style={{
          textShadow: textColor === 'white' ? '1px 1px 2px rgba(0, 0, 0, 0.5)' : 'none'
        }}>
          MOTORS
        </span>
      </div>
    </div>
  )
}

export default Logo 