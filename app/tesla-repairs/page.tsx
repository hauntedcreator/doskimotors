'use client'

import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import PageLoader from '@/components/PageLoader'
import { delayLoadResources, registerPageLoad, useRouteChangeHandler } from '../simplify-services'
import { FaTools, FaCar, FaCarBattery, FaClock, FaWrench, FaMapMarkerAlt, FaCheckCircle, FaMobile, FaTruck, FaPhoneAlt } from 'react-icons/fa'
import { GiElectric } from 'react-icons/gi'
import { toast } from 'react-hot-toast'

// Add export const dynamic = 'force-static' to optimize page load
export const dynamic = 'force-static'

interface RequestForm {
  name: string
  email: string
  phone: string
  issue: string
  model: string
  files: File[]
}

export default function TeslaRepairsPage() {
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestForm, setRequestForm] = useState<RequestForm>({
    name: '',
    email: '',
    phone: '',
    issue: '',
    model: '',
    files: []
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Simplified animation variants
  const simpleVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  // Register page load metrics
  useEffect(() => {
    const completeLoad = registerPageLoad('Tesla Repairs')
    useRouteChangeHandler()
    
    return () => {
      completeLoad()
    }
  }, [])
  
  // Defer loading of non-critical resources
  useEffect(() => {
    const cleanup = delayLoadResources(() => {
      console.log('Tesla Repairs page - deferred resources loaded')
    })
    
    return cleanup
  }, [])

  // Email sending helper
  async function sendEmail(data: { email: string; [key: string]: any }) {
    try {
      setIsLoading(true);
      // Add validation
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (!data.name?.trim()) {
        throw new Error('Please enter your name');
      }
      
      if (!data.model) {
        throw new Error('Please select your Tesla model');
      }
      
      // Don't validate issue field to allow empty submissions
      // if (!data.issue?.trim()) {
      //   throw new Error('Please describe the issue with your vehicle');
      // }
      
      // First save to leads database
      const leadData = {
        ...data,
        name: data.name || 'Tesla Repair Request',
        subject: `Tesla Repair Request - ${data.model}`,
        message: data.issue || 'General inquiry',
        source: 'tesla-repairs-page',
        date: new Date().toISOString()
      };

      // Submit to leads system
      const leadsResponse = await fetch('/api/leads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      
      if (!leadsResponse.ok) {
        const errorText = await leadsResponse.text();
        console.error('Leads API error:', errorText);
        throw new Error('Failed to save your request. Please try again.');
      }
      
      // Send email notification
      const emailResponse = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          subject: `Tesla Repair Request - ${data.model}`,
          message: `
Model: ${data.model}
Issue: ${data.issue || 'General inquiry'}
${data.files && data.files.length > 0 ? `Files: ${data.files.join(', ')}` : ''}
          `,
          source: 'tesla-repairs-page'
        })
      });
      
      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error('Email API error:', errorText);
        throw new Error('Failed to send email notification. Please try again.');
      }
      
      toast.success('Your service request has been sent successfully!');
      setFormSubmitted(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message. Please try again.';
      toast.error(errorMessage);
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  }

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
              Tesla Certified Repair Services
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col items-center gap-6"
            >
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Expert repairs and service for all Tesla models with industry-leading turnaround times.
              </p>
              <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            </motion.div>
          </div>
        </section>
        
        <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Introduction Section */}
            <motion.div
              className="mb-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                San Diego's Premier Tesla Service Provider
              </h2>
              <p className="text-lg text-gray-700 max-w-4xl mx-auto">
                When Tesla's own service center can't get you back on the road fast enough, our certified technicians are ready to help. We offer competitive rates, rapid response times, and expertise across all Tesla models.
              </p>

              <div className="mt-10">
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
                >
                  <FaWrench className="mr-2" /> Request Service
                </button>
              </div>
            </motion.div>

            {/* Mobile Service Highlight */}
            <motion.div 
              className="bg-blue-50 rounded-2xl p-8 mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                  <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden">
                    {/* Add video background here */}
                    <video 
                      className="absolute inset-0 w-full h-full object-cover z-0"
                      src="/videos/fixingtesla.mp4" 
                      autoPlay
                      muted
                      loop
                      playsInline
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 to-blue-600/40 z-10 rounded-xl"></div>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                    <FaMobile className="mr-2 text-blue-600" /> Mobile Tesla Service
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Tesla owners throughout San Diego County—from Chula Vista to Oceanside—can now access our premium mobile repair service. We come to your location to diagnose and fix issues in your driveway, saving you time and hassle.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span>Service throughout San Diego County</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span>Convenient diagnostics at your home or office</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span>Professional tools and equipment on wheels</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span>No need to wait weeks for Tesla appointment slots</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Services Grid */}
            <motion.h2
              className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              Comprehensive Tesla Services
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } }
              }}
            >
              <motion.div 
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]" 
                initial={{ opacity: 0, y: 40 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6 }}
              >
                <FaCar className="text-blue-600 text-3xl mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">All Tesla Models</h3>
                <p className="text-gray-600 mb-4">
                  We service the full Tesla lineup including Model S, Model 3, Model X, Model Y, and Cybertruck. Whatever Tesla you drive, our technicians have the specialized knowledge to keep it performing at its best.
                </p>
                <ul className="text-gray-600 space-y-2 text-sm mb-4">
                  <li>• Model S expertise</li>
                  <li>• Model 3 specialty service</li>
                  <li>• Model X wing door repairs</li>
                  <li>• Model Y performance tuning</li>
                  <li>• Cybertruck maintenance</li>
                </ul>
                <p className="text-gray-600 text-sm italic">We handle all types of Tesla repairs - if you don't see your issue listed, just ask!</p>
              </motion.div>

              <motion.div 
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]" 
                initial={{ opacity: 0, y: 40 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <FaCarBattery className="text-blue-600 text-3xl mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">EV Battery Systems</h3>
                <p className="text-gray-600 mb-4">
                  Our technicians are specially trained in high-voltage battery repair and diagnostics. From cell replacements to thermal management systems, we handle all Tesla battery-related issues with precision.
                </p>
                <ul className="text-gray-600 space-y-2 text-sm mb-4">
                  <li>• Battery diagnostics</li>
                  <li>• HV battery repairs</li>
                  <li>• Range optimization</li>
                  <li>• Thermal system maintenance</li>
                </ul>
              </motion.div>

              <motion.div 
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]" 
                initial={{ opacity: 0, y: 40 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <GiElectric className="text-blue-600 text-3xl mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Electric Motor Repairs</h3>
                <p className="text-gray-600 mb-4">
                  LDU and motor issues need not mean weeks of downtime. Our specialized team can diagnose, repair, and replace Tesla drive units far faster than typical service centers, often saving you thousands.
                </p>
                <ul className="text-gray-600 space-y-2 text-sm mb-4">
                  <li>• Drive unit diagnostics</li>
                  <li>• Motor replacement</li>
                  <li>• Performance tuning</li>
                  <li>• Noise and vibration fixes</li>
                </ul>
              </motion.div>

              <motion.div 
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]" 
                initial={{ opacity: 0, y: 40 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <FaTools className="text-blue-600 text-3xl mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Collision & Bodywork</h3>
                <p className="text-gray-600 mb-4">
                  From minor dings to major collision repairs, we specialize in restoring Teslas to pre-accident condition. We have particular expertise with airbag and structural repairs for all Tesla models.
                </p>
                <ul className="text-gray-600 space-y-2 text-sm mb-4">
                  <li>• Aluminum body repairs</li>
                  <li>• Airbag system restoration</li>
                  <li>• Structural integrity restoration</li>
                  <li>• Paintless dent removal</li>
                </ul>
              </motion.div>

              <motion.div 
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]" 
                initial={{ opacity: 0, y: 40 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <FaWrench className="text-blue-600 text-3xl mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Programming & Software</h3>
                <p className="text-gray-600 mb-4">
                  Our technicians can perform advanced diagnostics, key programming, and software resets that typically require Tesla service center access, getting you back on the road faster.
                </p>
                <ul className="text-gray-600 space-y-2 text-sm mb-4">
                  <li>• Key card programming</li>
                  <li>• MCU diagnostics</li>
                  <li>• System resets</li>
                  <li>• Software troubleshooting</li>
                </ul>
              </motion.div>

              <motion.div 
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]" 
                initial={{ opacity: 0, y: 40 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <FaTruck className="text-blue-600 text-3xl mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nationwide Transport</h3>
                <p className="text-gray-600 mb-4">
                  Can't bring your Tesla to us? We offer nationwide vehicle transport. We'll pick up your vehicle from anywhere in the U.S., repair it at our facility, and deliver it back to you fully restored.
                </p>
                <ul className="text-gray-600 space-y-2 text-sm mb-4">
                  <li>• Coast-to-coast transport</li>
                  <li>• Fully insured shipping</li>
                  <li>• Door-to-door service</li>
                  <li>• Non-running vehicle transport</li>
                </ul>
              </motion.div>
            </motion.div>

            {/* Why Choose Us Section */}
            <motion.div
              className="mb-20"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                Why Choose Our Tesla Service
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <FaClock className="text-blue-600 text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold">Quick Turnaround Times</h3>
                  </div>
                  <p className="text-gray-600">
                    We understand the importance of your time and work around the clock to get your vehicle back to you quickly. Our team works diligently to get your Tesla back on the road as soon as possible, often in a fraction of the time of official service centers.
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <FaCheckCircle className="text-blue-600 text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold">Quality Guarantee</h3>
                  </div>
                  <p className="text-gray-600">
                    All our repairs come with a comprehensive warranty. We use quality parts and follow rigorous standards to ensure your Tesla performs exactly as it should. Customer satisfaction is our top priority, and we stand behind our work.
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <FaMapMarkerAlt className="text-blue-600 text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold">Convenient Options</h3>
                  </div>
                  <p className="text-gray-600">
                    With both mobile service and nationwide transport available, we make Tesla repair convenient for everyone. Whether you're around the corner in San Diego or across the country, we have a solution to get your Tesla serviced.
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <FaWrench className="text-blue-600 text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold">Price Match Guarantee</h3>
                  </div>
                  <p className="text-gray-600">
                    We'll beat anyone's price on Tesla repairs, guaranteed! Our competitive pricing doesn't come at the expense of quality—we simply operate more efficiently than larger service centers while maintaining the highest standards.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl p-8 md:p-12 text-white text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Your Tesla Fixed?</h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                Don't wait weeks for an appointment. Our Tesla-certified technicians are ready to help you today with fast, professional service at competitive rates.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="px-8 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Request Service Quote
                </button>
                <a
                  href="tel:+16197843791"
                  className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center"
                >
                  <FaPhoneAlt className="mr-2" /> Call Directly
                </a>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
        
        {/* Service Request Modal */}
        <AnimatePresence>
          {showRequestModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial="hidden"
              animate="visible"
              exit="exit" 
              variants={simpleVariants}
            >
              <motion.div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full relative">
                <button
                  onClick={() => { setShowRequestModal(false); setFormSubmitted(false); setRequestForm({ name: '', email: '', phone: '', issue: '', model: '', files: [] }); }}
                  className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl"
                  aria-label="Close modal"
                >
                  &times;
                </button>
                <h3 id="repair-modal-title" className="text-2xl font-bold text-blue-900 mb-4">Request Tesla Repair Service</h3>
                {formSubmitted ? (
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-xl font-semibold text-green-600 mb-2">Thank you for your request!</div>
                    <div className="text-gray-700 mb-4 text-center">We have received your service request and will get back to you soon.</div>
                    <button onClick={() => { setShowRequestModal(false); setFormSubmitted(false); }} className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Close</button>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={async e => {
                    e.preventDefault();
                    try {
                      let uploadedUrls: string[] = [];
                      if (requestForm.files && requestForm.files.length > 0) {
                        try {
                          const formData = new FormData();
                          requestForm.files.forEach(file => formData.append('images', file));
                          const res = await fetch('/api/upload', { method: 'POST', body: formData });
                          if (!res.ok) throw new Error('Failed to upload images');
                          const data = await res.json();
                          uploadedUrls = data.urls || [];
                        } catch (error) {
                          console.error('Error uploading images:', error);
                          // Continue with form submission even if image upload fails
                        }
                      }
                      
                      await sendEmail({ 
                        name: requestForm.name, 
                        email: requestForm.email, 
                        phone: requestForm.phone,
                        subject: `Tesla Repair Request - ${requestForm.model}`, 
                        message: requestForm.issue, 
                        model: requestForm.model,
                        files: uploadedUrls 
                      });
                    } catch (error) {
                      console.error('Form submission error:', error);
                      toast.error('Failed to send request. Please try again or call us directly.');
                    }
                  }}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input 
                        type="text" 
                        className="w-full border rounded-md px-3 py-2" 
                        required 
                        value={requestForm.name} 
                        onChange={e => setRequestForm(f => ({ ...f, name: e.target.value }))} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        className="w-full border rounded-md px-3 py-2" 
                        required 
                        value={requestForm.email} 
                        onChange={e => setRequestForm(f => ({ ...f, email: e.target.value }))} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input 
                        type="tel" 
                        className="w-full border rounded-md px-3 py-2" 
                        value={requestForm.phone} 
                        onChange={e => setRequestForm(f => ({ ...f, phone: e.target.value }))} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tesla Model</label>
                      <select 
                        className="w-full border rounded-md px-3 py-2" 
                        required
                        value={requestForm.model} 
                        onChange={e => setRequestForm(f => ({ ...f, model: e.target.value }))}
                      >
                        <option value="">Select your Tesla model</option>
                        <option value="Model S">Model S</option>
                        <option value="Model 3">Model 3</option>
                        <option value="Model X">Model X</option>
                        <option value="Model Y">Model Y</option>
                        <option value="Cybertruck">Cybertruck</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Describe the issue (optional)</label>
                      <textarea 
                        className="w-full border rounded-md px-3 py-2" 
                        rows={3} 
                        value={requestForm.issue} 
                        onChange={e => setRequestForm(f => ({ ...f, issue: e.target.value }))}
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photos (optional)</label>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="w-full" 
                        onChange={e => setRequestForm(f => ({ ...f, files: Array.from(e.target.files || []) }))} 
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
                    >
                      {isLoading ? 'Sending...' : 'Submit Service Request'}
                    </button>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLoader>
  )
} 