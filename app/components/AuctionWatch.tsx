'use client'

import { useState, useEffect } from 'react'
import { FiExternalLink, FiStar, FiPlusCircle, FiTrendingUp, FiCalendar, FiDollarSign, FiClock, FiAlertCircle, FiInfo } from 'react-icons/fi'
import { FaCoins, FaCarCrash, FaTruck } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useVehicleStore } from '../store/vehicleStore'
import AuctionImportModal from './AuctionImportModal'
import { toast } from 'react-hot-toast'

export interface AuctionVehicle {
  id: string
  source: 'copart' | 'iaai'
  title: string
  make: string
  model: string
  year: number
  vin: string
  lot: string
  damageType?: string
  estimatedValue?: number
  currentBid?: number
  auctionDate: string
  auctionEndTime?: string
  imageUrl: string
  location: string
  odometer?: number
  primaryDamage?: string
  secondaryDamage?: string
  driveableCertification?: 'yes' | 'no' | 'unknown'
  isFavorite: boolean
  link: string
  keys?: 'yes' | 'no' | 'unknown'
  cylinders?: number
  fuelType?: string
  transmission?: string
  color?: string
  isBuyNow?: boolean
  buyNowPrice?: number
  saleStatus?: 'upcoming' | 'live' | 'ended'
  isGoodDeal?: boolean
  dealScore?: number
  dealReason?: string
}

// Demo data to populate the component
const demoAuctions: AuctionVehicle[] = [
  {
    id: '1',
    source: 'copart',
    title: 'Tesla Model 3 Dual Motor',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    vin: '5YJ3E1EA5PF123456',
    lot: 'C12345',
    damageType: 'Front End',
    estimatedValue: 39000,
    currentBid: 24500,
    auctionDate: '2025-05-15T14:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    location: 'San Diego, CA',
    odometer: 12500,
    primaryDamage: 'Front End',
    secondaryDamage: 'Undercarriage',
    driveableCertification: 'yes',
    isFavorite: true,
    link: 'https://www.copart.com',
    keys: 'yes',
    cylinders: 0,
    fuelType: 'Electric',
    transmission: 'Automatic',
    color: 'White',
    saleStatus: 'upcoming'
  },
  {
    id: '2',
    source: 'iaai',
    title: 'Tesla Model Y Long Range',
    make: 'Tesla',
    model: 'Model Y',
    year: 2022,
    vin: '5YJYGDEE1MF123789',
    lot: 'I45678',
    damageType: 'Side',
    estimatedValue: 44500,
    currentBid: 28000,
    auctionDate: '2025-05-14T10:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1617704548623-340376564e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80',
    location: 'Phoenix, AZ',
    odometer: 8750,
    primaryDamage: 'Side',
    secondaryDamage: 'Wheels',
    driveableCertification: 'yes',
    isFavorite: false,
    link: 'https://www.iaai.com',
    keys: 'yes',
    cylinders: 0,
    fuelType: 'Electric',
    transmission: 'Automatic',
    color: 'Red',
    saleStatus: 'live'
  },
  {
    id: '3',
    source: 'copart',
    title: 'Tesla Model S Plaid',
    make: 'Tesla',
    model: 'Model S',
    year: 2022,
    vin: '5YJSA1E43MF123456',
    lot: 'C78901',
    damageType: 'Rear End',
    estimatedValue: 89000,
    currentBid: 52000,
    auctionDate: '2025-05-16T09:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: 'Los Angeles, CA',
    odometer: 15200,
    primaryDamage: 'Rear End',
    secondaryDamage: 'Electrical',
    driveableCertification: 'no',
    isFavorite: false,
    link: 'https://www.copart.com',
    keys: 'yes',
    cylinders: 0,
    fuelType: 'Electric',
    transmission: 'Automatic',
    color: 'Black',
    saleStatus: 'upcoming'
  },
  {
    id: '4',
    source: 'iaai',
    title: 'Tesla Model X Performance',
    make: 'Tesla',
    model: 'Model X',
    year: 2021,
    vin: '5YJXCBE21MF123456',
    lot: 'I23456',
    damageType: 'Flood',
    estimatedValue: 72000,
    currentBid: 31000,
    auctionDate: '2025-05-13T11:45:00Z',
    auctionEndTime: '2025-05-13T12:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1566055909643-a51b4271d9f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    location: 'Miami, FL',
    odometer: 28000,
    primaryDamage: 'Flood',
    secondaryDamage: 'Electrical',
    driveableCertification: 'no',
    isFavorite: true,
    link: 'https://www.iaai.com',
    keys: 'no',
    cylinders: 0,
    fuelType: 'Electric',
    transmission: 'Automatic',
    color: 'Blue',
    isBuyNow: true,
    buyNowPrice: 39000,
    saleStatus: 'ended'
  }
];

