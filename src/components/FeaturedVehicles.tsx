import Image from 'next/image';
import Link from 'next/link';

const vehicles = [
  {
    id: 1,
    name: 'Tesla Model S',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Luxury sedan with incredible performance and range.',
    price: '250',
    specs: {
      range: '405 miles',
      acceleration: '2.4s 0-60',
      topSpeed: '200 mph'
    }
  },
  {
    id: 2,
    name: 'Tesla Model 3',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'The most popular Tesla model, perfect for daily driving.',
    price: '180',
    specs: {
      range: '358 miles',
      acceleration: '3.1s 0-60',
      topSpeed: '162 mph'
    }
  },
  {
    id: 3,
    name: 'Tesla Model X',
    image: 'https://images.unsplash.com/photo-1566274360936-69fae8dc1700?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Luxury SUV with falcon-wing doors and spacious interior.',
    price: '300',
    specs: {
      range: '348 miles',
      acceleration: '2.5s 0-60',
      topSpeed: '163 mph'
    }
  }
];

const FeaturedVehicles = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-64">
            <Image
              src={vehicle.image}
              alt={vehicle.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{vehicle.name}</h3>
              <p className="text-blue-600 font-semibold">${vehicle.price}/day</p>
            </div>
            <p className="text-gray-600 mb-4">{vehicle.description}</p>
            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
              <div>
                <p className="text-gray-500">Range</p>
                <p className="font-semibold">{vehicle.specs.range}</p>
              </div>
              <div>
                <p className="text-gray-500">0-60</p>
                <p className="font-semibold">{vehicle.specs.acceleration}</p>
              </div>
              <div>
                <p className="text-gray-500">Top Speed</p>
                <p className="font-semibold">{vehicle.specs.topSpeed}</p>
              </div>
            </div>
            <Link 
              href={`/vehicles/${vehicle.id}`}
              className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedVehicles; 