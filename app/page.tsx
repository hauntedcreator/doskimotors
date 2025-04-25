import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Reviews from '@/components/Reviews'
import Footer from '@/components/Footer'
import { FeaturedVehicles } from '@/components/FeaturedVehicles'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-8">Featured Vehicles</h2>
          <FeaturedVehicles />
        </div>
      </section>
      <Reviews />
      <Footer />
    </main>
  )
} 