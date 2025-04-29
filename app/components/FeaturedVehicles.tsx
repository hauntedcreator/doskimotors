import { Vehicle, useVehicleStore } from '../store/vehicleStore'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

export default function FeaturedVehicles() {
  const [activeTab, setActiveTab] = useState('all')
  const vehicles = useVehicleStore(state => state.vehicles)
  const toggleFavorite = useVehicleStore(state => state.toggleFavorite)
  
  const featuredVehicles = vehicles.filter(vehicle => 
    vehicle.status === 'available' && 
    (activeTab === 'all' || vehicle.bodyStyle.toLowerCase() === activeTab)
  )

  const handleFavoriteClick = (vehicleId: string) => {
    try {
      toggleFavorite(vehicleId)
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Featured Vehicles
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Explore our selection of premium vehicles
          </p>
        </div>

        <div className="mt-8">
          <div className="flex justify-center space-x-4">
            {['all', 'sedan', 'suv', 'truck', 'coupe'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-md ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredVehicles.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="relative h-48">
                <Image
                  src={vehicle.image}
                  alt={vehicle.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => handleFavoriteClick(vehicle.id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                  {vehicle.favorites ? (
                    <HeartSolidIcon className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{vehicle.title}</h3>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    ${vehicle.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {vehicle.mileage.toLocaleString()} miles
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {vehicle.year}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {vehicle.transmission}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {vehicle.fuelType}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 