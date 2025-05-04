'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { FiX, FiSend } from 'react-icons/fi'

interface ContactDealerModalProps {
  isOpen: boolean
  onClose: () => void
  vehicleInfo?: {
    id: string
    title: string
    price: number
    year: number
    make: string
    model: string
  }
}

const ContactDealerModal: React.FC<ContactDealerModalProps> = ({ isOpen, onClose, vehicleInfo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: vehicleInfo 
      ? `I'm interested in the ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} (${vehicleInfo.title}) listed for $${vehicleInfo.price.toLocaleString()}.`
      : '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // First, save to leads database
      const leadData = {
        ...formData,
        subject: vehicleInfo 
          ? `Interest in ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`
          : 'Vehicle Inquiry',
        source: 'vehicle-contact',
        vehicleId: vehicleInfo?.id || '',
        vehicleTitle: vehicleInfo?.title || '',
      }

      // Save to leads API endpoint
      await fetch('/api/leads/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData)
      })
      
      // Send email notification
      await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData)
      })

      // Show success message and toast
      toast.success('Message sent successfully!')
      setIsSuccess(true)
      
      // Close the modal after showing success for 2 seconds
      setTimeout(() => {
        onClose()
        
        // Reset form and success state after closing
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: vehicleInfo 
            ? `I'm interested in the ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} (${vehicleInfo.title}) listed for $${vehicleInfo.price.toLocaleString()}.`
            : '',
        })
        setIsSuccess(false)
      }, 2000)
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
      console.error('Form submission error:', error)
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle click outside modal to close
  const handleClickOutside = (e: React.MouseEvent) => {
    // Prevent propagation but don't close the modal
    e.stopPropagation();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleClickOutside}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            ref={modalRef}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Contact Dealer</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors rounded-full p-1"
              >
                <FiX size={20} />
              </button>
            </div>

            {vehicleInfo && (
              <div className="p-5 bg-blue-50 border-b border-blue-100">
                <p className="text-blue-800 font-medium">
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                </p>
                <p className="text-blue-700 text-sm">${vehicleInfo.price.toLocaleString()}</p>
              </div>
            )}

            {isSuccess ? (
              <div className="p-10 flex flex-col items-center justify-center">
                <div className="bg-green-100 rounded-full p-4 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600 text-center">
                  Thank you for contacting Doski Motors. A dealer representative will be in touch with you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
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
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
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

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <FiSend className="mr-2" />
                    )}
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ContactDealerModal 