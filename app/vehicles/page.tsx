'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useVehicleStore, Vehicle } from '../store/vehicleStore'
import VehicleModal from '../components/VehicleModal'
import VehicleFilters from '../components/VehicleFilters'
import VehicleCard from '../components/VehicleCard'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ImageCarousel from '../components/ImageCarousel'
import { FaStar, FaCheckCircle, FaClock, FaLock, FaHeart, FaRegHeart } from 'react-icons/fa'
import VehicleContactForm from '../components/VehicleContactForm'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

// Create a separate component that uses useSearchParams
function VehicleSearchContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  
  // Use the search params here
  // ... your existing logic with searchParams
  
  return <>{children}</>
}

export default function VehiclesPage() {
  const searchParams = useSearchParams()
  const { vehicles, toggleFavorite, incrementViews } = useVehicleStore()
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(vehicles)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [showEmailPrompt, setShowEmailPrompt] = useState(false)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [contactVehicle, setContactVehicle] = useState<Vehicle | null>(null)
  const [initialFilters, setInitialFilters] = useState({
    search: '',
    priceRange: { min: '', max: '' },
    year: { min: '', max: '' },
    condition: [] as string[],
    bodyStyle: [] as string[],
    transmission: [] as string[],
    fuelType: [] as string[],
    make: [] as string[]
  })

  // Memoized callbacks for the VehicleCard component
  const handleViewDetails = useCallback((vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
  }, [])

  const handleContactDealer = useCallback((vehicle: Vehicle) => {
    setContactVehicle(vehicle)
  }, [])

  const handleFavoriteClick = useCallback((vehicleId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!localStorage.getItem('userEmail')) {
      setSelectedVehicleId(vehicleId)
      setShowEmailPrompt(true)
    } else {
      toggleFavorite(vehicleId)
    }
  }, [toggleFavorite])

  const handleIncrementViews = useCallback((vehicleId: string) => {
    incrementViews(vehicleId)
  }, [incrementViews])

  const handleFilterChange = useCallback((filters: any) => {
    let filtered = [...vehicles].filter(vehicle => vehicle.status !== 'sold') // Show all vehicles except sold ones

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(vehicle => 
        vehicle.title?.toLowerCase().includes(searchTerm) ||
        vehicle.make?.toLowerCase().includes(searchTerm) ||
        vehicle.model?.toLowerCase().includes(searchTerm)
      )
    }

    // Apply price range filter
    if (filters.priceRange.min || filters.priceRange.max) {
      filtered = filtered.filter(vehicle => {
        const price = vehicle.price
        const min = filters.priceRange.min ? parseInt(filters.priceRange.min) : 0
        const max = filters.priceRange.max ? parseInt(filters.priceRange.max) : Infinity
        return price >= min && price <= max
      })
    }

    // Apply year range filter
    if (filters.year.min || filters.year.max) {
      filtered = filtered.filter(vehicle => {
        const year = vehicle.year
        const min = filters.year.min ? parseInt(filters.year.min) : 0
        const max = filters.year.max ? parseInt(filters.year.max) : Infinity
        return year >= min && year <= max
      })
    }

    // Apply condition filter
    if (filters.condition.length > 0) {
      filtered = filtered.filter(vehicle => 
        filters.condition.includes(vehicle.condition)
      )
    }

    // Apply body style filter
    if (filters.bodyStyle.length > 0) {
      filtered = filtered.filter(vehicle => 
        filters.bodyStyle.includes(vehicle.bodyStyle)
      )
    }

    // Apply transmission filter
    if (filters.transmission.length > 0) {
      filtered = filtered.filter(vehicle => 
        filters.transmission.includes(vehicle.transmission)
      )
    }

    // Apply fuel type filter
    if (filters.fuelType.length > 0) {
      filtered = filtered.filter(vehicle => 
        filters.fuelType.includes(vehicle.fuelType)
      )
    }

    // Apply make filter
    if (filters.make.length > 0) {
      filtered = filtered.filter(vehicle => 
        filters.make.includes(vehicle.make)
      )
    }

    setFilteredVehicles(filtered)
  }, [vehicles])

  // The getVehicleHighlights function should be memoized too
  const getVehicleHighlights = useCallback((vehicle: Vehicle) => {
    const highlights = []

    // Premium EV Features (Priority 1)
    if (vehicle.fuelType === 'Electric' && vehicle.features) {
      if (vehicle.features.includes('Full Self-Driving Capability')) {
        highlights.push({
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
          text: 'Full Self-Driving',
          color: 'bg-purple-500',
          priority: 1
        })
      }
    }

    // Performance Features (Priority 2)
    if (vehicle.specifications?.horsepower && typeof vehicle.specifications.horsepower === 'number' && vehicle.specifications.horsepower >= 500) {
      highlights.push({
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
        text: `${vehicle.specifications.horsepower} HP`,
        color: 'bg-blue-500',
        priority: 2
      })
    }

    // Low Mileage (Priority 3)
    if (vehicle.mileage < 15000) {
      highlights.push({
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        text: `${vehicle.mileage.toLocaleString()} Miles`,
        color: 'bg-green-500',
        priority: 3
      })
    }

    // Featured Status (Priority 4)
    if (vehicle.featured && vehicle.features?.[0]) {
      highlights.push({
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        ),
        text: vehicle.features[0],
        color: 'bg-amber-500',
        priority: 4
      })
    }

    // Sort by priority and limit to 2
    return highlights.sort((a, b) => a.priority - b.priority).slice(0, 2)
  }, [])

  // Apply initial filters when vehicles change
  useEffect(() => {
    if (vehicles.length > 0) {
      handleFilterChange(initialFilters)
    }
  }, [vehicles, initialFilters, handleFilterChange])

  // Extract search params on initial load
  useEffect(() => {
    const query = searchParams.get('search')
    const brand = searchParams.get('brand')
    const price = searchParams.get('price')
    
    if (query || brand || price) {
      // Only update if we actually have search params to avoid unnecessary rerenders
      setInitialFilters(prevFilters => {
        const newFilters = { ...prevFilters }
        
        if (query) {
          newFilters.search = query
        }
        
        if (brand && brand !== 'all') {
          newFilters.make = [brand]
        }
        
        if (price && price !== 'all') {
          const [min, max] = price.split('-')
          if (min && max) {
            newFilters.priceRange = { min, max }
          } else if (min === '0' && max) {
            newFilters.priceRange = { min: '0', max }
          } else if (min && max === 'plus') {
            newFilters.priceRange = { min, max: '' }
          }
        }
        
        return newFilters
      })
      // We don't call handleFilterChange here since the other useEffect will handle that
    }
  }, [searchParams]) // Removed initialFilters and handleFilterChange from dependencies

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && selectedVehicleId) {
      localStorage.setItem('userEmail', email)
      toggleFavorite(selectedVehicleId)
      setShowEmailPrompt(false)
      setEmail('')
      setSelectedVehicleId(null)
    }
  }

  const handleSkipEmail = () => {
    if (selectedVehicleId) {
      toggleFavorite(selectedVehicleId)
      setShowEmailPrompt(false)
      setSelectedVehicleId(null)
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VehicleSearchContent>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          
          <main className="flex-grow pt-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto py-12">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="md:w-1/4">
                  <VehicleFilters 
                    vehicles={vehicles}
                    onFilterChange={handleFilterChange}
                    initialFilters={initialFilters}
                  />
                </div>

                {/* Vehicle Grid */}
                <div className="md:w-3/4">
                  <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Available Vehicles ({filteredVehicles.length})
                    </h1>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVehicles.map(vehicle => (
                      <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        onViewDetails={handleViewDetails}
                        onContact={handleContactDealer}
                        onFavorite={handleFavoriteClick}
                        onIncrementViews={handleIncrementViews}
                        getVehicleHighlights={getVehicleHighlights}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>

          <Footer />

          {/* Vehicle Details Modal */}
          {selectedVehicle && (
            <VehicleModal
              vehicle={selectedVehicle}
              onClose={() => setSelectedVehicle(null)}
            />
          )}

          {/* Email Prompt Modal */}
          {showEmailPrompt && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Save Your Favorites</h3>
                <p className="text-gray-600 mb-4">
                  Enter your email to save your favorite vehicles and get updates on price changes.
                </p>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleSkipEmail}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Skip
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Contact Dealer Modal */}
          {contactVehicle && (
            <VehicleContactForm
              onClose={() => setContactVehicle(null)}
              vehicle={{
                id: contactVehicle.id,
                title: contactVehicle.title,
                price: contactVehicle.price,
                year: contactVehicle.year,
                make: contactVehicle.make,
                model: contactVehicle.model
              }}
            />
          )}
        </div>
      </VehicleSearchContent>
    </Suspense>
  )
} 