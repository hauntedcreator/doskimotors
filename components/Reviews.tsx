'use client'

import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa'

// Sample reviews - in production, these would be fetched from Google Reviews API
const reviews = [
  {
    id: 1,
    author: "John D.",
    rating: 5,
    text: "Amazing experience with Doski Motors! Found my dream car at an unbeatable price.",
    date: "2 weeks ago"
  },
  {
    id: 2,
    author: "Sarah M.",
    rating: 5,
    text: "Professional service and great selection of vehicles. Highly recommend!",
    date: "1 month ago"
  },
  {
    id: 3,
    author: "Mike R.",
    rating: 5,
    text: "Best car buying experience ever. The team at Doski Motors is fantastic!",
    date: "2 months ago"
  }
]

const Reviews = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        <div className="relative overflow-hidden">
          <motion.div
            className="flex space-x-6"
            animate={{
              x: [-1200, 1200],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {[...reviews, ...reviews].map((review, index) => (
              <div
                key={`${review.id}-${index}`}
                className="flex-shrink-0 w-[350px] bg-white p-6 rounded-lg shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 text-sm">
                    {review.date}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{review.text}</p>
                <p className="font-medium text-gray-900">{review.author}</p>
              </div>
            ))}
          </motion.div>

          {/* Gradient overlays */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10" />
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://g.co/kgs/hVzYFRV"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-500"
          >
            View all reviews on Google
            <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Reviews 