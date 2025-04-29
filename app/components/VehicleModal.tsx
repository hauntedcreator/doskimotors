'use client'

import React, { useState } from 'react';
import { Vehicle } from '../store/vehicleStore';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCarousel from './ImageCarousel';
import LoanCalculator from './LoanCalculator';

interface VehicleModalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

interface InquiryForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function VehicleModal({ vehicle, onClose }: VehicleModalProps) {
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [formData, setFormData] = useState<InquiryForm>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send this data to your backend
    console.log('Inquiry submitted:', formData);
    // For now, just close the form
    setShowInquiryForm(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.3
          }}
          className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow z-50"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </motion.button>

          <AnimatePresence mode="wait">
            {showInquiryForm ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                <h2 className="text-2xl font-bold mb-4">Contact Dealer</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 h-32 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="I'm interested in this vehicle and would like more information..."
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowInquiryForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                    >
                      Send Message
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Image Carousel */}
                <div className="relative aspect-video">
                  <ImageCarousel
                    images={vehicle.images?.length > 0 ? vehicle.images : [vehicle.image]}
                    alt={vehicle.title}
                    priority={true}
                  />
                </div>

                {/* Vehicle details */}
                <div className="p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-between items-start mb-4"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{vehicle.title}</h2>
                      <p className="text-lg font-semibold text-blue-600">
                        ${vehicle.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{vehicle.location}</p>
                      <p className="text-sm text-gray-500">{vehicle.views} views</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 gap-4 mb-6"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Year</h3>
                      <p className="text-base text-gray-900">{vehicle.year}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Mileage</h3>
                      <p className="text-base text-gray-900">{vehicle.mileage.toLocaleString()} miles</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Condition</h3>
                      <p className="text-base text-gray-900">{vehicle.condition}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Transmission</h3>
                      <p className="text-base text-gray-900">{vehicle.transmission}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Fuel Type</h3>
                      <p className="text-base text-gray-900">{vehicle.fuelType}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Body Style</h3>
                      <p className="text-base text-gray-900">{vehicle.bodyStyle}</p>
                    </div>
                  </motion.div>

                  {/* Features Section */}
                  {vehicle.features && vehicle.features.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mb-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Features</h3>
                      <ul className="grid grid-cols-2 gap-2">
                        {vehicle.features.map((feature, index) => (
                          <li key={index} className="text-gray-600 flex items-center">
                            <span className="mr-2">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Description Section */}
                  {vehicle.description && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mb-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600 whitespace-pre-line">{vehicle.description}</p>
                    </motion.div>
                  )}

                  {/* Loan Calculator Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculate Your Monthly Payment</h3>
                    <LoanCalculator vehiclePrice={vehicle.price} />
                  </div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex space-x-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowInquiryForm(true)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Contact Dealer
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 