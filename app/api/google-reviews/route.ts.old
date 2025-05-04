import { NextResponse } from 'next/server'

// This would typically use environment variables
const GOOGLE_PLACE_ID = 'ChIJ_____ZFv2oARM2Hm5lZL3ngx'
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

// Google review type
export type GoogleReview = {
  author_name: string
  profile_photo_url: string
  rating: number
  relative_time_description: string
  text: string
  time: number
}

// Sample fallback reviews in case the API key is not available or fails
const fallbackReviews: GoogleReview[] = [
  {
    author_name: "Alexandre Amro",
    profile_photo_url: "/avatars/default.png",
    rating: 5,
    relative_time_description: "4 days ago",
    text: "Great guys and great service. Bought at Model Y works great and they shipped me all the accessories I wanted.",
    time: Date.now() - 4 * 24 * 60 * 60 * 1000
  },
  {
    author_name: "Jacob Hindi",
    profile_photo_url: "/avatars/default.png",
    rating: 5,
    relative_time_description: "a week ago",
    text: "I have nothing but absolutely great things to say! I bought my first tesla from Zahid and his brother. They made the whole experience as good as it can be! The nicest, most polite, and coolest guys I ever bought a car from!",
    time: Date.now() - 7 * 24 * 60 * 60 * 1000
  },
  {
    author_name: "Onyx",
    profile_photo_url: "/avatars/default.png",
    rating: 5,
    relative_time_description: "a year ago",
    text: "Great experience dealing with Doski Motors, very informative and went above and beyond in assisting with any questions/concerns. Love the car probably one of the few rare honest Tesla sellers out there, looking forward to dealing with you again in the future",
    time: Date.now() - 365 * 24 * 60 * 60 * 1000
  },
  {
    author_name: "Tal Sharf",
    profile_photo_url: "/avatars/default.png",
    rating: 5,
    relative_time_description: "7 months ago",
    text: "I think this has to be by far the most pleasant experience I've had when it comes to purchasing a vehicle. Getting my first tesla was not an easy task and Mo was super patient, he did the research for me and found me my dream model S, and honestly he gave me the best deal by far!!! Will update with pics in about a week!",
    time: Date.now() - 7 * 30 * 24 * 60 * 60 * 1000
  },
  {
    author_name: "Christian Lopez",
    profile_photo_url: "/avatars/default.png",
    rating: 4,
    relative_time_description: "7 months ago",
    text: "Great experience with Doski Motors, very helpful and informative. They made the buying process very easy!",
    time: Date.now() - 7 * 30 * 24 * 60 * 60 * 1000
  },
  {
    author_name: "Al Alahmad",
    profile_photo_url: "/avatars/default.png",
    rating: 5,
    relative_time_description: "7 months ago",
    text: "Great service, very affordable pricing",
    time: Date.now() - 7 * 30 * 24 * 60 * 60 * 1000
  },
  {
    author_name: "Batista Pereira",
    profile_photo_url: "/avatars/default.png",
    rating: 5,
    relative_time_description: "6 months ago",
    text: "Great service and experience!",
    time: Date.now() - 6 * 30 * 24 * 60 * 60 * 1000
  },
  {
    author_name: "Breno Maciel",
    profile_photo_url: "/avatars/default.png",
    rating: 5,
    relative_time_description: "6 months ago",
    text: "The best of the best",
    time: Date.now() - 6 * 30 * 24 * 60 * 60 * 1000
  },
  {
    author_name: "Caio Amorim",
    profile_photo_url: "/avatars/default.png",
    rating: 4,
    relative_time_description: "6 months ago",
    text: "Great Car",
    time: Date.now() - 6 * 30 * 24 * 60 * 60 * 1000
  },
  {
    author_name: "Temistocles Teixeira",
    profile_photo_url: "/avatars/default.png",
    rating: 5,
    relative_time_description: "6 months ago",
    text: "Very good",
    time: Date.now() - 6 * 30 * 24 * 60 * 60 * 1000
  }
];

export async function GET() {
  if (!GOOGLE_MAPS_API_KEY) {
    // Return fallback reviews if no API key is available
    const avgRating = calculateAverageRating(fallbackReviews);
    return NextResponse.json({ 
      reviews: fallbackReviews, 
      totalRating: avgRating,
      totalReviews: fallbackReviews.length 
    });
  }

  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${GOOGLE_PLACE_ID}&fields=name,rating,reviews,user_ratings_total&key=${GOOGLE_MAPS_API_KEY}`;
    
    const response = await fetch(apiUrl, { 
      next: { revalidate: 3600 } // Cache for 1 hour 
    });
    
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK' || !data.result) {
      throw new Error(`Google Places API error: ${data.status || 'No result'}`);
    }
    
    const reviews = data.result.reviews || [];
    const totalRating = data.result.rating || 4.7;
    const totalReviews = data.result.user_ratings_total || 47;
    
    return NextResponse.json({ 
      reviews, 
      totalRating,
      totalReviews 
    });
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    
    // Return fallback reviews on error
    const avgRating = calculateAverageRating(fallbackReviews);
    return NextResponse.json({ 
      reviews: fallbackReviews, 
      totalRating: avgRating,
      totalReviews: fallbackReviews.length 
    });
  }
}

// Helper function to calculate average rating
function calculateAverageRating(reviews: GoogleReview[]): number {
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal place
} 