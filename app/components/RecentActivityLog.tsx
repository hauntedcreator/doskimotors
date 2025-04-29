import { useVehicleStore } from '../store/vehicleStore'
import { FiClock, FiDollarSign, FiPlus, FiEdit2, FiArchive } from 'react-icons/fi'

export default function RecentActivityLog() {
  const { vehicles } = useVehicleStore()

  // Sort vehicles by most recent activity (using lastModified)
  const recentActivity = vehicles
    .map(vehicle => {
      const activities = []
      
      // Add activity based on status changes
      if (vehicle.dateSold) {
        activities.push({
          type: 'sold',
          date: new Date(vehicle.dateSold),
          vehicle,
          description: `${vehicle.title} was sold`
        })
      }
      
      if (vehicle.dateAdded) {
        activities.push({
          type: 'added',
          date: new Date(vehicle.dateAdded),
          vehicle,
          description: `${vehicle.title} was added to inventory`
        })
      }

      if (vehicle.lastModified && vehicle.lastModified !== vehicle.dateAdded) {
        activities.push({
          type: 'updated',
          date: new Date(vehicle.lastModified),
          vehicle,
          description: `${vehicle.title} was updated`
        })
      }

      return activities
    })
    .flat()
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10) // Show last 10 activities

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sold':
        return <FiDollarSign className="w-4 h-4 text-green-500" />
      case 'added':
        return <FiPlus className="w-4 h-4 text-blue-500" />
      case 'updated':
        return <FiEdit2 className="w-4 h-4 text-orange-500" />
      default:
        return <FiArchive className="w-4 h-4 text-gray-500" />
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return `${minutes}m ago`
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <FiClock className="w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {recentActivity.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="p-2 bg-gray-50 rounded-full">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.description}</p>
              <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
            </div>
          </div>
        ))}
        {recentActivity.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">No recent activity</p>
        )}
      </div>
    </div>
  )
} 