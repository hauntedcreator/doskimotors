'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useFavorites } from '@/context/FavoritesContext'
import EmailModal from './EmailModal'

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  image: string
  condition: string
  transmission: string
  bodyStyle: string
  color: string
}

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 24999,
    mileage: 15000,
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    condition: 'Like New',
    transmission: 'Automatic',
    bodyStyle: 'Sedan',
    color: 'Silver'
  },
  {
    id: '2',
    make: 'Honda',
    model: 'CR-V',
    year: 2023,
    price: 29999,
    mileage: 5000,
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    condition: 'New',
    transmission: 'Automatic',
    bodyStyle: 'SUV',
    color: 'Black'
  },
  {
    id: '3',
    make: 'Ford',
    model: 'F-150',
    year: 2021,
    price: 34999,
    mileage: 25000,
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    condition: 'Excellent',
    transmission: 'Automatic',
    bodyStyle: 'Truck',
    color: 'White'
  }
]

const FeaturedVehicles = () => {
  const [activeTab, setActiveTab] = useState<'featured' | 'recent'>('featured')
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('')
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()

  const handleFavoriteClick = (vehicleId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isFavorite(vehicleId)) {
      removeFavorite(vehicleId)
    } else {
      setSelectedVehicleId(vehicleId)
      setIsEmailModalOpen(true)
    }
  }

  const handleEmailSubmit = (email: string) => {
    if (selectedVehicleId) {
      addFavorite(selectedVehicleId, email)
      setIsEmailModalOpen(false)
    }
  }

  const handleEmailModalClose = () => {
    setIsEmailModalOpen(false)
    setSelectedVehicleId('')
  }

  return (
    <>
      <div className="relative bg-gray-50 w-screen left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-6 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'featured'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Featured
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`px-6 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'recent'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Recently Added
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockVehicles.map((vehicle) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={vehicle.image}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={(e) => handleFavoriteClick(vehicle.id, e)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 group z-10"
                  >
                    {isFavorite(vehicle.id) ? (
                      <HeartSolidIcon className="h-6 w-6 text-red-500" />
                    ) : (
                      <HeartIcon className="h-6 w-6 text-white group-hover:text-red-500 transition-colors" />
                    )}
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-lg font-semibold text-blue-400">
                      ${vehicle.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600">Mileage</p>
                      <p className="font-semibold">{vehicle.mileage.toLocaleString()} mi</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Condition</p>
                      <p className="font-semibold">{vehicle.condition}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Transmission</p>
                      <p className="font-semibold">{vehicle.transmission}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Body Style</p>
                      <p className="font-semibold">{vehicle.bodyStyle}</p>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={handleEmailModalClose}
        onSubmit={handleEmailSubmit}
      />
    </>
  )
}

export default FeaturedVehicles 