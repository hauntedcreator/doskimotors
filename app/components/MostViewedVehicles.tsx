import { useVehicleStore } from '../store/vehicleStore'
import { FiEye, FiArrowUp, FiArrowDown } from 'react-icons/fi'

export default function MostViewedVehicles() {
  const { vehicles } = useVehicleStore()

  // Get top 5 most viewed vehicles that are still available
  const mostViewed = vehicles
    .filter(v => v.status === 'available')
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  // Calculate the maximum views for percentage bars
  const maxViews = Math.max(...mostViewed.map(v => v.views))

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Most Viewed Vehicles</h3>
        <FiEye className="w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-6">
        {mostViewed.map((vehicle, index) => (
          <div key={vehicle.id} className="relative">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{vehicle.title}</h4>
                <p className="text-xs text-gray-500">
                  {vehicle.year} • {vehicle.mileage.toLocaleString()} miles • {formatCurrency(vehicle.price)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold">{vehicle.views}</span>
                <FiEye className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(vehicle.views / maxViews) * 100}%` }}
              />
            </div>
            {/* Trending indicator */}
            {index === 0 && (
              <div className="absolute -top-2 -right-2 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <FiArrowUp className="w-3 h-3 mr-1" />
                Trending
              </div>
            )}
          </div>
        ))}
        {mostViewed.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">No vehicles to display</p>
        )}
      </div>
    </div>
  )
} 