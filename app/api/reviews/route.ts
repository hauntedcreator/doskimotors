import { NextResponse } from 'next/server'

const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

export async function GET() {
  if (!GOOGLE_PLACE_ID || !GOOGLE_API_KEY) {
    console.error('Missing required environment variables: GOOGLE_PLACE_ID and/or GOOGLE_API_KEY')
    return NextResponse.json({ error: 'Missing API configuration' }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=reviews&key=${GOOGLE_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.result?.reviews) {
      throw new Error('No reviews found in response')
    }

    const reviews = data.result.reviews
    
    // Sort reviews by date and take the most recent ones
    const sortedReviews = reviews
      .sort((a: any, b: any) => b.time - a.time)
      .slice(0, 10)
      .map((review: any) => ({
        author_name: review.author_name,
        rating: review.rating,
        text: review.text,
        profile_photo_url: review.profile_photo_url,
        relative_time_description: review.relative_time_description,
      }))

    return NextResponse.json(sortedReviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
} 