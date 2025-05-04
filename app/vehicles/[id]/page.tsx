'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useVehicleStore, Vehicle } from '@/app/store/vehicleStore'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useFavorites } from '@/context/FavoritesContext'
import EmailModal from '@/components/EmailModal'
import { FiCheck, FiClock, FiPhone, FiMail, FiArrowLeft } from 'react-icons/fi'

export default function VehicleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { vehicles, incrementViews } = useVehicleStore()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()

  useEffect(() => {
    if (vehicles.length > 0 && params.id) {
      const vehicleId = Array.isArray(params.id) ? params.id[0] : params.id
      const foundVehicle = vehicles.find(v => v.id === vehicleId)
      
      if (foundVehicle) {
        // Set all state at once to avoid multiple re-renders
        setIsLoading(false)
        setVehicle(foundVehicle)
        setSelectedImage(foundVehicle.image)
        
        // Only increment views once when the component mounts
        const timer = setTimeout(() => {
          incrementViews(foundVehicle.id)
        }, 100)
        
        return () => clearTimeout(timer)
      } else {
        setIsLoading(false)
      }
    }
  }, [params.id, vehicles]) // Remove incrementViews from dependencies

  const handleFavoriteClick = () => {
    if (!vehicle) return
    
    if (isFavorite(vehicle.id)) {
      removeFavorite(vehicle.id)
    } else {
      setIsEmailModalOpen(true)
    }
  }

  const handleEmailSubmit = (email: string) => {
    if (vehicle) {
      addFavorite(vehicle.id, email)
      setIsEmailModalOpen(false)
    }
  }

  const handleBackClick = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Vehicle Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">The vehicle you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={handleBackClick}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiArrowLeft className="mr-2" /> Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Format price with commas
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.div 
        className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <button
                onClick={handleBackClick}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2"
              >
                <FiArrowLeft className="mr-2" /> Back to Vehicles
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {vehicle.title || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              </h1>
              <p className="text-lg text-gray-600">{vehicle.location}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleFavoriteClick}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {isFavorite(vehicle.id) ? (
                  <>
                    <HeartSolidIcon className="h-5 w-5 text-red-500 mr-2" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <HeartIcon className="h-5 w-5 text-gray-600 mr-2" />
                    <span>Save</span>
                  </>
                )}
              </button>
              <button className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FiPhone className="mr-2" />
                <span>Contact Dealer</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Main Image */}
              <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 relative aspect-[16/9]">
                {selectedImage && (
                  <Image
                    src={selectedImage}
                    alt={vehicle.title || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div 
                  className={`aspect-[3/2] rounded-lg overflow-hidden cursor-pointer bg-gray-100 relative ${selectedImage === vehicle.image ? 'ring-2 ring-blue-600' : ''}`}
                  onClick={() => setSelectedImage(vehicle.image)}
                >
                  <Image
                    src={vehicle.image}
                    alt={vehicle.title || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
                {/* You could add more thumbnail images here when available */}
              </div>

              {/* Vehicle Info Tabs */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Vehicle Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Basic Details</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-gray-600">Make:</span>
                          <span className="font-medium">{vehicle.make}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Model:</span>
                          <span className="font-medium">{vehicle.model}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Year:</span>
                          <span className="font-medium">{vehicle.year}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Condition:</span>
                          <span className="font-medium">{vehicle.condition}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Body Style:</span>
                          <span className="font-medium">{vehicle.bodyStyle}</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Performance & Specs</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-gray-600">Mileage:</span>
                          <span className="font-medium">{vehicle.mileage.toLocaleString()} miles</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Transmission:</span>
                          <span className="font-medium">{vehicle.transmission}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Fuel Type:</span>
                          <span className="font-medium">{vehicle.fuelType}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Horsepower:</span>
                          <span className="font-medium">{vehicle.specifications?.horsepower || 'N/A'}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Color:</span>
                          <span className="font-medium">{vehicle.color || 'N/A'}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-3">Features</h3>
                  {vehicle.features && vehicle.features.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                      {vehicle.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <FiCheck className="text-green-500 mr-2" /> {feature}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No features listed for this vehicle.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold">${formatPrice(vehicle.price)}</span>
                    {vehicle.status === 'available' ? (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <FiCheck className="mr-1" /> Available
                      </span>
                    ) : vehicle.status === 'pending' ? (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <FiClock className="mr-1" /> Pending
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        Sold
                      </span>
                    )}
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Contact Dealer</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <FiPhone className="mr-2" />
                        <span>Call Dealer</span>
                      </button>
                      <button className="w-full flex items-center justify-center px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                        <FiMail className="mr-2" />
                        <span>Email Dealer</span>
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold mb-2">Dealership Info</h3>
                    <p className="text-gray-700 mb-1">Doski Motors</p>
                    <p className="text-gray-600 mb-1">123 Auto Lane</p>
                    <p className="text-gray-600 mb-4">San Diego, CA 92101</p>
                    <div className="rounded-md overflow-hidden h-40 bg-gray-100">
                      {/* Google Map would go here */}
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        Google Map Integration
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <Footer />

      {isEmailModalOpen && (
        <EmailModal
          onClose={() => setIsEmailModalOpen(false)}
          onSubmit={handleEmailSubmit}
        />
      )}
    </div>
  )
} 