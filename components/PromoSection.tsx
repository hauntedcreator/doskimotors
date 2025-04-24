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
    <div className="grid gap-6 sm:grid-cols-2">
      {promos.map((promo) => (
        <div
          key={promo.id}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 transition-transform hover:scale-[1.02]"
        >
          <div className="flex items-center gap-4">
            <div className={`rounded-lg ${promo.color} p-3`}>
              <promo.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-white">{promo.title}</h3>
              <p className="mt-1 text-sm text-gray-300">{promo.description}</p>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      ))}
    </div>
  )
} 