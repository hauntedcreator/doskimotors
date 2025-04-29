import Hero from '@/components/Hero'
import Reviews from '@/components/Reviews'
import FeaturedVehicles from '@/components/FeaturedVehicles'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      {/* Featured Vehicles Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Vehicles</h2>
          <FeaturedVehicles />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Premium Fleet',
                description: 'Access to the latest Tesla models, maintained to the highest standards.',
                icon: '🚗'
              },
              {
                title: 'Flexible Rentals',
                description: 'Daily, weekly, or monthly rental options to suit your needs.',
                icon: '📅'
              },
              {
                title: '24/7 Support',
                description: 'Round-the-clock customer service for peace of mind.',
                icon: '🔧'
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Reviews />
    </div>
  )
} 