'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'
import Link from 'next/link'
import PageLoader from '@/components/PageLoader'
import Head from 'next/head'
import { delayLoadResources, registerPageLoad, useRouteChangeHandler } from '../simplify-services'
import { useEffect } from 'react'

// Add export const dynamic = 'force-static' to optimize page load
export const dynamic = 'force-static';

export default function AboutPage() {
  // Simplified animation variants
  const simpleVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  // Register page load metrics and force reload for problematic routes
  useEffect(() => {
    const completeLoad = registerPageLoad('About');
    useRouteChangeHandler();
    
    return () => {
      completeLoad();
    };
  }, []);
  
  // Defer loading of non-critical resources
  useEffect(() => {
    const cleanup = delayLoadResources(() => {
      // Initialize any heavier components or fetch data here
      console.log('About page - deferred resources loaded');
    });
    
    return cleanup;
  }, []);

  return (
    <PageLoader>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        {/* Hero Section with Gradient Animation */}
        <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
          {/* Gradient Background with Animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-blue-900">
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.15] z-0"></div>
            <motion.div 
              className="absolute -inset-[10px] opacity-40 z-0"
              animate={{ 
                background: [
                  'radial-gradient(circle at 25% 100%, rgba(20, 30, 100, 0.5) 0%, rgba(0, 0, 0, 0) 50%)',
                  'radial-gradient(circle at 80% 50%, rgba(20, 30, 100, 0.5) 0%, rgba(0, 0, 0, 0) 50%)',
                  'radial-gradient(circle at 25% 10%, rgba(20, 30, 100, 0.5) 0%, rgba(0, 0, 0, 0) 50%)',
                  'radial-gradient(circle at 50% 50%, rgba(20, 30, 100, 0.5) 0%, rgba(0, 0, 0, 0) 50%)',
                  'radial-gradient(circle at 25% 100%, rgba(20, 30, 100, 0.5) 0%, rgba(0, 0, 0, 0) 50%)',
                ]
              }}
              transition={{ 
                duration: 15,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            ></motion.div>
          </div>
          
          <div className="relative z-10 text-center py-24 px-4 w-full">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
            >
              About Doski Motors
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col items-center gap-6"
            >
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Elevating the luxury vehicle experience for over a decade
              </p>
              <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            </motion.div>
          </div>
        </section>
        <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto py-12">
            {/* Our Vision Section - simplified animations */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={simpleVariants}
              transition={{ duration: 0.5 }}
              className="mb-16 text-center relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 -mt-10 flex items-center justify-center">
                <div className="absolute w-20 h-20 bg-blue-50 rounded-full"></div>
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                  className="relative z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </motion.div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6 pt-12">Our Vision</h2>
              <div className="relative">
                <motion.div 
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="absolute h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full max-w-4xl mx-auto left-0 right-0 -bottom-3"
                  style={{ marginLeft: 'auto', marginRight: 'auto' }}
                ></motion.div>
              </div>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mt-10"
              >
                At Doski Motors, we believe that finding your perfect vehicle should be an experience as premium as the car itself. We're driven by a passion to connect discerning drivers with exceptional vehicles that reflect their unique style and ambition.
              </motion.p>
            </motion.div>

            {/* Key Benefits Section with Cards */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={simpleVariants}
              transition={{ duration: 0.5 }}
              className="mb-20"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Benefits</h2>
                <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto"></div>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={simpleVariants}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 mx-auto">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                        </svg>
                      </motion.div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">3-Month Warranty</h3>
                    <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 text-center">
                      Every vehicle comes with our premium 3-month/3,000-mile dealer warranty, ensuring your confidence and peace of mind with every purchase.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={simpleVariants}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 mx-auto">
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, 0, -10, 0],
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
                        </svg>
                      </motion.div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">EV Tax Incentives</h3>
                    <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-green-500 to-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 text-center">
                      We offer specialized EV tax incentive discounts for most electric vehicles, making luxury sustainable transportation more accessible.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={simpleVariants}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-8">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-6 mx-auto">
                      <motion.div
                        animate={{ 
                          scale: [1, 0.9, 1.1, 1],
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                      </motion.div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">10+ Years of Excellence</h3>
                    <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 text-center">
                      With over a decade of experience in the luxury automotive market, we've built our reputation on trust, expertise, and uncompromising quality.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* The Doski Difference Section */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={simpleVariants}
              className="mb-20"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl shadow-xl">
                {/* Background animated elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div 
                    className="absolute -inset-[10px] bg-[url('/noise.svg')] opacity-[0.15]"
                    animate={{ 
                      backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{ 
                      duration: 20,
                      repeat: Infinity,
                      repeatType: "mirror"
                    }}
                  ></motion.div>
                  
                  {/* Animated circular gradients */}
                  <motion.div 
                    className="absolute top-0 left-0 w-64 h-64 rounded-full bg-blue-500 opacity-20 blur-3xl"
                    animate={{
                      x: [0, 50, 0],
                      y: [0, 30, 0],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      repeatType: "mirror",
                    }}
                  ></motion.div>
                  
                  <motion.div 
                    className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-purple-500 opacity-20 blur-3xl"
                    animate={{
                      x: [0, -50, 0],
                      y: [0, -30, 0],
                    }}
                    transition={{
                      duration: 18,
                      repeat: Infinity,
                      repeatType: "mirror",
                    }}
                  ></motion.div>
                </div>
                
                <div className="relative z-10 p-12">
                  <div className="text-center mb-12">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.7 }}
                      viewport={{ once: true }}
                      className="mb-6"
                    >
                      <div className="mx-auto w-28 h-28 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h2 className="text-4xl font-bold text-white mb-3">The Doski Difference</h2>
                      <p className="text-blue-200 max-w-2xl mx-auto">
                        Experience luxury vehicle shopping reimagined through our commitment to excellence
                      </p>
                    </motion.div>
                    <div className="h-[2px] w-36 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mb-10"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={simpleVariants}
                    >
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-white">Premium Inventory</h3>
                        </div>
                        <p className="text-blue-100 ml-14">
                          Every vehicle in our collection is hand-selected for its exceptional quality, performance, and value. We specialize in luxury and performance vehicles that stand the test of time.
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-white">Transparent Financing</h3>
                        </div>
                        <p className="text-blue-100 ml-14">
                          Our financing experts work with multiple lenders to secure the most competitive rates and terms tailored to your financial situation, making luxury accessible.
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-white">Personalized Service</h3>
                        </div>
                        <p className="text-blue-100 ml-14">
                          We take the time to understand your needs and preferences, providing a bespoke car buying experience that respects your time and exceeds your expectations.
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-white">Ongoing Support</h3>
                        </div>
                        <p className="text-blue-100 ml-14">
                          Our relationship doesn't end when you drive off the lot. We're committed to ensuring your continued satisfaction through exceptional after-sales support.
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={simpleVariants}
              className="text-center"
            >
              <div className="bg-white rounded-2xl shadow-xl p-10 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    <defs>
                      <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#pattern)" />
                  </svg>
                </div>
                
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Experience the Doski Motors Difference</h3>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                    Don't just take our word for it. See what our customers have to say about their experience with Doski Motors.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block"
                  >
                    <Link 
                      href="https://www.google.com/search?q=Doski+Motors+reviews" 
                      target="_blank"
                      className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Read Our Customer Reviews
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </PageLoader>
  )
} 