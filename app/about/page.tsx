import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4">
            Welcome to CarHub, your premier destination for quality vehicles. With years of experience in the automotive industry,
            we pride ourselves on offering exceptional service and a wide selection of cars to meet every need and budget.
          </p>
          <p className="text-gray-700 mb-4">
            Our commitment to customer satisfaction and transparency has made us a trusted name in the car dealership industry.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Customer Satisfaction First</li>
            <li>Transparency in All Dealings</li>
            <li>Quality Vehicles</li>
            <li>Expert Service</li>
            <li>Competitive Pricing</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 