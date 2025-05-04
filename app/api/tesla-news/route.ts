import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface NewsItem {
  title: string;
  description: string;
  date: string;
  source: string;
  url: string;
  type: 'price' | 'industry' | 'alert';
  imageUrl?: string;
}

/**
 * Fetches Tesla news from multiple reliable sources using their RSS feeds
 */
export async function GET() {
  try {
    const newsItems: NewsItem[] = [];
    
    // Define sources to try - RSS feeds are more reliable than scraping websites
    const sources = [
      {
        name: 'Electrek',
        url: 'https://electrek.co/category/tesla/feed/',
        source: 'Electrek',
        parser: parseRssFeed
      },
      {
        name: 'InsideEVs',
        url: 'https://insideevs.com/tag/tesla/rss/',
        source: 'InsideEVs',
        parser: parseRssFeed
      },
      {
        name: 'CleanTechnica',
        url: 'https://cleantechnica.com/category/clean-transport/tesla/feed/',
        source: 'CleanTechnica',
        parser: parseRssFeed
      }
    ];
    
    // Try each source until we have enough news items
    for (const source of sources) {
      if (newsItems.length >= 6) break; // We have enough items
      
      try {
        console.log(`Trying to fetch news from ${source.name}...`);
        const response = await fetch(source.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          cache: 'no-store'
        });
        
        if (!response.ok) {
          console.log(`Failed to fetch from ${source.name}: ${response.status}`);
          continue;
        }
        
        const xml = await response.text();
        const items = source.parser(xml, source.source);
        
        // Add new items, avoiding duplicates (by title)
        for (const item of items) {
          if (!newsItems.some(existing => existing.title === item.title)) {
            newsItems.push(item);
            if (newsItems.length >= 8) break; // Limit to 8 items
          }
        }
        
        console.log(`Successfully fetched ${items.length} items from ${source.name}`);
      } catch (error) {
        console.error(`Error fetching from ${source.name}:`, error);
      }
    }
    
    // If we couldn't fetch any news from any source, use fallback data
    if (newsItems.length === 0) {
      console.log('No articles found from any source, using fallback data');
      return NextResponse.json({
        status: 'error',
        message: 'Failed to fetch Tesla news from any sources',
        data: getFallbackNews()
      });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Successfully fetched Tesla news',
      data: newsItems.slice(0, 8) // Limit to 8 items
    });
  } catch (error) {
    console.error('Error fetching Tesla news:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      data: getFallbackNews()
    });
  }
}

/**
 * Parse an RSS feed XML string into NewsItem objects
 */
function parseRssFeed(xml: string, sourceName: string): NewsItem[] {
  const items: NewsItem[] = [];
  const $ = cheerio.load(xml, { xmlMode: true });
  
  $('item').slice(0, 10).each((i, element) => {
    try {
      // Extract basic info from RSS
      const title = $(element).find('title').text().trim();
      const link = $(element).find('link').text().trim();
      const description = $(element).find('description').text().trim();
      
      // Parse the pubDate into a readable format
      const pubDate = $(element).find('pubDate').text().trim();
      const date = formatDate(pubDate);
      
      // Try to extract image URL from content or enclosure
      let imageUrl = undefined;
      
      // First check if there's an enclosure with image type
      const enclosure = $(element).find('enclosure');
      if (enclosure.length > 0 && enclosure.attr('type')?.startsWith('image/')) {
        imageUrl = enclosure.attr('url');
      }
      
      // If no enclosure image, look in the content or description for an image
      if (!imageUrl) {
        const content = $(element).find('content\\:encoded, encoded, content').text();
        if (content) {
          const contentDom = cheerio.load(content);
          const img = contentDom('img').first();
          if (img.length > 0) {
            imageUrl = img.attr('src');
          }
        }
        
        // If still no image, try to parse one from the description
        if (!imageUrl && description) {
          const descDom = cheerio.load(description);
          const img = descDom('img').first();
          if (img.length > 0) {
            imageUrl = img.attr('src');
          }
        }
      }
      
      // Determine news type based on content
      let type: 'price' | 'industry' | 'alert' = 'industry';
      const lowerTitle = title.toLowerCase();
      
      if (lowerTitle.includes('price') || 
          lowerTitle.includes('value') ||
          lowerTitle.includes('market') ||
          lowerTitle.includes('sales') ||
          lowerTitle.includes('cost')) {
        type = 'price';
      } else if (lowerTitle.includes('recall') ||
                lowerTitle.includes('warning') ||
                lowerTitle.includes('issue') ||
                lowerTitle.includes('problem') ||
                lowerTitle.includes('investigation')) {
        type = 'alert';
      }
      
      // Create clean description (remove HTML tags)
      const cleanDescription = description
        .replace(/<\/?[^>]+(>|$)/g, '')  // Remove HTML tags
        .slice(0, 200)                    // Limit length
        .trim() + '...';                  // Add ellipsis
      
      if (title && link) {
        items.push({
          title,
          description: cleanDescription,
          date,
          source: sourceName,
          url: link,
          type,
          imageUrl
        });
      }
    } catch (err) {
      console.error('Error parsing RSS item:', err);
    }
  });
  
  return items;
}

