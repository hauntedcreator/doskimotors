'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FaLeaf, FaBolt, FaHandshake } from 'react-icons/fa'

const values = [
  {
    icon: FaLeaf,
    title: 'Sustainability',
    description: 'Committed to promoting eco-friendly transportation through electric vehicles.',
  },
  {
    icon: FaBolt,
    title: 'Innovation',
    description: 'Embracing the latest technology to provide the best rental experience.',
  },
  {
    icon: FaHandshake,
    title: 'Customer Focus',
    description: 'Dedicated to exceptional service and customer satisfaction.',
  },
]

const team = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Founder',
    image: 'https://i.pravatar.cc/300?img=1',
    bio: 'Former Tesla executive with 15 years of experience in the electric vehicle industry.',
  },
  {
    name: 'Michael Chen',
    role: 'Operations Director',
    image: 'https://i.pravatar.cc/300?img=2',
    bio: 'Automotive industry veteran specializing in luxury vehicle rentals and fleet management.',
  },
  {
    name: 'Emily Davis',
    role: 'Customer Experience Manager',
    image: 'https://i.pravatar.cc/300?img=3',
    bio: 'Dedicated to ensuring every rental experience exceeds customer expectations.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden bg-gradient animate-gradient">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#000000,#1a1a1a,#2d2d2d,#1a1a1a,#000000)] bg-[length:400%_400%] animate-gradient-slow">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.15)_0%,rgba(0,0,0,0)_70%)]"></div>
        </div>
        <div className="relative z-10 text-center py-24 px-4 w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
          >
            About Doski Motors
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your trusted partner in premium and electric vehicles.
            </p>
            <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          </motion.div>
        </div>
      </section>
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Our Story</h2>
              <p className="text-gray-600 leading-relaxed">
                At Doski Motors, we've built our reputation on a foundation of trust, expertise, and an unwavering commitment to customer satisfaction. Since our establishment, we've been San Diego's premier destination for luxury and performance vehicles.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our team of automotive experts brings decades of combined experience to the table, ensuring that every vehicle in our inventory meets our rigorous standards for quality and performance.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                We strive to provide an unparalleled car buying experience, offering a curated selection of premium vehicles and exceptional customer service. Our mission is to help you find the perfect vehicle that matches your lifestyle and exceeds your expectations.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We pride ourselves on transparency, competitive pricing, and building lasting relationships with our customers. When you choose Doski Motors, you're not just buying a car – you're joining a community of passionate automotive enthusiasts.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quality Selection</h3>
                <p className="text-gray-600">
                  Carefully curated inventory of premium vehicles, each thoroughly inspected to meet our high standards.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Expert Service</h3>
                <p className="text-gray-600">
                  Knowledgeable team dedicated to helping you find the perfect vehicle for your needs and preferences.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer First</h3>
                <p className="text-gray-600">
                  Commitment to exceptional customer service and building long-lasting relationships with our clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 