import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          alt="Tesla Model S"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative container mx-auto px-4 z-10">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Experience Luxury <br />
          Electric Driving
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl">
          Rent premium Tesla vehicles for your special occasions or test drive before you buy. 
          Discover the future of automotive excellence.
        </p>
        <Link 
          href="/vehicles" 
          className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Browse Vehicles
        </Link>
      </div>
    </section>
  );
};

export default Hero; 