'use client'

import { FiLogOut } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { deleteCookie } from 'cookies-next'

interface LogoutButtonProps {
  className?: string
}

export default function LogoutButton({ className = '' }: LogoutButtonProps) {
  const router = useRouter()

  const handleLogout = () => {
    // Delete the auth token
    deleteCookie('auth_token')
    
    // Redirect to login page
    router.push('/dealer-login')
  }

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center text-gray-500 hover:text-red-500 transition-colors ${className}`}
    >
      <FiLogOut className="mr-2" />
      Logout
    </button>
  )
} 