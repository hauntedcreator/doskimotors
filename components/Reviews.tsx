'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaStar, FaStarHalfAlt } from 'react-icons/fa'
import Image from 'next/image'
import { GoogleReview } from '@/app/api/google-reviews/route'
import Link from 'next/link'
import { useVehicleStore } from '@/app/store/vehicleStore'
import { FiClock, FiArrowRight } from 'react-icons/fi'
import VehicleModal from '@/app/components/VehicleModal'

// Interface for recently viewed vehicles
interface RecentlyViewedVehicle {
  id: string;
  title: string;
  image: string;
  price: number;
  timestamp: number;
}

const Reviews = () => {
  // State for reviews and rating
  const [googleReviews, setGoogleReviews] = useState<GoogleReview[]>([]);
  const [totalRating, setTotalRating] = useState(4.7);
  const [totalReviews, setTotalReviews] = useState(47);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for active review group (for mobile)
  const [activeIndex, setActiveIndex] = useState(0);
  const reviewsPerGroup = 3;
  const totalGroups = Math.ceil(googleReviews.length / reviewsPerGroup);

  // Add state for recently viewed vehicles
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedVehicle[]>([]);
  
  // Get vehicles from store to find full details when needed
  const { vehicles = [], incrementViews = () => {} } = useVehicleStore() || {};
  
  // State for vehicle modal
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to change active review group
  const changeGroup = (index: number) => {
    setActiveIndex(index);
  };

  // Fetch Google reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/google-reviews');
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        
        const data = await response.json();
        setGoogleReviews(data.reviews || []);
        setTotalRating(data.totalRating || 4.7);
        setTotalReviews(data.totalReviews || 47);
        setError(null);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReviews();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalGroups);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalGroups]);

  // Load recently viewed vehicles from localStorage
  useEffect(() => {
    const loadRecentlyViewed = () => {
      try {
        const stored = localStorage.getItem('recentlyViewedVehicles');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Sort by most recent first and limit to most recent 4
          const sorted = parsed.sort((a: RecentlyViewedVehicle, b: RecentlyViewedVehicle) => 
            b.timestamp - a.timestamp
          ).slice(0, 4);
          setRecentlyViewed(sorted);
        }
      } catch (error) {
        console.error('Error loading recently viewed vehicles:', error);
      }
    };
    
    loadRecentlyViewed();
    
    // Set up event listener for storage changes (in case vehicle is viewed in another tab)
    window.addEventListener('storage', loadRecentlyViewed);
    
    return () => {
      window.removeEventListener('storage', loadRecentlyViewed);
    };
  }, []);

  // Render star rating with half stars
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="w-5 h-5" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="w-5 h-5" />);
    }
    
    // Add remaining empty stars to make 5 total
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }
    
    return stars;
  };

  // Add handler to open the vehicle modal
  const handleViewDetails = (vehicleId: string) => {
    // Find the full vehicle details from the store
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      incrementViews(vehicle.id);
      setSelectedVehicle(vehicle);
      setIsModalOpen(true);
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  return (
    <section id="testimonials" className="py-16 relative overflow-hidden bg-white">
      {/* Unified background with gold and blue elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute inset-0 bg-[url('/patterns/luxury-grid.svg')] opacity-[0.005] bg-repeat"></div>
        
        {/* Blue accent on left side */}
        <motion.div 
          className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-blue-300/5 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Gold accent on right side */}
        <motion.div 
          className="absolute -bottom-20 right-20 w-72 h-72 rounded-full bg-amber-200/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Central gradient blend that ties gold and blue together */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-amber-100/5 via-blue-50/5 to-blue-200/5 blur-3xl"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Smooth white gradient at the top for seamless transition */}
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-white via-white to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-4 relative"
          >
            {/* More elegant, luxury typography to match vehicle collection */}
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
                Voices of Trust
              </motion.p>

              <h2 className="text-center text-4xl md:text-5xl font-extralight tracking-[0.05em] relative z-10">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-700 via-amber-500 to-blue-600">
                  CLIENT TESTIMONIALS
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
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="flex text-amber-400">
              {renderRating(totalRating)}
            </div>
            <span className="text-lg font-light tracking-wide text-gray-700">
              4.7 Rating on Google
            </span>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg text-gray-600 italic font-light"
          >
            The voice of our clients is our greatest endorsement
          </motion.p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-xl bg-gray-200 h-48 w-72"></div>
              <div className="rounded-xl bg-gray-200 h-48 w-72"></div>
              <div className="rounded-xl bg-gray-200 h-48 w-72"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{error}</p>
          </div>
        ) : (
          <>
            {/* Desktop continuous carousel */}
            <div className="relative overflow-hidden mb-12 hidden md:block">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
              </div>

              <motion.div
                className="flex space-x-6"
                animate={{
                  x: [-2000, -6000],
                }}
                transition={{
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {/* Double the reviews for seamless loop */}
                {[...googleReviews, ...googleReviews, ...googleReviews].map((review, index) => (
                  <motion.div
                    key={`${review.author_name}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 % 1 }}
                    whileHover={{ 
                      y: -5, 
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                    className="flex-shrink-0 w-[350px] bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 relative overflow-hidden"
                  >
                    {/* Luxury corner accent - blend gold and blue */}
                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute rotate-45 bg-gradient-to-r from-amber-500/10 to-blue-500/5 shadow-sm w-24 h-24 -top-12 -right-12"></div>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {renderRating(review.rating)}
                      </div>
                      <span className="ml-2 text-gray-600 text-sm">
                        {review.relative_time_description}
                      </span>
                    </div>
                    
                    {/* Subtle divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent my-3"></div>
                    
                    <p className="text-gray-700 mb-4 line-clamp-3">{review.text}</p>
                    <div className="flex items-center">
                      {review.profile_photo_url && review.profile_photo_url !== '/avatars/default.png' ? (
                        <Image 
                          src={review.profile_photo_url} 
                          alt={review.author_name} 
                          width={32} 
                          height={32} 
                          className="rounded-full mr-3"
                        />
                      ) : (
                        <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-3">
                          {review.author_name.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <p className="font-medium text-gray-900">{review.author_name}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Mobile swiper */}
            <div className="md:hidden">
              <div className="relative">
                <div className="overflow-hidden">
                  <motion.div
                    className="flex"
                    animate={{ x: `-${activeIndex * 100}%` }}
                    transition={{ duration: 0.5 }}
                  >
                    <AnimatePresence>
                      {Array.from({ length: totalGroups }).map((_, groupIndex) => (
                        <motion.div 
                          key={groupIndex} 
                          className="w-full flex-shrink-0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="grid gap-4">
                            {googleReviews
                              .slice(
                                groupIndex * reviewsPerGroup,
                                groupIndex * reviewsPerGroup + reviewsPerGroup
                              )
                              .map((review, reviewIndex) => (
                                <motion.div
                                  key={`${review.author_name}-${reviewIndex}`}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ 
                                    duration: 0.5, 
                                    delay: reviewIndex * 0.1 
                                  }}
                                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                                >
                                  <div className="flex items-center mb-2">
                                    <div className="flex text-yellow-400">
                                      {renderRating(review.rating)}
                                    </div>
                                    <span className="ml-2 text-gray-600 text-xs">
                                      {review.relative_time_description}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 mb-2 text-sm line-clamp-3">{review.text}</p>
                                  <div className="flex items-center">
                                    {review.profile_photo_url && review.profile_photo_url !== '/avatars/default.png' ? (
                                      <Image 
                                        src={review.profile_photo_url} 
                                        alt={review.author_name} 
                                        width={24} 
                                        height={24} 
                                        className="rounded-full mr-2"
                                      />
                                    ) : (
                                      <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-2 text-xs">
                                        {review.author_name.charAt(0).toUpperCase()}
                                      </span>
                                    )}
                                    <p className="font-medium text-gray-900 text-sm">{review.author_name}</p>
                                  </div>
                                </motion.div>
                              ))}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>

              {/* Pagination dots */}
              {totalGroups > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                  {Array.from({ length: totalGroups }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => changeGroup(index)}
                      className={`w-2 h-2 rounded-full ${
                        activeIndex === index ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Recently Viewed Vehicles Section */}
            {recentlyViewed.length > 0 && (
              <div className="mt-20 pt-16 border-t border-gray-100">
                {/* Section Heading */}
                <div className="text-center mb-10">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-4 relative"
                  >
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
                        Continue Your Journey
                      </motion.p>

                      <h2 className="text-center text-3xl font-extralight tracking-[0.05em] relative z-10">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-700 via-amber-500 to-blue-600">
                          RECENTLY VIEWED VEHICLES
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
                          className="h-[1px] bg-gradient-to-r from-amber-300 to-blue-300/70"
                        />
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.6, delay: 0.8 }}
                          className="w-1 h-1 rounded-full bg-blue-400"
                        />
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: 30 }}
                          transition={{ duration: 1.5, delay: 0.4 }}
                          className="h-[1px] bg-gradient-to-r from-blue-300/70 to-transparent"
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Vehicles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recentlyViewed.map((vehicle, index) => (
                    <motion.div
                      key={vehicle.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        ease: "easeOut"
                      }}
                    >
                      <div 
                        onClick={() => handleViewDetails(vehicle.id)}
                        className="cursor-pointer"
                      >
                        <motion.div
                          whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                          className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm h-full flex flex-col relative group cursor-pointer"
                        >
                          {/* Luxury corner accent - blend gold and blue */}
                          <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden z-10">
                            <div className="absolute rotate-45 bg-gradient-to-r from-amber-500/10 to-blue-500/5 shadow-sm w-16 h-16 -top-8 -right-8"></div>
                          </div>
                          
                          {/* Recently viewed indicator */}
                          <div className="absolute top-2 left-2 z-10 flex items-center px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full">
                            <FiClock className="h-3 w-3 text-amber-600" />
                            <span className="ml-1 text-[10px] uppercase tracking-wider text-gray-700 font-light">Recently Viewed</span>
                          </div>
                          
                          <div className="relative pb-[60%] bg-gray-100">
                            <div className="absolute inset-0">
                              {vehicle.image.startsWith('http') ? (
                                <Image
                                  src={vehicle.image}
                                  alt={vehicle.title}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-400">No Image</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-4 flex-grow">
                            <h3 className="font-medium text-gray-900 mb-1 line-clamp-1 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                              {vehicle.title}
                            </h3>
                            <p className="text-blue-600 font-semibold">${vehicle.price.toLocaleString()}</p>
                          </div>
                          
                          <div className="px-4 pb-4 mt-auto">
                            <div className="w-full bg-gradient-to-r from-amber-500 to-blue-600 p-[1px] rounded-md">
                              <div className="flex items-center justify-center bg-white text-center w-full py-1.5 rounded-[3px] text-sm">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-blue-700 font-medium">View Details</span>
                                <FiArrowRight className="ml-2 h-3.5 w-3.5 text-amber-600" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Vehicle Modal */}
      {isModalOpen && selectedVehicle && (
        <VehicleModal 
          vehicle={selectedVehicle} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      )}
    </section>
  )
}

export default Reviews 