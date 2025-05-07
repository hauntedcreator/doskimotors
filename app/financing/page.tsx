'use client';

import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaInfoCircle, FaPhoneAlt } from 'react-icons/fa';
import PageLoader from '@/components/PageLoader';
import { delayLoadResources, registerPageLoad, useRouteChangeHandler } from '../simplify-services';

// Add static rendering to optimize page load
export const dynamic = 'force-static';

// Add segment config to optimize loading
export const runtime = 'edge';
export const preferredRegion = 'auto';
export const fetchCache = 'force-cache';

interface FinancingOption {
  name: string;
  description: string;
  benefits: string[];
  requirements?: string[];
  website: string;
  phone?: string;
  logo: string;
}

export default function FinancingPage() {
  // Simplified animation variants
  const simpleVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  // Register page load metrics and force reload for problematic routes
  useEffect(() => {
    const completeLoad = registerPageLoad('Financing');
    useRouteChangeHandler();
    
    return () => {
      completeLoad();
    };
  }, []);
  
  // Defer loading of non-critical resources
  useEffect(() => {
    const cleanup = delayLoadResources(() => {
      // Initialize any heavier components or fetch data here
      console.log('Financing page - deferred resources loaded');
      
      // Preload logos for financing options - more efficient approach
      if (typeof window !== 'undefined') {
        // Polyfill for requestIdleCallback
        const requestIdleCallbackPolyfill = 
          window.requestIdleCallback || 
          ((cb) => {
            const start = Date.now();
            return setTimeout(() => {
              cb({
                didTimeout: false,
                timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
              });
            }, 1);
          });
        
        requestIdleCallbackPolyfill(() => {
          financingOptions.forEach(option => {
            if (option.logo) {
              const link = document.createElement('link');
              link.rel = 'prefetch';
              link.as = 'image';
              link.href = option.logo;
              document.head.appendChild(link);
            }
          });
        });
      }
    }, 800); // Reduced delay time
    
    return cleanup;
  }, []);

  const financingOptions: FinancingOption[] = [
    {
      name: "San Diego County Credit Union (SDCCU)",
      description: "Local credit union offering competitive auto loan rates with flexible terms and membership benefits.",
      benefits: [
        "Competitive rates starting from 4.99% APR",
        "Terms up to 84 months",
        "No application fees",
        "Local San Diego presence with multiple branches",
        "Pre-approval available"
      ],
      requirements: [
        "Must be eligible for SDCCU membership",
        "Good credit score (usually 660+)",
        "Proof of income",
        "Valid CA driver's license"
      ],
      website: "https://www.sdccu.com/loans/auto-loan/",
      phone: "877-732-2848",
      logo: "/logos/sdccu.png"
    },
    {
      name: "Mission Federal Credit Union",
      description: "Another trusted local credit union serving San Diego County with great auto loan options.",
      benefits: [
        "Rates as low as 5.24% APR",
        "100% financing available",
        "No prepayment penalties",
        "Local auto buying service available",
        "Quick online application process"
      ],
      requirements: [
        "Mission Fed membership required",
        "Minimum credit score requirements vary",
        "Income verification",
        "San Diego County residency"
      ],
      website: "https://www.missionfed.com/auto-loans",
      phone: "800-500-6328",
      logo: "/logos/missionfed.png"
    },
    {
      name: "Bank of America - San Diego",
      description: "National bank with strong local presence offering auto loans with relationship benefits.",
      benefits: [
        "Preferred Rewards members get rate discounts",
        "Online pre-qualification available",
        "Flexible terms and payment options",
        "Large network of branches in San Diego"
      ],
      website: "https://www.bankofamerica.com/auto-loans/",
      phone: "844-892-6002",
      logo: "/logos/bofa.png"
    },
    {
      name: "LightStream",
      description: "Online lender offering unsecured auto loans with excellent rates for well-qualified buyers.",
      benefits: [
        "Fully online process",
        "No fees or prepayment penalties",
        "Same-day funding available",
        "Flexible use of funds",
        "Rate-beat program"
      ],
      website: "https://www.lightstream.com/auto-loans",
      logo: "/logos/lightstream.png"
    }
  ];

  const defaultLogo = "/images/logo.png";

  return (
    <PageLoader>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Skip link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white"
        >
          Skip to main content
        </a>
        
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
              transition={{ duration: 0.3 }}
              className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
              aria-label="Financing Options Page Heading"
            >
              Financing Options
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col items-center gap-6"
            >
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Flexible financing solutions tailored to your needs.
              </p>
              <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            </motion.div>
          </div>
        </section>
        <main id="main-content" className="flex-grow py-16 px-4 sm:px-6 lg:px-8 preload-fix">
          <div className="max-w-7xl mx-auto">
            <h2 className="sr-only">Financing Options Available</h2>
            {/* Financing Options */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
              initial="hidden"
              animate="visible"
              variants={simpleVariants}
            >
              {financingOptions.map((option, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-between transition-colors"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={simpleVariants}
                  transition={{ delay: index * 0.05 }}
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative h-14 w-14 bg-blue-50 rounded-full border-2 border-blue-100 overflow-hidden">
                        <img
                          src={option.logo || defaultLogo}
                          alt={option.name + ' logo'}
                          className="h-full w-full object-contain p-1"
                          onError={e => (e.currentTarget.src = defaultLogo)}
                          width={56}
                          height={56}
                          loading="lazy"
                        />
                      </div>
                      <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                        <FaInfoCircle className="text-blue-500" /> {option.name}
                      </h2>
                    </div>
                    <p className="text-gray-600 mb-4">{option.description}</p>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Benefits</h3>
                      <ul className="space-y-1">
                        {option.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center text-gray-700"><FaCheckCircle className="mr-2 text-green-400" /> {benefit}</li>
                        ))}
                      </ul>
                    </div>
                    {option.requirements && (
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2"><FaInfoCircle className="text-blue-400" /> Requirements</h3>
                        <ul className="space-y-1">
                          {option.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-center text-gray-600"><FaInfoCircle className="mr-2 text-blue-300" /> {req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 space-y-2">
                    <a
                      href={option.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center px-4 py-2 rounded-full shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
                      onClick={(e) => {
                        // Prevent the default action
                        e.preventDefault();
                        // Open the link in a new tab after a short delay
                        setTimeout(() => {
                          window.open(option.website, '_blank', 'noopener,noreferrer');
                        }, 50);
                      }}
                    >
                      Visit Website
                    </a>
                    {option.phone && (
                      <a
                        href={`tel:${option.phone.replace(/[-\s]/g, '')}`}
                        className="block w-full text-center px-4 py-2 rounded-full shadow-sm text-sm font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 transition flex items-center justify-center gap-2"
                      >
                        <FaPhoneAlt className="inline-block mr-1" /> Call {option.phone}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Tips Section - Simplified animation */}
            <motion.div
              className="bg-blue-50 rounded-2xl p-10 max-w-3xl mx-auto mb-16 shadow-md"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={simpleVariants}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2"><FaInfoCircle className="text-blue-500" /> Tips for Getting the Best Auto Loan</h2>
              <ul className="space-y-3">
                <li className="flex items-start"><span className="text-blue-600 mr-2">•</span><span className="text-gray-700">Check your credit score before applying and dispute any errors</span></li>
                <li className="flex items-start"><span className="text-blue-600 mr-2">•</span><span className="text-gray-700">Compare rates from multiple lenders to get the best deal</span></li>
                <li className="flex items-start"><span className="text-blue-600 mr-2">•</span><span className="text-gray-700">Consider getting pre-approved before shopping for your vehicle</span></li>
                <li className="flex items-start"><span className="text-blue-600 mr-2">•</span><span className="text-gray-700">Make a larger down payment to reduce monthly payments and interest costs</span></li>
                <li className="flex items-start"><span className="text-blue-600 mr-2">•</span><span className="text-gray-700">Read all loan terms carefully and ask questions about any unclear items</span></li>
              </ul>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </PageLoader>
  );
} 