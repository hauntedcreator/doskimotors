'use client'

import { useState, useEffect } from 'react'
import { Vehicle } from '../store/vehicleStore'

interface FilterCounts {
  [key: string]: number
}

type FilterProps = {
  vehicles: Vehicle[]
  onFilterChange: (filters: any) => void
  initialFilters?: {
    search: string
    priceRange: { min: string, max: string }
    year: { min: string, max: string }
    condition: string[]
    bodyStyle: string[]
    transmission: string[]
    fuelType: string[]
    make: string[]
  }
}

export default function VehicleFilters({ vehicles, onFilterChange, initialFilters }: FilterProps) {
  const [filters, setFilters] = useState({
    search: '',
    priceRange: {
      min: '',
      max: ''
    },
    year: {
      min: '',
      max: ''
    },
    condition: [] as string[],
    bodyStyle: [] as string[],
    transmission: [] as string[],
    fuelType: [] as string[],
    make: [] as string[]
  })

  const [counts, setCounts] = useState<FilterCounts>({})

  // Calculate counts for each filter option
  useEffect(() => {
    const newCounts: FilterCounts = {}
    
    // Count vehicles by condition
    vehicles.forEach(vehicle => {
      // Condition counts
      if (vehicle.condition) {
        newCounts[`condition_${vehicle.condition}`] = (newCounts[`condition_${vehicle.condition}`] || 0) + 1
      }
      
      // Body style counts
      if (vehicle.bodyStyle) {
        newCounts[`bodyStyle_${vehicle.bodyStyle}`] = (newCounts[`bodyStyle_${vehicle.bodyStyle}`] || 0) + 1
      }
      
      // Transmission counts
      if (vehicle.transmission) {
        newCounts[`transmission_${vehicle.transmission}`] = (newCounts[`transmission_${vehicle.transmission}`] || 0) + 1
      }
      
      // Fuel type counts
      if (vehicle.fuelType) {
        newCounts[`fuelType_${vehicle.fuelType}`] = (newCounts[`fuelType_${vehicle.fuelType}`] || 0) + 1
      }
      
      // Make counts
      if (vehicle.make) {
        newCounts[`make_${vehicle.make}`] = (newCounts[`make_${vehicle.make}`] || 0) + 1
      }
    })
    
    setCounts(newCounts)
  }, [vehicles])

  // Apply initial filters if provided
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters)
      onFilterChange(initialFilters)
    }
  }, [initialFilters])

  const handleFilterChange = (category: string, value: string | string[] | { min: string, max: string }) => {
    const newFilters = {
      ...filters,
      [category]: value
    }
    setFilters(newFilters)
    
    // Debounce the filter change notification
    const timeoutId = setTimeout(() => {
      onFilterChange(newFilters)
    }, category === 'search' ? 300 : 0)

    return () => clearTimeout(timeoutId)
  }

  // Reset filters
  const handleReset = () => {
    const initialFilters = {
      search: '',
      priceRange: {
        min: '',
        max: ''
      },
      year: {
        min: '',
        max: ''
      },
      condition: [],
      bodyStyle: [],
      transmission: [],
      fuelType: [],
      make: []
    }
    setFilters(initialFilters)
    onFilterChange(initialFilters)
  }

  const conditions = ['New', 'Used', 'Certified Pre-Owned']
  const bodyStyles = ['Sedan', 'SUV', 'Coupe', 'Truck', 'Van', 'Convertible']
  const transmissions = ['Automatic', 'Manual']
  const fuelTypes = ['Gasoline', 'Electric', 'Hybrid', 'Diesel']
  const makes = Array.from(new Set(vehicles.map(v => v.make))).filter(Boolean).sort()

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      {/* Search */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Search</h3>
          <button
            onClick={handleReset}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Reset All
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by make, model, or title..."
            className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Price Range</h3>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              placeholder="Min"
              className="w-full pl-7 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.priceRange.min}
              onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, min: e.target.value })}
              min="0"
            />
          </div>
          <div className="relative flex-1">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full pl-7 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.priceRange.max}
              onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: e.target.value })}
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Year Range */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Year Range</h3>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Min year"
            className="w-1/2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.year.min}
            onChange={(e) => handleFilterChange('year', { ...filters.year, min: e.target.value })}
            min="1900"
            max={new Date().getFullYear() + 1}
          />
          <input
            type="number"
            placeholder="Max year"
            className="w-1/2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.year.max}
            onChange={(e) => handleFilterChange('year', { ...filters.year, max: e.target.value })}
            min="1900"
            max={new Date().getFullYear() + 1}
          />
        </div>
      </div>

      {/* Condition */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Condition</h3>
        <div className="space-y-2">
          {conditions.map(condition => (
            <label key={condition} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.condition.includes(condition)}
                onChange={(e) => {
                  const newConditions = e.target.checked
                    ? [...filters.condition, condition]
                    : filters.condition.filter(c => c !== condition)
                  handleFilterChange('condition', newConditions)
                }}
                className="rounded"
              />
              <span>{condition}</span>
              <span className="text-gray-500 text-sm">
                ({counts[`condition_${condition}`] || 0})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Body Style */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Body Style</h3>
        <div className="space-y-2">
          {bodyStyles.map(style => (
            <label key={style} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.bodyStyle.includes(style)}
                onChange={(e) => {
                  const newStyles = e.target.checked
                    ? [...filters.bodyStyle, style]
                    : filters.bodyStyle.filter(s => s !== style)
                  handleFilterChange('bodyStyle', newStyles)
                }}
                className="rounded"
              />
              <span>{style}</span>
              <span className="text-gray-500 text-sm">
                ({counts[`bodyStyle_${style}`] || 0})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Transmission</h3>
        <div className="space-y-2">
          {transmissions.map(transmission => (
            <label key={transmission} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.transmission.includes(transmission)}
                onChange={(e) => {
                  const newTransmissions = e.target.checked
                    ? [...filters.transmission, transmission]
                    : filters.transmission.filter(t => t !== transmission)
                  handleFilterChange('transmission', newTransmissions)
                }}
                className="rounded"
              />
              <span>{transmission}</span>
              <span className="text-gray-500 text-sm">
                ({counts[`transmission_${transmission}`] || 0})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Fuel Type</h3>
        <div className="space-y-2">
          {fuelTypes.map(fuelType => (
            <label key={fuelType} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.fuelType.includes(fuelType)}
                onChange={(e) => {
                  const newFuelTypes = e.target.checked
                    ? [...filters.fuelType, fuelType]
                    : filters.fuelType.filter(f => f !== fuelType)
                  handleFilterChange('fuelType', newFuelTypes)
                }}
                className="rounded"
              />
              <span>{fuelType}</span>
              <span className="text-gray-500 text-sm">
                ({counts[`fuelType_${fuelType}`] || 0})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Make */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Make</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {makes.map(make => (
            <label key={make} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.make.includes(make)}
                onChange={(e) => {
                  const newMakes = e.target.checked
                    ? [...filters.make, make]
                    : filters.make.filter(m => m !== make)
                  handleFilterChange('make', newMakes)
                }}
                className="rounded"
              />
              <span>{make}</span>
              <span className="text-gray-500 text-sm">
                ({counts[`make_${make}`] || 0})
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
} 