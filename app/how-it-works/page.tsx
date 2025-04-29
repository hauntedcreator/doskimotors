import Image from 'next/image';
import Link from 'next/link';
import { FaCar, FaCalendarAlt, FaKey, FaRoad } from 'react-icons/fa';

const steps = [
  {
    icon: FaCar,
    title: 'Choose Your Tesla',
    description: 'Browse our selection of premium Tesla vehicles and select the perfect model for your needs.',
  },
  {
    icon: FaCalendarAlt,
    title: 'Select Rental Dates',
    description: 'Pick your preferred rental dates and duration. We offer flexible rental periods to suit your schedule.',
  },
  {
    icon: FaKey,
    title: 'Vehicle Handover',
    description: 'Complete a brief orientation session where we explain all vehicle features and handling procedures.',
  },
  {
    icon: FaRoad,
    title: 'Enjoy Your Ride',
    description: 'Hit the road with confidence in your premium Tesla. 24/7 support available throughout your rental.',
  },
];

const features = [
  {
    title: 'Flexible Rental Periods',
    description: 'Choose from daily, weekly, or monthly rentals with competitive pricing options.',
  },
  {
    title: 'Full Insurance Coverage',
    description: 'Comprehensive insurance included with all rentals for your peace of mind.',
  },
  {
    title: 'Charging Solutions',
    description: 'Access to Tesla Supercharger network and charging guidance provided.',
  },
  {
    title: '24/7 Support',
    description: 'Round-the-clock customer service and roadside assistance available.',
  },
  {
    title: 'Contactless Pickup',
    description: 'Safe and convenient vehicle pickup and return process.',
  },
  {
    title: 'Clean & Sanitized',
    description: 'All vehicles thoroughly cleaned and sanitized between rentals.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How Tesla Rental Works
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Experience the future of driving with our simple and convenient Tesla rental process.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="inline-block p-4 bg-blue-100 rounded-full mb-6">
                  <step.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need for a Perfect Rental
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Experience Tesla?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Browse our selection of premium Tesla vehicles and book your rental today.
          </p>
          <Link
            href="/vehicles"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View Available Vehicles
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: 'What do I need to rent a Tesla?',
                answer: 'You need a valid driver's license, proof of insurance, and a credit card for the security deposit. You must be at least 25 years old.',
              },
              {
                question: 'How does charging work during the rental?',
                answer: 'We provide access to the Tesla Supercharger network, and all charging costs are included in the rental price.',
              },
              {
                question: 'What happens if I need assistance during my rental?',
                answer: 'We provide 24/7 customer support and roadside assistance. You can reach us anytime through our emergency hotline.',
              },
              {
                question: 'Can I extend my rental period?',
                answer: 'Yes, you can extend your rental period subject to availability. Please contact us at least 24 hours before your scheduled return.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 