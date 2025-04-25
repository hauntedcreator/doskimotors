'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  UsersIcon,
  TruckIcon,
  CurrencyDollarIcon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import Logo from '@/components/Logo'

const stats = [
  { name: 'Total Inventory', value: '48 vehicles', icon: TruckIcon },
  { name: 'Monthly Sales', value: '$425,000', icon: CurrencyDollarIcon },
  { name: 'Active Leads', value: '32', icon: UsersIcon },
  { name: 'Conversion Rate', value: '8.5%', icon: ChartBarIcon },
]

const recentActivity = [
  { id: 1, type: 'Lead', name: 'John Smith', vehicle: '2024 BMW M4', status: 'New Inquiry', time: '2 hours ago' },
  { id: 2, type: 'Sale', name: 'Sarah Johnson', vehicle: '2023 Mercedes S580', status: 'Completed', time: '1 day ago' },
  { id: 3, type: 'Service', name: 'Mike Brown', vehicle: '2022 Porsche 911', status: 'Scheduled', time: '2 days ago' },
]

export default function DealerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Logo size="small" textColor="black" />
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <BellIcon className="h-6 w-6" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <UserCircleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

          {/* Stats */}
          <motion.div 
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
              >
                <dt className="truncate text-sm font-medium text-gray-500">
                  <div className="flex items-center space-x-2">
                    <stat.icon className="h-5 w-5 text-gray-400" />
                    <span>{stat.name}</span>
                  </div>
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {stat.value}
                </dd>
              </div>
            ))}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
              <ul role="list" className="divide-y divide-gray-200">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {activity.name} - {activity.vehicle}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          {activity.type} • {activity.status}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button className="rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700">
              Add New Vehicle
            </button>
            <button className="rounded-lg bg-white px-4 py-3 text-gray-700 hover:bg-gray-50">
              View All Inventory
            </button>
            <button className="rounded-lg bg-white px-4 py-3 text-gray-700 hover:bg-gray-50">
              Generate Reports
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  )
} 