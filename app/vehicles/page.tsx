'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useVehicleStore, Vehicle } from '../store/vehicleStore'
import VehicleModal from '../components/VehicleModal'
import VehicleFilters from '../components/VehicleFilters'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ImageCarousel from '../components/ImageCarousel'
import { FaStar, FaCheckCircle, FaClock, FaLock } from 'react-icons/fa'
import Link from 'next/link'

const vehicles = [
  {
    id: 1,
    name: 'Tesla Model S',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Luxury sedan with incredible performance and range.',
    price: '250',
    category: 'Sedan',
    specs: {
      range: '405 miles',
      acceleration: '2.4s 0-60',
      topSpeed: '200 mph'
    }
  },
  {
    id: 2,
    name: 'Tesla Model 3',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'The most popular Tesla model, perfect for daily driving.',
    price: '180',
    category: 'Sedan',
    specs: {
      range: '358 miles',
      acceleration: '3.1s 0-60',
      topSpeed: '162 mph'
    }
  },
  {
    id: 3,
    name: 'Tesla Model X',
    image: 'https://images.unsplash.com/photo-1566274360936-69fae8dc1700?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Luxury SUV with falcon-wing doors and spacious interior.',
    price: '300',
    category: 'SUV',
    specs: {
      range: '348 miles',
      acceleration: '2.5s 0-60',
      topSpeed: '163 mph'
    }
  },
  {
    id: 4,
    name: 'Tesla Model Y',
    image: 'https://images.unsplash.com/photo-1619867079739-d576b1d1d6ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Compact SUV combining versatility with performance.',
    price: '220',
    category: 'SUV',
    specs: {
      range: '330 miles',
      acceleration: '3.5s 0-60',
      topSpeed: '155 mph'
    }
  }
]

const categories = ['All', 'Sedan', 'SUV']

export default function VehiclesPage() {
  const { vehicles: vehicleStoreVehicles, toggleFavorite, incrementViews } = useVehicleStore()
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(vehicleStoreVehicles)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [showEmailPrompt, setShowEmailPrompt] = useState(false)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const handleFilterChange = (filters: any) => {
    let filtered = [...vehicleStoreVehicles].filter(vehicle => vehicle.status !== 'sold') // Show all vehicles except sold ones

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(vehicle => 
        vehicle.title.toLowerCase().includes(searchTerm) ||
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
  }

  // Update filtered vehicles when vehicles change
  useEffect(() => {
    handleFilterChange({
      search: '',
      priceRange: { min: '', max: '' },
      year: { min: '', max: '' },
      condition: [],
      bodyStyle: [],
      transmission: [],
      fuelType: [],
      make: []
    })
  }, [vehicleStoreVehicles])

  const handleFavorite = (vehicleId: string) => {
    if (!localStorage.getItem('userEmail')) {
      setSelectedVehicleId(vehicleId)
      setShowEmailPrompt(true)
    } else {
      toggleFavorite(vehicleId)
    }
  }

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

  const getVehicleHighlights = (vehicle: Vehicle) => {
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

    // Sort by priority and return exactly 2 highlights
    return highlights.sort((a, b) => a.priority - b.priority).slice(0, 2)
  }

  const filteredVehiclesByCategory = filteredVehicles.filter(vehicle => {
    const matchesCategory = selectedCategory === 'All' || vehicle.category === selectedCategory
    const matchesSearch = vehicle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="md:w-1/4">
              <VehicleFilters 
                vehicles={vehicleStoreVehicles}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Vehicle Grid */}
            <div className="md:w-3/4">
              <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Available Vehicles ({filteredVehiclesByCategory.length})
                </h1>
              </div>

              {/* Filters */}
              <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-4">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehiclesByCategory.map(vehicle => (
                  <div
                    key={vehicle.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
                  >
                    <div 
                      className="relative pb-[60%] bg-gray-100 group cursor-pointer"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        incrementViews(vehicle.id);
                      }}
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

                    <div className="p-4 flex flex-col min-h-[220px]">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {vehicle.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavorite(vehicle.id);
                            }}
                            className="flex items-center gap-1 hover:scale-110 transition-transform"
                          >
                            {vehicle.favorites && <span className="text-sm text-red-500">Saved</span>}
                            <div className="flex items-center gap-1">
                              <svg
                                className={`w-5 h-5 ${vehicle.favorites ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                              <span className="text-sm text-gray-500">{vehicle.favorites ? '1' : '0'}</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <span>{vehicle.year}</span>
                        <span>•</span>
                        <span>{vehicle.mileage.toLocaleString()} mi</span>
                        <span>•</span>
                        <span>{vehicle.condition}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {vehicle.specifications?.engine && (
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            {vehicle.specifications.engine}
                          </div>
                        )}
                        {vehicle.specifications?.horsepower && (
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            {vehicle.specifications.horsepower} HP
                          </div>
                        )}
                        {vehicle.transmission && (
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            {vehicle.transmission}
                          </div>
                        )}
                        {vehicle.specifications?.range && (
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {typeof vehicle.specifications.range === 'string' ? parseInt(vehicle.specifications.range) : vehicle.specifications.range} mi
                          </div>
                        )}
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">
                          ${vehicle.price.toLocaleString()}
                        </span>
                        <Link 
                          href={`/vehicles/${vehicle.id}`}
                          className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
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
    </div>
  )
} 