'use client';

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaInfoCircle, FaPhoneAlt, FaQuoteLeft } from 'react-icons/fa';
import Image from 'next/image';

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
      website: "https://www.sdccu.com/loans/vehicle-loans/auto-loans/",
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden bg-gradient animate-gradient">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#000000,#1a1a1a,#2d2d2d,#1a1a1a,#000000)] bg-[length:400%_400%] animate-gradient-slow">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.15)_0%,rgba(0,0,0,0)_70%)]"></div>
        </div>
        <div className="relative z-10 text-center py-24 px-4 w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
          >
            Financing Options
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Flexible financing solutions tailored to your needs.
            </p>
            <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          </motion.div>
        </div>
      </section>
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Financing Options */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15 }
              }
            }}
          >
            {financingOptions.map((option, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-between hover:scale-[1.025] hover:shadow-2xl transition-transform duration-300"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative group">
                      <img
                        src={option.logo || defaultLogo}
                        alt={option.name + ' logo'}
                        className="h-14 w-14 object-contain rounded-full border-2 border-blue-100 bg-blue-50 shadow group-hover:border-blue-400 transition duration-200"
                        onError={e => (e.currentTarget.src = defaultLogo)}
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

          {/* Tips Section */}
          <motion.div
            className="bg-blue-50 rounded-2xl p-10 max-w-3xl mx-auto mb-16 shadow-md"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
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
  );
} 