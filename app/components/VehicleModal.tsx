'use client'

import React, { useState } from 'react';
import { Vehicle } from '../store/vehicleStore';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCarousel from './ImageCarousel';
import LoanCalculator from './LoanCalculator';
import ContactDealerModal from './ContactDealerModal';

interface VehicleModalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

export default function VehicleModal({ vehicle, onClose }: VehicleModalProps) {
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Prepare the vehicle info for the contact form
  const vehicleInfo = {
    id: vehicle.id,
    title: vehicle.title,
    price: vehicle.price,
    year: vehicle.year,
    make: vehicle.make,
    model: vehicle.model
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          key="modal-content"
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

          {/* Main vehicle modal content */}
          <AnimatePresence mode="wait">
            <motion.div
              key="modal-body"
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

                {/* Loan Calculator */}
                {vehicle.status !== 'sold' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-6 p-4 bg-gray-50 rounded-lg"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Estimate Your Monthly Payment</h3>
                    <LoanCalculator vehiclePrice={vehicle.price} />
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-3 mt-6"
                >
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center"
                  >
                    Contact Dealer
                  </button>
                  <a
                    href="tel:+16197843791"
                    className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition flex items-center justify-center"
                  >
                    Call (619) 784-3791
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Use our new ContactDealerModal component for the contact form */}
      <ContactDealerModal 
        key="contact-dealer-modal"
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        vehicleInfo={vehicleInfo}
      />
    </AnimatePresence>
  )
} 