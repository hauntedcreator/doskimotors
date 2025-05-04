'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import EmailModal from './EmailModal'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiClock, FiArrowRight, FiCheck, FiStar } from 'react-icons/fi'
import ContactDealerModal from '@/app/components/ContactDealerModal'
import VehicleModal from '@/app/components/VehicleModal'

// Import the vehicle store
import { Vehicle, useVehicleStore } from '@/app/store/vehicleStore'

const FeaturedVehicles = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'featured' | 'recent'>('featured')
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('')
  const [displayedVehicles, setDisplayedVehicles] = useState<Vehicle[]>([])
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [selectedVehicleForContact, setSelectedVehicleForContact] = useState<Vehicle | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Access the vehicle store
  const { vehicles = [], toggleFavorite = () => {}, incrementViews = () => {} } = useVehicleStore() || {}

  // Memoize filtered vehicles to prevent unnecessary rerenders
  useEffect(() => {
    const filterVehicles = () => {
      if (!vehicles || vehicles.length === 0) return []

      // Filter out sold vehicles first
      const availableVehicles = vehicles.filter(v => v.status !== 'sold')

      if (activeTab === 'featured') {
        // Show featured vehicles first, then fill with most viewed if needed
        const featuredVehicles = availableVehicles.filter(v => v.featured)
        
        if (featuredVehicles.length >= 8) {
          return featuredVehicles.slice(0, 8)
        } else {
          // If not enough featured vehicles, add most viewed
          const nonFeaturedSorted = availableVehicles
            .filter(v => !v.featured)
            .sort((a, b) => b.views - a.views)
          
          return [
            ...featuredVehicles,
            ...nonFeaturedSorted.slice(0, 8 - featuredVehicles.length)
          ]
        }
      } else {
        // Recent tab - sort by date added
        const sortedByDate = [...availableVehicles].sort((a, b) => {
          const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0
          const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0
          return dateB - dateA
        })
        
        return sortedByDate.slice(0, 8)
      }
    }

    const filtered = filterVehicles()
    if (filtered) {
      setDisplayedVehicles(filtered)
    }
  }, [activeTab, vehicles])

  const handleFavoriteClick = (vehicleId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!localStorage.getItem('userEmail')) {
      setSelectedVehicleId(vehicleId)
      setIsEmailModalOpen(true)
    } else {
      toggleFavorite(vehicleId)
    }
  }

  const handleEmailSubmit = (email: string) => {
    if (selectedVehicleId) {
      localStorage.setItem('userEmail', email)
      toggleFavorite(selectedVehicleId)
      setIsEmailModalOpen(false)
      setSelectedVehicleId('')
    }
  }

  // Add a handleSkipEmail function
  const handleSkipEmail = () => {
    if (selectedVehicleId) {
      toggleFavorite(selectedVehicleId)
      setIsEmailModalOpen(false)
      setSelectedVehicleId('')
    }
  }

  const handleEmailModalClose = () => {
    setIsEmailModalOpen(false)
    setSelectedVehicleId('')
  }

  const handleContactClick = (e: React.MouseEvent, vehicle: Vehicle) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedVehicleForContact(vehicle)
    setIsContactModalOpen(true)
  }

  const handleContactModalClose = () => {
    setIsContactModalOpen(false)
    setSelectedVehicleForContact(null)
  }

  // Format price with commas
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  // Get date difference in days
  const getDaysSince = (dateString?: string) => {
    if (!dateString) return null
    
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays
  }

  // Get vehicle highlights function - similar to the one in vehicles page
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

  const handleViewDetails = (vehicle: Vehicle, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Increment the view in the vehicle store
    incrementViews(vehicle.id)
    
    // Save to recently viewed in localStorage
    try {
      // Get existing recently viewed vehicles
      const storedViewed = localStorage.getItem('recentlyViewedVehicles') || '[]';
      const recentlyViewed = JSON.parse(storedViewed);
      
      // Check if this vehicle is already in the list
      const existingIndex = recentlyViewed.findIndex((v: any) => v.id === vehicle.id);
      if (existingIndex !== -1) {
        // Remove existing entry (will be added back at the top)
        recentlyViewed.splice(existingIndex, 1);
      }
      
      // Add this vehicle to the front of the list with current timestamp
      recentlyViewed.unshift({
        id: vehicle.id,
        title: vehicle.title || `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        image: vehicle.image,
        price: vehicle.price,
        timestamp: Date.now()
      });
      
      // Keep only the most recent 12 vehicles
      const trimmedList = recentlyViewed.slice(0, 12);
      
      // Save back to localStorage
      localStorage.setItem('recentlyViewedVehicles', JSON.stringify(trimmedList));
      
      // Trigger storage event for other tabs
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error saving recently viewed vehicle:', error);
    }
    
    // Create a copy with updated view count for the modal
    const updatedVehicle = {
      ...vehicle,
      views: vehicle.views + 1
    }
    
    setSelectedVehicle(updatedVehicle)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedVehicle(null)
  }

  return (
    <>
      <div className="relative w-full bg-white overflow-hidden border-none outline-none shadow-none">
        {/* Remove all visible border elements */}
        {/* Add luxury background with unified gold and blue elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Elegant gold accent in top left */}
          <motion.div 
            className="absolute top-20 left-40 w-72 h-72 rounded-full bg-amber-200/5 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          {/* Blue accent in bottom right - creates balance with gold */}
          <motion.div 
            className="absolute -bottom-20 right-40 w-96 h-96 rounded-full bg-blue-300/5 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          {/* Central gradient blend that ties gold and blue together */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-gradient-to-br from-amber-100/5 via-blue-50/5 to-blue-200/5 blur-3xl"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          {/* Extremely subtle luxury grid pattern */}
          <div className="absolute inset-0 bg-[url('/patterns/luxury-grid.svg')] opacity-[0.005] bg-repeat"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="flex flex-col items-center mb-14">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-4 relative"
            >
              {/* More elegant, luxury typography */}
              <div className="relative">
                {/* Subtle decorative element above */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 40 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-px bg-gradient-to-r from-amber-300/30 via-amber-400/60 to-amber-300/30 mx-auto mb-3"
                />
                
                {/* Premium small caps intro text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.1 }}
                  className="uppercase text-center tracking-[0.2em] text-xs font-light text-gray-500 mb-2"
                >
                  Curated Selection
                </motion.p>

                <h2 className="text-center text-4xl md:text-5xl font-extralight tracking-[0.05em] relative z-10">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-700 via-amber-500 to-blue-600">
                    LUXURY VEHICLE COLLECTION
                  </span>
                </h2>
                
                {/* Enhanced glow effect */}
                <motion.div
                  className="absolute -inset-x-6 -inset-y-4 -z-10 rounded-3xl bg-amber-50/30 mix-blend-soft-light blur-2xl"
                  animate={{
                    scale: [1, 1.03, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                
                {/* Elegant line below */}
                <div className="mt-4 mb-6 flex justify-center items-center gap-3">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: 30 }}
                    transition={{ duration: 1.5, delay: 0.4 }}
                    className="h-[1px] bg-gradient-to-r from-transparent to-amber-300"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="w-2 h-2 rounded-full border border-amber-300/50"
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: 120 }}
                    transition={{ duration: 1.5, delay: 0.4 }}
                    className="h-[1px] bg-gradient-to-r from-amber-300 to-amber-300/70"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="w-1 h-1 rounded-full bg-amber-400"
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: 30 }}
                    transition={{ duration: 1.5, delay: 0.4 }}
                    className="h-[1px] bg-gradient-to-r from-amber-300/70 to-transparent"
                  />
                </div>
              </div>
            </motion.div>
            
            <div className="bg-gradient-to-r from-amber-50 via-white to-blue-50 rounded-full shadow-sm p-1 mb-8">
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-6 py-2 rounded-full text-sm tracking-wide transition-all duration-300 ${
                  activeTab === 'featured'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md'
                    : 'text-amber-800 hover:bg-amber-50'
                }`}
              >
                FEATURED
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`px-6 py-2 rounded-full text-sm tracking-wide transition-all duration-300 ${
                  activeTab === 'recent'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                    : 'text-blue-800 hover:bg-blue-50'
                }`}
              >
                RECENTLY ADDED
              </button>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center text-gray-600 max-w-2xl mb-6 italic font-light"
            >
              {activeTab === 'featured' 
                ? 'Meticulously selected and curated Tesla vehicles, representing the pinnacle of electric luxury and performance.'
                : 'Our latest acquisitions, pristine and awaiting discerning owners who appreciate exceptional quality.'}
            </motion.p>
          </div>

          {displayedVehicles.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-pulse mb-4">
                <div className="h-32 w-32 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                  <FiClock className="h-16 w-16 text-gray-400" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No vehicles available</h3>
              <p className="text-gray-500">
                {activeTab === 'featured' 
                  ? 'No featured vehicles at the moment. Check back soon.'
                  : 'No recent vehicles added. Check back soon.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
              <AnimatePresence>
                {displayedVehicles.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    className="h-full"
                  >
                    <motion.div
                      whileHover={{ 
                        y: -8,
                        transition: { duration: 0.3 }
                      }}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col relative"
                    >
                      {/* Luxury corner accent */}
                      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden z-10 opacity-70">
                        <div className="absolute rotate-45 bg-gradient-to-r from-blue-500/20 to-blue-500/10 shadow-sm w-28 h-28 -top-14 -right-14"></div>
                      </div>
                      
                      <div 
                        className="relative pb-[60%] bg-gray-100 group cursor-pointer"
                        onClick={(e) => handleViewDetails(vehicle, e)}
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
                              alt={vehicle.title || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <img
                              src={vehicle.image}
                              alt={vehicle.title || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors z-10 flex items-center gap-1">
                          <span className="text-xs font-medium text-gray-700">{vehicle.views}</span>
                          <div className="flex items-center ml-2 mr-1">
                            <span className="text-xs font-medium text-gray-700">
                              {vehicle.favorites ? 1 : 0}
                            </span>
                          </div>
                          <button
                            onClick={(e) => handleFavoriteClick(vehicle.id, e)}
                            className="flex items-center"
                            aria-label={vehicle.favorites ? "Remove from favorites" : "Add to favorites"}
                          >
                            {vehicle.favorites ? (
                              <HeartSolidIcon className="h-5 w-5 text-red-500" />
                            ) : (
                              <HeartIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent h-20" />
                      </div>

                      <div className="p-4">
                        <h2 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                          {vehicle.title || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        </h2>
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
                        
                        {/* Subtle divider with gradient */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent my-2"></div>
                        
                        <div className="space-y-1 text-sm text-gray-500 mb-4">
                          <p>Year: {vehicle.year}</p>
                          <p>Mileage: {vehicle.mileage.toLocaleString()} miles</p>
                          <p>{vehicle.location}</p>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={(e) => handleViewDetails(vehicle, e)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                          >
                            View Details
                            <FiArrowRight className="ml-1" />
                          </button>
                          <button
                            onClick={(e) => handleContactClick(e, vehicle)}
                            className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Contact Dealer
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
        
        <div className="flex justify-center py-16">
          <Link href="/vehicles" passHref>
            <motion.button 
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
              }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden inline-flex items-center px-12 py-5 border border-amber-500/20 rounded-xl text-white font-light tracking-wider text-lg bg-gradient-to-r from-amber-600 via-amber-500 to-blue-600 transition-all shadow-lg"
            >
              <span className="z-10 relative">EXPLORE OUR COLLECTION</span>
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                className="z-10 relative ml-3 inline-block"
              >
                <FiArrowRight size={20} />
              </motion.span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-600 via-amber-600 to-blue-500 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Button shine effect */}
              <motion.div 
                className="absolute top-0 -left-[100%] w-[80%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ 
                  left: ['150%']
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 4
                }}
              />
            </motion.button>
          </Link>
        </div>
      </div>
      
      {isModalOpen && selectedVehicle && (
        <VehicleModal
          vehicle={selectedVehicle}
          onClose={handleCloseModal}
        />
      )}

      {isEmailModalOpen && (
        <EmailModal
          onClose={handleEmailModalClose}
          onSubmit={handleEmailSubmit}
          onSkip={handleSkipEmail}
          subject="Save This Vehicle to Favorites"
          message="Enter your email to save this vehicle to your favorites and get updates when the price changes."
        />
      )}

      {isContactModalOpen && selectedVehicleForContact && (
        <ContactDealerModal
          isOpen={isContactModalOpen}
          onClose={handleContactModalClose}
          vehicleInfo={{
            id: selectedVehicleForContact.id,
            title: selectedVehicleForContact.title,
            price: selectedVehicleForContact.price,
            year: selectedVehicleForContact.year,
            make: selectedVehicleForContact.make,
            model: selectedVehicleForContact.model
          }}
        />
      )}
    </>
  )
}

export default FeaturedVehicles 