/**
 * Format RSS pubDate into a readable date
 */
function formatDate(pubDate: string): string {
  try {
    const date = new Date(pubDate);
    const now = new Date();
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Recent';
    }
    
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Check if it's within the last hour
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      // Format as MM/DD/YYYY
      return date.toLocaleDateString();
    }
  } catch (e) {
    return 'Recent';
  }
}

// Fallback news data in case all fetching fails
function getFallbackNews(): NewsItem[] {
  return [
    {
      title: 'Tesla Model 3 Values Drop 5% After Price Cuts',
      description: 'Used Tesla Model 3 prices have seen a significant drop following Tesla\'s recent price cuts on new vehicles. This creates opportunities for auction buyers to acquire vehicles at potentially lower costs.',
      date: '2 days ago',
      source: 'TeslaMarketWatch',
      url: 'https://www.bloomberg.com/news/articles/2023-04-03/used-tesla-prices-drop-most-since-at-least-2019',
      type: 'price'
    },
    {
      title: 'Battery Replacement Costs Decreasing for Model S/X',
      description: 'Third-party battery refurbishment services are now offering battery replacements at 30% lower costs than before, potentially improving ROI for damaged Tesla purchases.',
      date: '1 week ago',
      source: 'EV Insights',
      url: 'https://electrek.co/2023/02/21/tesla-opens-up-its-service-manuals-and-parts-catalog-for-free/',
      type: 'industry'
    },
    {
      title: 'New Salvage Title Restrictions in California',
      description: 'California has issued new regulations regarding salvage title vehicles and their certification process. This may impact repair costs and timelines for auction vehicles.',
      date: '2 weeks ago',
      source: 'Auto Regulatory News',
      url: 'https://www.dmv.ca.gov/portal/vehicle-industry-services/occupational-licensing/occupational-licenses/salvage-industry/salvage-certificates/',
      type: 'alert'
    },
    {
      title: 'Model Y Retains Highest Value Retention Among EVs',
      description: 'The Tesla Model Y continues to have the best value retention of any electric vehicle on the market, with 3-year-old vehicles maintaining 76% of their original value on average.',
      date: '3 weeks ago',
      source: 'EV Analytics',
      url: 'https://www.kbb.com/car-news/tesla-tops-kelley-blue-book-best-resale-value-awards/',
      type: 'price'
    },
    {
      title: 'Tesla Repair Parts Now Available to Third-Party Shops',
      description: 'Tesla has expanded access to OEM parts for independent repair shops, potentially reducing repair costs for salvage vehicles by up to 20% according to early reports.',
      date: '3 weeks ago',
      source: 'Tesla Parts Network',
      url: 'https://www.tesla.com/support/body-shop-support',
      type: 'industry'
    }
  ];
} 