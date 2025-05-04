import { NextResponse } from 'next/server'

export async function GET() {
  // Static fallback reviews
  const fallbackReviews = [
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
    }
  ];
    
  // Calculate average rating
  const sum = fallbackReviews.reduce((total, review) => total + review.rating, 0);
  const avgRating = Math.round((sum / fallbackReviews.length) * 10) / 10;
  
  return NextResponse.json({ 
    reviews: fallbackReviews, 
    totalRating: avgRating,
    totalReviews: fallbackReviews.length 
  });
} 