export default function AuctionWatch() {
  const { addVehicle } = useVehicleStore()
  const [auctions, setAuctions] = useState<AuctionVehicle[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showRoiCalculator, setShowRoiCalculator] = useState(false)
  const [selectedAuction, setSelectedAuction] = useState<AuctionVehicle | null>(null)
  const [roiData, setRoiData] = useState({
    estimatedRepairCost: 0,
    estimatedListPrice: 0,
    auctionFees: 0,
    transportCost: 0
  })
  const [showImportModal, setShowImportModal] = useState(false)
  const [importAuction, setImportAuction] = useState<AuctionVehicle | null>(null)
  const [searchQuery, setSearchQuery] = useState('tesla')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null)
  const [goodDealsCount, setGoodDealsCount] = useState(0)
  const [insights, setInsights] = useState<any>(null);
  const [insightsLoading, setInsightsLoading] = useState(true);

  useEffect(() => {
    // Load auctions when component mounts
    fetchAuctions(true, true); // Force refresh on initial load
    fetchInsights();
    
    // Set up polling for auction updates every 2 minutes
    const auctionIntervalId = setInterval(() => {
      fetchAuctions(false);
    }, 2 * 60 * 1000);
    
    // Set up polling for insights updates every 10 minutes
    const insightsIntervalId = setInterval(() => {
      fetchInsights(false);
    }, 10 * 60 * 1000);
    
    return () => {
      clearInterval(auctionIntervalId);
      clearInterval(insightsIntervalId);
    };
  }, []);

  const fetchAuctions = async (showLoadingState = true, forceRefresh = false) => {
    if (showLoadingState) {
      setLoading(true);
    }
    
    try {
      setError(null);
      
      // Use the alternate API as primary to avoid Cheerio-related issues
      console.log("Fetching auction data from alternate API...");
      const alternateResponse = await fetch(`/api/auctions/alternate?make=${encodeURIComponent(searchQuery.split(' ')[0])}&model=${encodeURIComponent(searchQuery.split(' ').slice(1).join(' '))}&refresh=${forceRefresh ? 'true' : 'false'}`);
      
      if (!alternateResponse.ok) {
        throw new Error(`Error fetching auction data: ${alternateResponse.status}`);
      }
      
      const alternateData = await alternateResponse.json();
      
      // Set the data regardless of source - even simulated data will have consistent real links
      setAuctions(alternateData.data);
      setLastFetchTime(new Date());
      
      // Count good deals
      const goodDeals = alternateData.data.filter((auction: AuctionVehicle) => auction.isGoodDeal);
      setGoodDealsCount(goodDeals.length);
      
      if (alternateData.source === 'real') {
        toast.success('Live auction data loaded!');
      } else if (alternateData.source === 'cache') {
        toast.success('Using cached auction data');
      } else if (alternateData.source === 'simulated') {
        toast.success('Using simulated auction data');
      }
      
    } catch (err) {
      console.error('Error fetching auction data:', err);
      setError('Failed to load auction data. Trying fallback methods...');
      
      // Try the original direct API as fallback
      try {
        console.log("Trying direct API...");
        const response = await fetch(`/api/auctions/direct?make=${encodeURIComponent(searchQuery.split(' ')[0])}&model=${encodeURIComponent(searchQuery.split(' ').slice(1).join(' '))}&refresh=true`);
        
        if (response.ok) {
          const data = await response.json();
          setAuctions(data.data);
          setLastFetchTime(new Date());
          
          // Count good deals
          const goodDeals = data.data.filter((auction: AuctionVehicle) => auction.isGoodDeal);
          setGoodDealsCount(goodDeals.length);
          
          toast.success('Using data from direct API');
          setError(null);
        } else {
          // If all else fails, use demo data
          setAuctions(demoAuctions);
          toast.error('Failed to fetch live data. Using demo data.');
        }
      } catch (fallbackErr) {
        console.error('All API attempts failed:', fallbackErr);
        // Fall back to demo data if all APIs fail
        setAuctions(demoAuctions);
        toast.error('All auction data sources failed. Using demo data.');
      }
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const fetchInsights = async (showLoadingState = true) => {
    if (showLoadingState) {
      setInsightsLoading(true);
    }
    
    try {
      const response = await fetch('/api/auctions/insights');
      
      if (!response.ok) {
        throw new Error(`Error fetching market insights: ${response.status}`);
      }
      
      const data = await response.json();
      setInsights(data.data);
      
    } catch (err) {
      console.error('Error fetching market insights:', err);
      // We'll handle this silently and keep any previous insights data
    } finally {
      setInsightsLoading(false);
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    fetchAuctions();
  };

  // Filter auctions based on selected filter
  const filteredAuctions = auctions.filter(auction => {
    if (filter === 'all') return true
    if (filter === 'copart') return auction.source === 'copart'
    if (filter === 'iaai') return auction.source === 'iaai'
    if (filter === 'favorite') return auction.isFavorite
    if (filter === 'upcoming') return new Date(auction.auctionDate) > new Date()
    if (filter === 'live') return auction.saleStatus === 'live'
    if (filter === 'good-deals') return auction.isGoodDeal
    return true
  })

  const toggleFavorite = (id: string) => {
    setAuctions(auctions.map(auction => 
      auction.id === id ? { ...auction, isFavorite: !auction.isFavorite } : auction
    ))
  }

  const refreshAuctions = async () => {
    setLoading(true)
    try {
      await fetchAuctions(true, true); // Force refresh when manually refreshing
      toast.success('Auction data refreshed');
    } catch (error) {
      console.error('Error refreshing auctions:', error);
      toast.error('Failed to refresh auction data');
    }
  }

  const calculateRoi = (auction: AuctionVehicle) => {
    setSelectedAuction(auction)
    setRoiData({
      estimatedRepairCost: auction.damageType === 'Flood' ? 12000 : 
                           auction.damageType === 'Front End' ? 8000 :
                           auction.damageType === 'Rear End' ? 6000 : 4000,
      estimatedListPrice: auction.estimatedValue || 0,
      auctionFees: Math.round((auction.currentBid || 0) * 0.1),
      transportCost: 1200
    })
    setShowRoiCalculator(true)
  }

  const getTotalCost = () => {
    const purchasePrice = selectedAuction?.currentBid || 0
    return purchasePrice + roiData.estimatedRepairCost + roiData.auctionFees + roiData.transportCost
  }

  const getEstimatedProfit = () => {
    return roiData.estimatedListPrice - getTotalCost()
  }

  const getProfitMargin = () => {
    const profit = getEstimatedProfit()
    const totalCost = getTotalCost()
    return totalCost > 0 ? (profit / totalCost) * 100 : 0
  }

  const handleImportVehicle = (auction: AuctionVehicle) => {
    setImportAuction(auction)
    setShowImportModal(true)
  }

  const handleImportComplete = (vehicleData: any) => {
    try {
      addVehicle(vehicleData)
      setShowImportModal(false)
      toast.success('Vehicle successfully imported to inventory')
    } catch (error) {
      console.error('Error importing vehicle:', error)
      toast.error('Failed to import vehicle to inventory')
    }
  }

  const handleViewAuction = (url: string, auction: AuctionVehicle) => {
    // Ensure URL is valid before opening
    try {
      // Make sure URL is absolute
      if (url.startsWith('http')) {
        // Open URL in a new tab
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        // Fallback for invalid URLs - construct a valid one based on the auction source
        let fallbackUrl;
        if (auction.source === 'copart') {
          fallbackUrl = `https://www.copart.com/lot/${auction.lot}`;
        } else {
          fallbackUrl = `https://www.iaai.com/Vehicle/Details/${auction.lot}`;
        }
        window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
        
        // Notify user that we're using a fallback URL
        toast.success('Using direct link to auction site');
      }
    } catch (err) {
      console.error('Error opening auction URL:', err);
      toast.error('Unable to open auction page. Please try again later.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Tesla Auction Watch</h2>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              Track and monitor Tesla auctions from Copart and IAAI
              {lastFetchTime && (
                <span className="text-xs text-gray-400">
                  Last updated: {lastFetchTime.toLocaleTimeString()}
                </span>
              )}
              {goodDealsCount > 0 && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full animate-pulse">
                  {goodDealsCount} good {goodDealsCount === 1 ? 'deal' : 'deals'} found
                </span>
              )}
              <button 
                onClick={() => fetchAuctions(true, true)} 
                className="ml-2 text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Force refresh
              </button>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search make, model..."
                className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                disabled={isSearching}
                className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('copart')}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  filter === 'copart' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Copart
              </button>
              <button 
                onClick={() => setFilter('iaai')}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  filter === 'iaai' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                IAAI
              </button>
              <button 
                onClick={() => setFilter('favorite')}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  filter === 'favorite' 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Favorites
              </button>
              <button 
                onClick={() => setFilter('live')}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  filter === 'live' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Live Auctions
              </button>
              <button 
                onClick={() => setFilter('good-deals')}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  filter === 'good-deals' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Good Deals
              </button>
              <button 
                onClick={refreshAuctions}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh Auctions'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {loading && filteredAuctions.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900">Loading auction data...</h3>
            <p className="mt-1 text-sm text-gray-500">This may take a moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAuctions.map(auction => (
              <motion.div 
                key={auction.id}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                  auction.isGoodDeal ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-200'
                }`}
              >
                <div className="relative">
                  <img 
                    src={auction.imageUrl} 
                    alt={auction.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${
                      auction.source === 'copart' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {auction.source}
                    </span>
                    {auction.saleStatus === 'live' && (
                      <span className="px-2 py-1 text-xs font-bold uppercase rounded bg-green-600 text-white animate-pulse">
                        LIVE NOW
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => toggleFavorite(auction.id)}
                    className={`absolute top-2 left-2 p-1.5 rounded-full ${
                      auction.isFavorite ? 'bg-amber-400 text-white' : 'bg-white text-gray-400 hover:text-amber-400'
                    }`}
                  >
                    <FiStar className={`w-5 h-5 ${auction.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  
                  {auction.isGoodDeal && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-900 to-transparent p-3">
                      <div className="flex items-center">
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded flex items-center mr-2">
                          <FaCoins className="mr-1" /> GOOD DEAL
                        </span>
                        <span className="text-white text-xs truncate">
                          {auction.dealReason}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{auction.title}</h3>
                    {auction.isBuyNow && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Buy Now
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="font-medium mr-2">{auction.year}</span>
                    <span className="mr-2">•</span>
                    <span className="mr-2">Lot #{auction.lot}</span>
                    <span className="mr-2">•</span>
                    <span>{auction.location}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center text-sm">
                      <FaCarCrash className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-gray-700">{auction.primaryDamage || 'Unknown Damage'}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FiTrendingUp className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-gray-700">{auction.odometer?.toLocaleString() || 'N/A'} mi</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FiCalendar className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">{new Date(auction.auctionDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FiClock className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">{new Date(auction.auctionDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4 pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-500">Current Bid</span>
                      <div className="text-xl font-bold text-gray-900">${auction.currentBid?.toLocaleString()}</div>
                    </div>
                    {auction.estimatedValue && (
                      <div className="text-right">
                        <span className="text-xs text-gray-500">Est. Value</span>
                        <div className="text-lg font-medium text-gray-700">${auction.estimatedValue.toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between space-x-3">
                    <button 
                      onClick={() => handleViewAuction(auction.link, auction)}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center"
                    >
                      <FiExternalLink className="mr-1.5" /> View Auction
                    </button>
                    <button 
                      onClick={() => calculateRoi(auction)}
                      className="flex-1 py-2 px-3 bg-white hover:bg-gray-50 text-gray-800 text-sm font-medium rounded-md border border-gray-300 transition-colors flex items-center justify-center"
                    >
                      <FaCoins className="mr-1.5" /> ROI Calculator
                    </button>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <button 
                      onClick={() => handleImportVehicle(auction)}
                      className="w-full py-2 px-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center"
                    >
                      <FiPlusCircle className="mr-1.5" /> Add to Inventory
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {!loading && filteredAuctions.length === 0 && (
          <div className="py-12 text-center">
            <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No auctions found</h3>
            <p className="mt-1 text-sm text-gray-500">Try changing your filters or check back later for new auctions.</p>
          </div>
        )}
      </div>

      {/* ROI Calculator Modal */}
      {showRoiCalculator && selectedAuction && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                ROI Calculator: {selectedAuction.year} {selectedAuction.make} {selectedAuction.model}
              </h3>
              <button 
                onClick={() => setShowRoiCalculator(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <img 
                    src={selectedAuction.imageUrl} 
                    alt={selectedAuction.title} 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lot #:</span>
                      <span className="font-medium">{selectedAuction.lot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Source:</span>
                      <span className="font-medium uppercase">{selectedAuction.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Bid:</span>
                      <span className="font-medium">${selectedAuction.currentBid?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Auction Date:</span>
                      <span className="font-medium">{new Date(selectedAuction.auctionDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Damage:</span>
                      <span className="font-medium">{selectedAuction.primaryDamage}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Repair Cost
                    </label>
                    <div className="flex items-center">
                      <span className="bg-gray-100 px-3 py-2 text-gray-500 rounded-l-md border border-r-0 border-gray-300">$</span>
                      <input
                        type="number"
                        value={roiData.estimatedRepairCost}
                        onChange={(e) => setRoiData({...roiData, estimatedRepairCost: parseInt(e.target.value) || 0})}
                        className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 border border-gray-300 rounded-r-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated List Price (After Repair)
                    </label>
                    <div className="flex items-center">
                      <span className="bg-gray-100 px-3 py-2 text-gray-500 rounded-l-md border border-r-0 border-gray-300">$</span>
                      <input
                        type="number"
                        value={roiData.estimatedListPrice}
                        onChange={(e) => setRoiData({...roiData, estimatedListPrice: parseInt(e.target.value) || 0})}
                        className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 border border-gray-300 rounded-r-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Auction Fees
                    </label>
                    <div className="flex items-center">
                      <span className="bg-gray-100 px-3 py-2 text-gray-500 rounded-l-md border border-r-0 border-gray-300">$</span>
                      <input
                        type="number"
                        value={roiData.auctionFees}
                        onChange={(e) => setRoiData({...roiData, auctionFees: parseInt(e.target.value) || 0})}
                        className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 border border-gray-300 rounded-r-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transport Cost
                    </label>
                    <div className="flex items-center">
                      <span className="bg-gray-100 px-3 py-2 text-gray-500 rounded-l-md border border-r-0 border-gray-300">$</span>
                      <input
                        type="number"
                        value={roiData.transportCost}
                        onChange={(e) => setRoiData({...roiData, transportCost: parseInt(e.target.value) || 0})}
                        className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 border border-gray-300 rounded-r-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Purchase Price:</span>
                      <span className="font-medium">${selectedAuction.currentBid?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">+ Repair Cost:</span>
                      <span className="font-medium">${roiData.estimatedRepairCost.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">+ Auction Fees:</span>
                      <span className="font-medium">${roiData.auctionFees.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">+ Transport Cost:</span>
                      <span className="font-medium">${roiData.transportCost.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-200">
                      <span className="text-gray-800 font-medium">Total Investment:</span>
                      <span className="font-bold text-lg">${getTotalCost().toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Estimated Sale Price:</span>
                      <span className="font-medium">${roiData.estimatedListPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">- Total Cost:</span>
                      <span className="font-medium">${getTotalCost().toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-200">
                      <span className="text-gray-800 font-medium">Estimated Profit:</span>
                      <span className={`font-bold text-lg ${getEstimatedProfit() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${getEstimatedProfit().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-200">
                      <span className="text-gray-800 font-medium">Profit Margin:</span>
                      <span className={`font-bold text-lg ${getProfitMargin() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {getProfitMargin().toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => setShowRoiCalculator(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // In a full implementation, this would add to inventory or save for later
                    alert('This feature would add the vehicle to your import list in a full implementation');
                    setShowRoiCalculator(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FiPlusCircle className="mr-1.5" /> Add to Import List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Purchases & Market Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Purchases</h3>
          
          {insightsLoading && !insights ? (
            <div className="py-8 text-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Loading purchase history...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {insights && insights.recentPurchases ? (
                insights.recentPurchases.map((purchase: any, idx: number) => (
                  <div key={idx} className="py-4 flex items-center">
                    <img 
                      src={getModelImage(purchase.title)}
                      alt={purchase.title} 
                      className="w-16 h-16 object-cover rounded mr-4" 
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{purchase.title}</h4>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>Purchased: {formatDate(purchase.purchaseDate)}</span>
                        <span>•</span>
                        <span>{purchase.source}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">${purchase.price?.toLocaleString()}</div>
                      <span className={`text-sm ${purchase.status === 'Added to inventory' ? 'text-green-600' : 'text-blue-600'}`}>{purchase.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1536700503339-1e4b06520771?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Tesla Model S" 
                    className="w-16 h-16 object-cover rounded mr-4" 
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Tesla Model S Long Range</h4>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>Purchased: 04/28/2025</span>
                      <span>•</span>
                      <span>Copart</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">$38,500</div>
                    <span className="text-sm text-green-600">Added to inventory</span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Purchase History →
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h3>
          
          {insightsLoading && !insights ? (
            <div className="py-8 text-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Loading market insights...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights && insights.opportunityAlerts ? (
                insights.opportunityAlerts.map((alert: any, idx: number) => (
                  <div 
                    key={idx} 
                    className={`rounded-lg p-4 ${
                      alert.type === 'positive' ? 'bg-green-50' : 
                      alert.type === 'warning' ? 'bg-amber-50' : 
                      'bg-blue-50'
                    }`}
                  >
                    <h4 className={`font-medium mb-2 ${
                      alert.type === 'positive' ? 'text-green-800' : 
                      alert.type === 'warning' ? 'text-amber-800' : 
                      'text-blue-800'
                    }`}>{alert.title}</h4>
                    <p className={`text-sm mb-2 ${
                      alert.type === 'positive' ? 'text-green-700' : 
                      alert.type === 'warning' ? 'text-amber-700' : 
                      'text-blue-700'
                    }`}>{alert.description}</p>
                    <div className={`flex items-center text-xs ${
                      alert.type === 'positive' ? 'text-green-600' : 
                      alert.type === 'warning' ? 'text-amber-600' : 
                      'text-blue-600'
                    }`}>
                      {alert.type === 'positive' ? (
                        <FiTrendingUp className="mr-1.5" />
                      ) : alert.type === 'warning' ? (
                        <FiAlertCircle className="mr-1.5" />
                      ) : (
                        <FiInfo className="mr-1.5" />
                      )}
                      <span>Based on {alert.basedOn}</span>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Tesla Model 3 Prices</h4>
                    <p className="text-sm text-blue-700 mb-2">Average auction prices are down 8.2% in the last 30 days, making it a good time to buy.</p>
                    <div className="flex items-center text-xs text-blue-600">
                      <FiTrendingUp className="mr-1.5" />
                      <span>Based on 47 recent auctions</span>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">Opportunity Alert</h4>
                    <p className="text-sm text-green-700 mb-2">Model Y vehicles with front-end damage have a 22% higher profit margin after repairs.</p>
                    <div className="flex items-center text-xs text-green-600">
                      <FiDollarSign className="mr-1.5" />
                      <span>Based on your recent purchase history</span>
                    </div>
                  </div>
                </>
              )}
              
              {insights && insights.summary && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-purple-800 mb-2">Market Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-purple-700">Total Available:</span>
                      <span className="ml-1 font-medium">{insights.summary.totalAvailable} Tesla vehicles</span>
                    </div>
                    <div>
                      <span className="text-purple-700">Avg. Discount:</span>
                      <span className="ml-1 font-medium">{insights.summary.averageDiscount}% below retail</span>
                    </div>
                    <div>
                      <span className="text-purple-700">Best Model:</span>
                      <span className="ml-1 font-medium">{insights.summary.bestModelToBuy}</span>
                    </div>
                    <div>
                      <span className="text-purple-700">Market:</span>
                      <span className="ml-1 font-medium capitalize">{insights.summary.marketTrend}'s market</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && importAuction && (
        <AuctionImportModal
          auction={importAuction}
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleImportComplete}
        />
      )}
    </div>
  )
}

// Helper functions
function formatDate(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: '2-digit', 
    day: '2-digit', 
    year: 'numeric'
  });
}

function getModelImage(title: string) {
  if (title.includes('Model 3')) {
    return 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80';
  } else if (title.includes('Model Y')) {
    return 'https://images.unsplash.com/photo-1617704548623-340376564e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80';
  } else if (title.includes('Model S')) {
    return 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
  } else {
    return 'https://images.unsplash.com/photo-1566055909643-a51b4271d9f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80';
  }
} 