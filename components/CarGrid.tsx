'use client'

import Image from 'next/image'
import Link from 'next/link'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

// This would come from your API in a real application
const featuredCars = [
  {
    id: 1,
    title: '2023 BMW M4 Competition',
    price: 84900,
    mileage: '1,200',
    location: 'Miami, FL',
    image: '/cars/bmw-m4.jpg',
    badges: ['New Arrival', 'Premium'],
  },
  {
    id: 2,
    title: '2022 Mercedes-Benz S580',
    price: 129500,
    mileage: '8,500',
    location: 'Los Angeles, CA',
    image: '/cars/mercedes-s580.jpg',
    badges: ['Hot Deal', 'Certified'],
  },
  {
    id: 3,
    title: '2023 Porsche 911 GT3',
    price: 189900,
    mileage: '350',
    location: 'New York, NY',
    image: '/cars/porsche-911.jpg',
    badges: ['Limited Edition'],
  },
]

export function CarGrid() {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    )
  }

  const cars = [
    {
      id: 1,
      name: "2023 Tesla Model S",
      price: "$89,990",
      image: "/car-placeholder.jpg"
    },
    {
      id: 2,
      name: "2023 BMW M5",
      price: "$105,100",
      image: "/car-placeholder.jpg"
    },
    {
      id: 3,
      name: "2023 Mercedes-Benz S-Class",
      price: "$114,500",
      image: "/car-placeholder.jpg"
    }
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <div key={car.id} className="group overflow-hidden rounded-xl bg-white shadow-md transition-transform hover:scale-[1.02]">
          <div className="relative h-48">
            <div className="absolute inset-0 bg-gray-200" />
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              Car Image Placeholder
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900">{car.name}</h3>
            <p className="mt-1 text-lg font-medium text-blue-600">{car.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 