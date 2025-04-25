'use client'

import Image from 'next/image'
import Link from 'next/link'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

const featuredVehicles = [
  {
    id: 1,
    title: '2024 BMW M4 Competition',
    price: 84900,
    mileage: '1,200',
    location: 'Miami, FL',
    image: 'https://placehold.co/800x450/333/FFF?text=BMW+M4',
    badges: ['New Arrival', 'Premium']
  },
  {
    id: 2,
    title: '2023 Mercedes-Benz S580',
    price: 129500,
    mileage: '8,500',
    location: 'Los Angeles, CA',
    image: 'https://placehold.co/800x450/333/FFF?text=Mercedes+S580',
    badges: ['Hot Deal', 'Certified']
  },
  {
    id: 3,
    title: '2024 Porsche 911 GT3',
    price: 189900,
    mileage: '350',
    location: 'New York, NY',
    image: 'https://placehold.co/800x450/333/FFF?text=Porsche+911',
    badges: ['Limited Edition']
  }
]

export function FeaturedVehicles() {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featuredVehicles.map((vehicle) => (
        <div key={vehicle.id} className="group relative">
          <div className="overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg">
            <div className="relative aspect-[16/9]">
              <Image
                src={vehicle.image}
                alt={vehicle.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <button
                onClick={() => toggleFavorite(vehicle.id)}
                className="absolute right-4 top-4 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-colors hover:bg-white"
              >
                {favorites.includes(vehicle.id) ? (
                  <HeartSolidIcon className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
            <div className="p-4">
              <div className="mb-3 flex gap-2">
                {vehicle.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <Link href={`/inventory/${vehicle.id}`}>
                <h3 className="font-display text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  {vehicle.title}
                </h3>
              </Link>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                ${vehicle.price.toLocaleString()}
              </p>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span>{vehicle.mileage} miles</span>
                <span>•</span>
                <span>{vehicle.location}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 