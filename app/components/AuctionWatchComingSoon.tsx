'use client'

import { FiAlertCircle, FiTrendingUp, FiClock } from 'react-icons/fi'

export default function AuctionWatchComingSoon() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Tesla Auction Watch</h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Coming Soon</span>
      </div>
      
      <div className="p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 mb-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
          <FiClock className="h-8 w-8" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">Tesla Auction Listings Coming Soon</h3>
        <p className="text-gray-600 mb-6 max-w-md">
          We're working on bringing you live Tesla auction listings from Copart and IAAI. 
          In the meantime, please use our ROI Calculator to analyze potential auction purchases.
        </p>
        
        <div className="flex items-center justify-center">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start">
            <FiAlertCircle className="text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-800 mb-1">Live Auction Watch Under Development</h4>
              <p className="text-sm text-amber-700">
                Our development team is working on integrating API access to live auction data. 
                This feature will be available soon!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 