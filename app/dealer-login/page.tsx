'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import Logo from '@/components/Logo'
import { useRouter, useSearchParams } from 'next/navigation'
import { setCookie } from 'cookies-next'
import Link from 'next/link'
import { FaUserShield, FaLock } from 'react-icons/fa'
import { signIn } from '@/app/lib/authService'
import Header from '../components/Header'
import Footer from '../components/Footer'

// Search params component
function LoginFormWithParams({ children }) {
  const searchParams = useSearchParams()
  return <>{children}</>
}

export default function DealerLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [redirectPath, setRedirectPath] = useState('/dealer-dashboard')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const result = await signIn(email, password)
      
      if (result.success) {
        // Set authentication cookie (would normally be a JWT from server)
        setCookie('auth_token', 'demo_auth_token_' + Date.now(), {
          maxAge: 3600, // 1 hour
          path: '/',
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        })
        
        // Redirect to the intended destination
        router.push(redirectPath)
      } else {
        setError(result.message || 'Invalid credentials')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormWithParams>
        <div className="min-h-screen flex flex-col items-center justify-center relative">
          {/* Luxury background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.5),rgba(0,0,0,0.7))]"></div>
            <div className="absolute inset-0 bg-[url('/dealer-login-bg.jpg')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-black/30"></div>
          </div>
          
          {/* Back to home link */}
          <Link 
            href="/" 
            className="absolute top-8 left-8 text-white hover:text-blue-300 transition-colors z-10 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Website
          </Link>
          
          <div className="z-10 w-full max-w-md relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8"
            >
              <div className="flex justify-center">
                <Logo size="large" textColor="white" />
              </div>
              <h2 className="mt-6 text-4xl font-bold text-white">
                Dealer Portal
              </h2>
              <p className="mt-2 text-lg text-blue-200">Secure access for authorized personnel</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-white/10"
            >
              <div className="p-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <div className="rounded-md bg-red-900/60 p-4 border border-red-500/50">
                      <div className="text-sm text-red-200">{error}</div>
                    </div>
                  )}
                  
                  {redirectPath !== '/dealer-dashboard' && (
                    <div className="rounded-md bg-blue-900/60 p-4 border border-blue-500/50">
                      <div className="text-sm text-blue-200">
                        You need to sign in to access the requested page. You'll be redirected after login.
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-1">
                      Username
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUserShield className="h-5 w-5 text-blue-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 py-3 bg-gray-900/50 text-white border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter username"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-1">
                      Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-blue-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 py-3 bg-gray-900/50 text-white border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter password"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 bg-gray-800 border-gray-600 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-blue-200">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  <div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading}
                      className="w-full flex justify-center py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium rounded-md shadow-lg hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-70"
                    >
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      {/* Luxury background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.5),rgba(0,0,0,0.7))]"></div>
        <div className="absolute inset-0 bg-[url('/dealer-login-bg.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-black/30"></div>
      </div>
      
      {/* Back to home link */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 text-white hover:text-blue-300 transition-colors z-10 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Website
      </Link>
      
      <div className="z-10 w-full max-w-md relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center">
            <Logo size="large" textColor="white" />
          </div>
          <h2 className="mt-6 text-4xl font-bold text-white">
            Dealer Portal
          </h2>
          <p className="mt-2 text-lg text-blue-200">Secure access for authorized personnel</p>
        </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-white/10"
      >
          <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
                <div className="rounded-md bg-red-900/60 p-4 border border-red-500/50">
                  <div className="text-sm text-red-200">{error}</div>
                </div>
              )}
              
              {redirectPath !== '/dealer-dashboard' && (
                <div className="rounded-md bg-blue-900/60 p-4 border border-blue-500/50">
                  <div className="text-sm text-blue-200">
                    You need to sign in to access the requested page. You'll be redirected after login.
                  </div>
              </div>
            )}
              
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-1">
                Username
              </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserShield className="h-5 w-5 text-blue-400" />
                  </div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 py-3 bg-gray-900/50 text-white border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter username"
                />
              </div>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-1">
                Password
              </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-blue-400" />
                  </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 py-3 bg-gray-900/50 text-white border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                    className="h-4 w-4 bg-gray-800 border-gray-600 rounded text-blue-600 focus:ring-blue-500"
                />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-blue-200">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                  <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                    Forgot password?
                </a>
              </div>
            </div>

            <div>
                <motion.button
                type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium rounded-md shadow-lg hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black/30 text-gray-400">Need help?</span>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
                <a href="tel:+16197843791" className="font-medium text-blue-400 hover:text-blue-300">
                Contact support at (619) 784-3791
              </a>
            </div>
          </div>
        </div>
      </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 text-center text-gray-400 text-sm"
        >
          &copy; {new Date().getFullYear()} Doski Motors. All rights reserved.
        </motion.div>
      </div>
    </div>
  )
} 