import Image from 'next/image'
import Link from 'next/link'
import { SearchBar } from '@/components/SearchBar'
import { PromoSection } from '@/components/PromoSection'
import { CarGrid } from '@/components/CarGrid'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full">
        <Image
          src="/hero-car.jpg"
          alt="Luxury car on mountain road"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Buy Smarter.
            <br />
            Drive Better.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Find your perfect luxury vehicle with our curated selection
          </p>
          <div className="mt-10 flex items-center gap-6">
            <Link href="/cars" className="btn-primary">
              Browse Cars
            </Link>
            <Link href="/sell" className="btn-secondary text-white ring-white/20 hover:bg-white/10">
              Sell Your Car
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="mx-auto -mt-20 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white p-6 shadow-xl">
          <SearchBar />
        </div>
      </section>

      {/* Promo Section */}
      <section className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <PromoSection />
      </section>

      {/* Featured Cars */}
      <section className="mx-auto mt-16 w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <h2 className="mb-8 font-display text-3xl font-bold tracking-tight text-gray-900">
          Featured Vehicles
        </h2>
        <CarGrid />
      </section>
    </main>
  )
} 