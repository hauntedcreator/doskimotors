'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const brands = [
  { id: 'all', name: 'All Brands' },
  { id: 'bmw', name: 'BMW' },
  { id: 'mercedes', name: 'Mercedes-Benz' },
  { id: 'audi', name: 'Audi' },
  { id: 'porsche', name: 'Porsche' },
  { id: 'tesla', name: 'Tesla' },
]

const priceRanges = [
  { id: 'all', name: 'Any Price' },
  { id: '0-30000', name: 'Under $30,000' },
  { id: '30000-50000', name: '$30,000 - $50,000' },
  { id: '50000-80000', name: '$50,000 - $80,000' },
  { id: '80000-plus', name: '$80,000+' },
]

export function SearchBar() {
  const router = useRouter()
  const [selectedBrand, setSelectedBrand] = useState(brands[0])
  const [selectedPrice, setSelectedPrice] = useState(priceRanges[0])
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (selectedBrand.id !== 'all') params.append('brand', selectedBrand.id)
    if (selectedPrice.id !== 'all') params.append('price', selectedPrice.id)
    if (searchTerm) params.append('search', searchTerm)
    router.push(`/cars?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <input
        type="text"
        placeholder="Search by make, model, or year..."
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
      <button className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700">
        Search
      </button>
    </div>
  )
} 