'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Vehicle {
  id: number
  name: string
  price: string
  image: string
  year: number
  mileage: string
  transmission: string
  fuelType: string
}

export default function VehiclesPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  
  // Sample vehicle data - in a real app, this would come from an API or database
  const vehicles: Vehicle[] = [
    {
      id: 1,
      name: "Tesla Model S",
      price: "$79,990",
      image: "/images/hero-bg.jpg", // Replace with actual vehicle images
      year: 2024,
      mileage: "New",
      transmission: "Automatic",
      fuelType: "Electric"
    },
    {
      id: 2,
      name: "BMW M4 Competition",
      price: "$74,900",
      image: "/images/hero-bg.jpg",
      year: 2024,
      mileage: "New",
      transmission: "Automatic",
      fuelType: "Gasoline"
    },
    {
      id: 3,
      name: "Mercedes-AMG GT",
      price: "$92,500",
      image: "/images/hero-bg.jpg",
      year: 2024,
      mileage: "New",
      transmission: "Automatic",
      fuelType: "Gasoline"
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
            Our Vehicle Collection
          </h1>
          <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto">
            Explore our premium selection of luxury and performance vehicles
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-6 py-2 rounded-full ${
              selectedFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            All Vehicles
          </button>
          <button
            onClick={() => setSelectedFilter('electric')}
            className={`px-6 py-2 rounded-full ${
              selectedFilter === 'electric'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            Electric
          </button>
          <button
            onClick={() => setSelectedFilter('luxury')}
            className={`px-6 py-2 rounded-full ${
              selectedFilter === 'luxury'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            Luxury
          </button>
          <button
            onClick={() => setSelectedFilter('sports')}
            className={`px-6 py-2 rounded-full ${
              selectedFilter === 'sports'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            Sports
          </button>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64">
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{vehicle.name}</h3>
                    <p className="text-2xl font-bold text-blue-600">{vehicle.price}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {vehicle.year}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {vehicle.mileage}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {vehicle.transmission}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {vehicle.fuelType}
                  </div>
                </div>
                <button className="w-full mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 