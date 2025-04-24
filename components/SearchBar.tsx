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
    <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-4">
      <div className="relative md:col-span-2">
        <input
          type="text"
          placeholder="Search by model, year, or features..."
          className="input-field"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Listbox value={selectedBrand} onChange={setSelectedBrand}>
        <div className="relative">
          <Listbox.Button className="input-field flex items-center justify-between">
            <span>{selectedBrand.name}</span>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Listbox.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {brands.map((brand) => (
                <Listbox.Option
                  key={brand.id}
                  value={brand}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 px-4 ${
                      active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                    }`
                  }
                >
                  {brand.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      <Listbox value={selectedPrice} onChange={setSelectedPrice}>
        <div className="relative">
          <Listbox.Button className="input-field flex items-center justify-between">
            <span>{selectedPrice.name}</span>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Listbox.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {priceRanges.map((price) => (
                <Listbox.Option
                  key={price.id}
                  value={price}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 px-4 ${
                      active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                    }`
                  }
                >
                  {price.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </form>
  )
} 