import { FireIcon, SparklesIcon } from '@heroicons/react/24/outline'

const promos = [
  {
    id: 1,
    title: '🔥 Spring Sales',
    description: 'Up to $3,000 Off',
    icon: FireIcon,
    color: 'bg-red-500',
  },
  {
    id: 2,
    title: '⭐ First-Time Buyer Bonus',
    description: 'Special financing rates available',
    icon: SparklesIcon,
    color: 'bg-yellow-500',
  },
]

export function PromoSection() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-xl bg-blue-50 p-6">
        <h3 className="text-xl font-semibold text-blue-900">Quality Assurance</h3>
        <p className="mt-2 text-blue-700">Every vehicle undergoes thorough inspection and certification.</p>
      </div>
      <div className="rounded-xl bg-blue-50 p-6">
        <h3 className="text-xl font-semibold text-blue-900">Financing Options</h3>
        <p className="mt-2 text-blue-700">Flexible financing solutions to fit your budget.</p>
      </div>
      <div className="rounded-xl bg-blue-50 p-6">
        <h3 className="text-xl font-semibold text-blue-900">Expert Support</h3>
        <p className="mt-2 text-blue-700">Professional guidance throughout your car buying journey.</p>
      </div>
    </div>
  );
} 