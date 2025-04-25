import Image from 'next/image'
import Link from 'next/link'
import { ParallaxSection } from '@/components/Parallax'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section with Parallax */}
      <ParallaxSection image="/images/hero-bg.jpg">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-lg">
              Find Your Perfect Car
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 drop-shadow-lg">
              Premium selection of luxury and performance vehicles
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-3xl mx-auto">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Search by brand or model..." 
                  className="w-full px-6 py-4 rounded-lg text-gray-900 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                />
              </div>
              <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                Search Now
              </button>
            </div>
            <div className="mt-12 flex justify-center gap-8 sm:gap-16">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white">500+</h3>
                <p className="text-gray-300">Vehicles</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white">24/7</h3>
                <p className="text-gray-300">Support</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white">100%</h3>
                <p className="text-gray-300">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* Featured Vehicles Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Featured Car 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
              <div className="relative h-48">
                <Image
                  src="/images/hero-bg.jpg"
                  alt="Luxury Car 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">2024 Luxury Sedan</h3>
                <p className="text-gray-600 mb-4">Starting from $45,000</p>
                <Link href="/vehicles" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Learn More
                </Link>
              </div>
            </div>

            {/* Featured Car 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
              <div className="relative h-48">
                <Image
                  src="/images/hero-bg.jpg"
                  alt="Luxury Car 2"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">2024 Sports Car</h3>
                <p className="text-gray-600 mb-4">Starting from $65,000</p>
                <Link href="/vehicles" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Learn More
                </Link>
              </div>
            </div>

            {/* Featured Car 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
              <div className="relative h-48">
                <Image
                  src="/images/hero-bg.jpg"
                  alt="Luxury Car 3"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">2024 Electric SUV</h3>
                <p className="text-gray-600 mb-4">Starting from $55,000</p>
                <Link href="/vehicles" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">CarHub</h4>
              <p className="text-gray-400">Your trusted partner in finding the perfect vehicle.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/services" className="text-gray-400 hover:text-white">Services</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>123 Car Street</li>
                <li>New York, NY 10001</li>
                <li>Phone: (555) 123-4567</li>
                <li>Email: info@carhub.com</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates and special offers.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-4 py-2 rounded-l-lg w-full text-gray-900 focus:outline-none" 
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CarHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
} 