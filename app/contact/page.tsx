'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: 'General Inquiry'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // First, save to database
      await fetch('/api/leads/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'contact-page'
        })
      })

      // Then, send email
      const emailResponse = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'contact-page'
        })
      })

      if (!emailResponse.ok) {
        throw new Error('Failed to send email')
      }

      // Show success modal instead of toast
      setShowSuccessModal(true)
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        subject: 'General Inquiry'
      })
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
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
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
          >
            Contact Us
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We're here to help. Get in touch with our team.
            </p>
            <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          </motion.div>
        </div>
      </section>
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
              
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Visit Our Dealership</h2>
                  <p className="text-gray-600">
                    7490 Opportunity Rd STE 2900<br />
                    San Diego, CA 92111
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Hours</h2>
                  <div className="space-y-2 text-gray-600">
                    <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                    <p>Saturday: 10:00 AM - 6:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                  <div className="space-y-2">
                    <p className="flex items-center text-gray-600">
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      (619) 784-3791
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Follow Us</h2>
                  <div className="flex space-x-4">
                    <a href="https://facebook.com/doskimotors" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/>
                      </svg>
                    </a>
                    <a href="https://instagram.com/doskimotors" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,2.2c3.2,0,3.6,0,4.9.1,3.3.1,4.8,1.7,4.9,4.9.1,1.3.1,1.6.1,4.8,0,3.2,0,3.6-.1,4.8-.1,3.2-1.7,4.8-4.9,4.9-1.3.1-1.6.1-4.9.1-3.2,0-3.6,0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8,0-3.2,0-3.6.1-4.8C2.4,4,4,2.4,7.2,2.3,8.5,2.2,8.8,2.2,12,2.2ZM12,0C8.7,0,8.3,0,7,0.1,2.7.3.3,2.7.1,7,0,8.3,0,8.7,0,12s0,3.7.1,5c.2,4.3,2.6,6.7,7,6.9,1.3.1,1.7.1,5,.1s3.7,0,5-.1c4.3-.2,6.7-2.6,6.9-7,.1-1.3.1-1.7.1-5s0-3.7-.1-5c-.2-4.3-2.6-6.7-7-6.9C15.7,0,15.3,0,12,0Zm0,5.8A6.2,6.2,0,1,0,18.2,12,6.2,6.2,0,0,0,12,5.8Zm0,10.2A4,4,0,1,1,16,12,4,4,0,0,1,12,16Zm7.8-10.4a1.4,1.4,0,1,1-1.4-1.4A1.4,1.4,0,0,1,19.8,5.6Z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Vehicle Information">Vehicle Information</option>
                    <option value="Test Drive Request">Test Drive Request</option>
                    <option value="Trade-In Question">Trade-In Question</option>
                    <option value="Financing Question">Financing Question</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
                <div className="mt-4 space-y-3">
                  <p className="text-gray-600">
                    Thank you for contacting Doski Motors. We've received your message and will get back to you as soon as possible.
                  </p>
                  <p className="text-gray-600">
                    A member of our team will contact you within 24 hours.
                  </p>
                </div>
                <div className="mt-8">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setShowSuccessModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 