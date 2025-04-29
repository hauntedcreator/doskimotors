'use client'

import { useVehicleStore } from '@/app/store/vehicleStore'
import Link from 'next/link'
import { FiUpload, FiDollarSign, FiStar, FiBarChart2, FiPackage, FiHeart, FiEye } from 'react-icons/fi'

export default function AdminPage() {
  const { vehicles, totalValue, totalViews, totalLikes } = useVehicleStore()

  const stats = [
    {
      name: 'Total Inventory',
      value: vehicles.length,
      change: '+2 this week',
      icon: FiPackage,
      href: '/admin/vehicles'
    },
    {
      name: 'Total Value',
      value: `$${totalValue.toLocaleString()}`,
      change: '+12% vs last month',
      icon: FiDollarSign,
      href: '/admin/analytics'
    },
    {
      name: 'Total Likes',
      value: totalLikes,
      change: '+8% vs last week',
      icon: FiHeart,
      href: '/admin/analytics'
    },
    {
      name: 'Total Views',
      value: totalViews,
      change: '+23% vs last week',
      icon: FiEye,
      href: '/admin/analytics'
    }
  ]

  const quickActions = [
    {
      name: 'Upload Photos',
      href: '/admin/vehicles',
      icon: FiUpload,
      description: 'Add new vehicle photos'
    },
    {
      name: 'Update Prices',
      href: '/admin/vehicles',
      icon: FiDollarSign,
      description: 'Adjust vehicle pricing'
    },
    {
      name: 'Manage Featured',
      href: '/admin/vehicles',
      icon: FiStar,
      description: 'Update featured vehicles'
    },
    {
      name: 'View Reports',
      href: '/admin/analytics',
      icon: FiBarChart2,
      description: 'See detailed analytics'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow hover:bg-gray-50 transition-colors duration-200"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                {stat.change}
              </p>
            </dd>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="relative group rounded-lg bg-white p-6 shadow hover:bg-gray-50 transition-colors duration-200"
            >
              <div>
                <span className="inline-flex rounded-lg p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                  <action.icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {action.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
              <span
                className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 