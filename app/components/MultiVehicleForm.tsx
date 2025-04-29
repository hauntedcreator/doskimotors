import React, { useState } from 'react';
import { Vehicle } from '../store/vehicleStore';
import VehicleForm from './VehicleForm';

interface MultiVehicleFormProps {
  onSubmit: (vehicles: Vehicle[]) => Promise<void>;
  onCancel: () => void;
}

export default function MultiVehicleForm({ onSubmit, onCancel }: MultiVehicleFormProps) {
  const [vehicles, setVehicles] = useState<Partial<Vehicle>[]>([{}]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddVehicle = () => {
    setVehicles([...vehicles, {}]);
  };

  const handleRemoveVehicle = (index: number) => {
    const newVehicles = vehicles.filter((_, i) => i !== index);
    setVehicles(newVehicles.length ? newVehicles : [{}]); // Ensure at least one form
  };

  const handleVehicleChange = (index: number, data: Partial<Vehicle>) => {
    const newVehicles = [...vehicles];
    newVehicles[index] = data;
    setVehicles(newVehicles);
  };

  const handleVehicleSubmit = async (index: number, data: Partial<Vehicle>) => {
    const newVehicles = [...vehicles];
    newVehicles[index] = data;
    setVehicles(newVehicles);
  };

  const handleSubmitAll = async () => {
    setError(null);
    setSubmitting(true);

    try {
      // Filter out empty vehicles
      const validVehicles = vehicles.filter(vehicle => 
        vehicle.make && vehicle.model && vehicle.year && vehicle.price && vehicle.mileage
      );

      if (!validVehicles.length) {
        throw new Error('Please complete at least one vehicle form');
      }

      await onSubmit(validVehicles as Vehicle[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting vehicles');
      console.error('Error submitting vehicles:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {vehicles.map((vehicle, index) => (
        <div key={index} className="relative border rounded-lg p-6">
          <VehicleForm
            vehicle={vehicle}
            onSubmit={(data) => handleVehicleSubmit(index, data)}
            onCancel={onCancel}
            onChange={(data) => handleVehicleChange(index, data)}
          />
          
          {vehicles.length > 1 && (
            <button
              className="absolute top-4 right-4 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              onClick={() => handleRemoveVehicle(index)}
            >
              Remove Vehicle
            </button>
          )}
        </div>
      ))}

      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          onClick={handleAddVehicle}
          disabled={submitting}
        >
          Add Another Vehicle
        </button>

        <div className="space-x-4">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            onClick={handleSubmitAll}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit All Vehicles'}
          </button>
        </div>
      </div>
    </div>
  );
} 