'use client'

import { useState } from 'react'
import { AuctionVehicle } from './AuctionWatch'
import { FiAlertCircle, FiCheckCircle, FiX, FiDownload } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

interface AuctionImportModalProps {
  auction: AuctionVehicle
  isOpen: boolean
  onClose: () => void
  onImport: (data: any) => void
}

export default function AuctionImportModal({ auction, isOpen, onClose, onImport }: AuctionImportModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: `${auction.year} ${auction.make} ${auction.model}`,
    description: `Originally purchased from ${auction.source.toUpperCase()} auction, lot #${auction.lot}. ${auction.primaryDamage ? `Primary damage: ${auction.primaryDamage}.` : ''} ${auction.secondaryDamage ? `Secondary damage: ${auction.secondaryDamage}.` : ''}`,
    price: Math.round(auction.estimatedValue || (auction.currentBid || 0) * 1.3),
    purchasePrice: auction.currentBid || 0,
    repairCost: auction.damageType === 'Flood' ? 12000 : 
                auction.damageType === 'Front End' ? 8000 :
                auction.damageType === 'Rear End' ? 6000 : 4000,
    transportCost: 1200,
    auctionFees: Math.round((auction.currentBid || 0) * 0.1),
    importNotes: '',
    condition: auction.damageType ? 'Used' : 'Like New',
    showAuctionHistory: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'purchasePrice' || name === 'repairCost' || name === 'transportCost' || name === 'auctionFees' 
        ? parseInt(value) || 0 
        : value
    }))
  }

  const getTotalInvestment = () => {
    return formData.purchasePrice + formData.repairCost + formData.transportCost + formData.auctionFees
  }

  const getEstimatedProfit = () => {
    return formData.price - getTotalInvestment()
  }

  const getProfitMargin = () => {
    return getTotalInvestment() > 0 ? (getEstimatedProfit() / getTotalInvestment()) * 100 : 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prepare vehicle data for inventory import
    const vehicleData = {
      title: formData.title,
      description: formData.description,
      make: auction.make,
      model: auction.model,
      year: auction.year,
      vin: auction.vin,
      price: formData.price,
      purchasePrice: formData.purchasePrice + formData.auctionFees + formData.transportCost,
      repairCost: formData.repairCost,
      condition: formData.condition,
      mileage: auction.odometer || 0,
      fuelType: auction.fuelType || 'Electric',
      transmission: auction.transmission || 'Automatic',
      color: auction.color || 'Unknown',
      features: [],
      specifications: {
        cylinders: auction.cylinders || 0,
        primaryDamage: auction.primaryDamage,
        secondaryDamage: auction.secondaryDamage,
        keys: auction.keys,
        driveable: auction.driveableCertification
      },
      status: 'pending',
      image: auction.imageUrl,
      images: [auction.imageUrl],
      auctionHistory: formData.showAuctionHistory ? {
        source: auction.source,
        lot: auction.lot,
        purchaseDate: new Date().toISOString(),
        auctionPrice: auction.currentBid,
        repairCost: formData.repairCost,
        transportCost: formData.transportCost,
        auctionFees: formData.auctionFees,
        notes: formData.importNotes
      } : undefined
    }
    
    onImport(vehicleData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            Import Auction Vehicle to Inventory
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="flex mb-6 border-b border-gray-200 pb-4">
            <div className="w-32 h-32 flex-shrink-0">
              <img 
                src={auction.imageUrl} 
                alt={auction.title} 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-bold text-gray-900">{auction.title}</h3>
              <div className="mt-1 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
                <div>Lot: {auction.lot}</div>
                <div>VIN: {auction.vin}</div>
                <div>Source: {auction.source.toUpperCase()}</div>
                <div>Odometer: {auction.odometer?.toLocaleString() || 'Unknown'} mi</div>
                {auction.primaryDamage && <div>Damage: {auction.primaryDamage}</div>}
                <div>Current Bid: ${auction.currentBid?.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-medium text-gray-900">Vehicle Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title/Listing Name
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                        Condition
                      </label>
                      <select
                        id="condition"
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="New">New</option>
                        <option value="Like New">Like New</option>
                        <option value="Used">Used</option>
                        <option value="Salvage">Salvage</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Next: Pricing & Costs
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-medium text-gray-900">Pricing & Investment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Listing Price
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">$</span>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Purchase Price
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">$</span>
                        <input
                          type="number"
                          id="purchasePrice"
                          name="purchasePrice"
                          value={formData.purchasePrice}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="repairCost" className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Repair Cost
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">$</span>
                        <input
                          type="number"
                          id="repairCost"
                          name="repairCost"
                          value={formData.repairCost}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="transportCost" className="block text-sm font-medium text-gray-700 mb-1">
                        Transport Cost
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">$</span>
                        <input
                          type="number"
                          id="transportCost"
                          name="transportCost"
                          value={formData.transportCost}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="auctionFees" className="block text-sm font-medium text-gray-700 mb-1">
                        Auction Fees
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">$</span>
                        <input
                          type="number"
                          id="auctionFees"
                          name="auctionFees"
                          value={formData.auctionFees}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Profit Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Total Investment</div>
                        <div className="text-lg font-bold text-gray-900">${getTotalInvestment().toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Estimated Profit</div>
                        <div className={`text-lg font-bold ${getEstimatedProfit() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${getEstimatedProfit().toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Profit Margin</div>
                        <div className={`text-lg font-bold ${getProfitMargin() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {getProfitMargin().toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Next: Additional Information
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
                  <div>
                    <label htmlFor="importNotes" className="block text-sm font-medium text-gray-700 mb-1">
                      Import Notes (Internal Only)
                    </label>
                    <textarea
                      id="importNotes"
                      name="importNotes"
                      value={formData.importNotes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Add any notes about this vehicle import"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showAuctionHistory"
                      name="showAuctionHistory"
                      checked={formData.showAuctionHistory}
                      onChange={(e) => setFormData({...formData, showAuctionHistory: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showAuctionHistory" className="ml-2 block text-sm text-gray-900">
                      Include auction history in vehicle record
                    </label>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 mt-2">
                    <div className="flex items-start">
                      <FiAlertCircle className="text-blue-600 w-5 h-5 mt-0.5 mr-2" />
                      <div>
                        <h4 className="font-medium text-blue-800">About Auction History</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          When enabled, auction details will be saved with the vehicle record for internal reference. This information will not be visible to customers on the website.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <FiDownload className="mr-1.5" /> Import to Inventory
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </motion.div>
    </div>
  )
} 