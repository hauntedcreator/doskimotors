import { useState } from 'react';
import VehicleForm from './VehicleForm';
import { Vehicle } from '../store/vehicleStore';

const emptyVehicle = (): Partial<Vehicle> & { key: number } => ({
  key: Date.now() + Math.random(),
  title: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  location: '',
  image: '',
  images: [],
  condition: 'Used',
  transmission: 'Automatic',
  fuelType: 'Gasoline',
  bodyStyle: 'Sedan',
  status: 'available',
  description: '',
  features: [],
  titleStatus: 'Clean',
  specifications: { trim: '' },
});

type VehicleWithKey = Partial<Vehicle> & { key: number };

export default function MultiVehicleForm({ onSubmit }: { onSubmit: (vehicles: any[]) => Promise<void> }) {
  const [vehicles, setVehicles] = useState<VehicleWithKey[]>([emptyVehicle()]);

  const handleVehicleChange = (index: number, data: Partial<Vehicle>) => {
    setVehicles(prev => prev.map((v, i) => (i === index ? { ...v, ...data } : v)));
  };

  const handleAddVehicle = () => {
    setVehicles(prev => [...prev, emptyVehicle()]);
  };

  const handleRemoveVehicle = (index: number) => {
    setVehicles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validVehicles = vehicles.filter(v => v.make && v.model && v.year && v.specifications?.trim);
    await onSubmit(validVehicles);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col gap-8">
        {vehicles.map((vehicle, idx) => (
          <div key={vehicle.key} className="flex flex-row gap-8 p-6 bg-white rounded-lg shadow border border-gray-200 items-start relative">
            <div className="absolute top-2 right-2">
              {vehicles.length > 1 && (
                <button type="button" onClick={() => handleRemoveVehicle(idx)} className="text-red-500 hover:text-red-700 font-bold text-lg">&times;</button>
              )}
            </div>
            <div className="flex-1 min-w-[600px]">
              <VehicleForm
                vehicle={vehicle}
                onSubmit={(data) => {
  handleVehicleChange(idx, data);
  return Promise.resolve();
}}

}}

                onCancel={() => handleRemoveVehicle(idx)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-4">
        <button type="button" onClick={handleAddVehicle} className="px-4 py-2 bg-blue-100 text-blue-900 rounded font-semibold hover:bg-blue-200">+ Add Another Vehicle</button>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700">Submit All Vehicles</button>
      </div>
    </form>
  );
} 