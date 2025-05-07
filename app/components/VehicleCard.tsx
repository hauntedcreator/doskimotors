'use client'

import React, { memo } from 'react'
import Image from 'next/image'
import { Vehicle } from '../store/vehicleStore'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

type VehicleCardProps = {
  vehicle: Vehicle
  onViewDetails: (vehicle: Vehicle) => void
  onContact: (vehicle: Vehicle) => void
  onFavorite: (vehicleId: string, e: React.MouseEvent) => void
  onIncrementViews: (vehicleId: string) => void
  getVehicleHighlights: (vehicle: Vehicle) => any[]
}

// Memoize the component to prevent unnecessary rerenders
const VehicleCard = memo(({
  vehicle,
  onViewDetails,
  onContact,
  onFavorite,
  onIncrementViews,
  getVehicleHighlights
}: VehicleCardProps) => {
  const handleViewDetails = () => {
    onViewDetails(vehicle)
    onIncrementViews(vehicle.id)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div 
        className="relative pb-[60%] bg-gray-100 group cursor-pointer"
        onClick={handleViewDetails}
      >
        {/* Feature Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-2">
          {getVehicleHighlights(vehicle).map((highlight, index) => (
            <span
              key={index}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${highlight.color}`}
            >
              {highlight.icon}
              <span className="ml-1">{highlight.text}</span>
            </span>
          ))}
        </div>

        {/* Favorite Button */}
        <div className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors z-10 flex items-center gap-1">
          {/* Display the favorites count */}
          <span className="text-xs font-medium text-gray-700">
            {vehicle.favorites ? 1 : 0}
          </span>
          <button
            onClick={(e) => onFavorite(vehicle.id, e)}
            className="ml-1"
          >
            {vehicle.favorites ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        <div className="absolute inset-0">
          {vehicle.image.startsWith('http') ? (
            <Image
              src={vehicle.image}
              alt={vehicle.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <img
              src={vehicle.image}
              alt={vehicle.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent h-20" />
      </div>

      <div className="p-4">
        <h2 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{vehicle.title}</h2>
        <div className="flex items-center justify-between mb-2">
          <p className="text-blue-600 font-semibold">${vehicle.price.toLocaleString()}</p>
          {vehicle.status === 'sold' ? (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Sold</span>
          ) : vehicle.status === 'pending' ? (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>
          ) : (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Available</span>
          )}
        </div>
        <div className="space-y-1 text-sm text-gray-500 mb-4">
          <p>Year: {vehicle.year}</p>
          <p>Mileage: {vehicle.mileage.toLocaleString()} miles</p>
          <p>{vehicle.location}</p>
        </div>
        
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded transition-colors text-sm"
          >
            View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onContact(vehicle);
            }}
            className="flex-1 bg-white hover:bg-gray-100 text-blue-600 py-2 px-3 rounded border border-blue-600 transition-colors text-sm"
          >
            Contact Dealer
          </button>
        </div>
      </div>
    </div>
  )
})

// Add display name for debugging
VehicleCard.displayName = 'VehicleCard'

export default VehicleCard 