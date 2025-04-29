'use client'

import { useState } from 'react'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'
import VehicleForm from '@/app/components/VehicleForm'
import Modal from '@/app/components/Modal'
import { useVehicleStore } from '@/app/store/vehicleStore'
import { Vehicle } from '@/app/store/vehicleStore'

export default function AdminVehiclesPage() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, toggleFeatured, updateStatus } = useVehicleStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>()

  const handleAddVehicle = () => {
    setSelectedVehicle(undefined)
    setIsModalOpen(true)
  }

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsModalOpen(true)
  }

  const handleDeleteVehicle = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      deleteVehicle(id)
    }
  }

  const handleSubmit = async (data: Partial<Vehicle>) => {
    if (selectedVehicle?.id) {
      updateVehicle(selectedVehicle.id, data)
    } else {
      const newVehicle: Partial<Vehicle> = {
        title: data.title || '',
        make: data.make || '',
        model: data.model || '',
        year: data.year || new Date().getFullYear(),
        price: data.price || 0,
        mileage: data.mileage || 0,
        location: data.location || '',
        image: data.image || '/placeholder-car.jpg',
        images: data.images || [data.image || '/placeholder-car.jpg'],
        condition: data.condition || 'Used',
        transmission: data.transmission || 'Automatic',
        fuelType: data.fuelType || 'Gasoline',
        bodyStyle: data.bodyStyle || 'Sedan',
        status: data.status || 'available',
        featured: data.featured || false,
        description: data.description || '',
        features: data.features || [],
        specifications: data.specifications || {},
        titleStatus: data.titleStatus || 'Clean',
        available: true,
        favorites: false,
        views: 0
      }
      addVehicle(newVehicle)
    }
    setIsModalOpen(false)
    return Promise.resolve();
  }

  const handleToggleFeatured = (id: string) => {
    toggleFeatured(id)
  }

  const handleStatusChange = (id: string, status: Vehicle['status']) => {
    updateStatus(id, status)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your vehicle inventory, update details, and control visibility
          </p>
        </div>
        <button
          onClick={handleAddVehicle}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <FiPlus className="mr-2" />
          Add Vehicle
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-md object-cover" src={vehicle.image} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{vehicle.title}</div>
                        <div className="text-sm text-gray-500">{vehicle.year} • {vehicle.mileage} miles</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${vehicle.price.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={vehicle.status}
                      onChange={(e) => handleStatusChange(vehicle.id, e.target.value as Vehicle['status'])}
                      className={`text-sm rounded-full px-2 py-1 font-semibold
                        ${vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                          vehicle.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'}`}
                    >
                      <option value="available">Available</option>
                      <option value="pending">Pending</option>
                      <option value="sold">Sold</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleFeatured(vehicle.id)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${vehicle.featured
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {vehicle.featured ? 'Featured' : 'Not Featured'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditVehicle(vehicle)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
      >
        <VehicleForm
          vehicle={selectedVehicle}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
} 