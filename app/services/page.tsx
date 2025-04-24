import React from 'react';

export default function ServicesPage() {
  const services = [
    {
      title: 'Car Sales',
      description: 'Browse our extensive collection of new and pre-owned vehicles.',
      icon: '🚗'
    },
    {
      title: 'Car Rentals',
      description: 'Flexible rental options for all your transportation needs.',
      icon: '🔑'
    },
    {
      title: 'Maintenance',
      description: 'Professional maintenance and repair services.',
      icon: '🔧'
    },
    {
      title: 'Financing',
      description: 'Competitive financing options to suit your budget.',
      icon: '💰'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">{service.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 