'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import { setCookie } from 'cookies-next';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaUserShield, FaLock } from 'react-icons/fa';

// SearchParams Component
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get('redirect') || '/dealer-dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simple login check for demo purposes
    if (email === 'admin' && password === 'admin') {
      // Set authentication cookie (would normally be a JWT from server)
      setCookie('auth_token', 'demo_auth_token_' + Date.now(), {
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
      
      router.push(redirectPath);
    } else {
      setError('Invalid credentials. Use admin/admin for demo.');
      setIsLoading(false);
    }
  };

  return (
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
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function DealerLogin() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-lg">Loading...</p></div>}>
      <LoginContent />
    </Suspense>
  );
}
