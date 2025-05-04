# Auction Web Scraping Guide for Doski Motors

This document explains the web scraping implementation for fetching Tesla auction data from Copart and IAAI.

## Overview

Instead of using official APIs (which require paid credentials), we've implemented a web scraping solution that can extract auction data from the public-facing websites of Copart and IAAI.

The system consists of several components:

1. **Proxy Server** (`/api/auctions/proxy/route.ts`): Handles CORS and authentication issues
2. **Scraper API** (`/api/auctions/scraper/route.ts`): Manages the scraping logic and caching
3. **Frontend Integration** (`/app/components/AuctionWatch.tsx`): Displays the data to users

## Alternative Implementation Without Cheerio

Due to potential compatibility issues with Cheerio and certain environments, we've also provided an alternative implementation:

* **Alternate API** (`/api/auctions/alternate/route.ts`): Provides similar functionality but doesn't use Cheerio, focusing solely on generating simulated data

This implementation can be used in environments where the Cheerio package causes build or runtime issues. The API interface remains the same, so the frontend doesn't need major changes to work with this alternative.

## How It Works

### Data Flow

1. User searches for Tesla vehicles in the AuctionWatch component
2. The component sends a request to the Scraper API
3. The Scraper API checks its cache:
   - If fresh data exists in cache, it returns that
   - Otherwise, it attempts to scrape fresh data
4. The Scraper uses the Proxy Server to make requests to Copart/IAAI
5. The scraped data is analyzed for "good deals" and returned to the frontend

### Current Implementation

In the current implementation, we use simulated data to demonstrate the UI functionality, but we've built the architecture to support real scraping:

- The `realScraperExample` function shows how Cheerio would be used to parse HTML
- The Proxy Server is fully implemented to handle real requests
- The caching system is in place to minimize requests to the auction sites

## Real Implementation Guide

To implement real scraping, you would need to:

1. **Identify page structures**:
   - Use browser developer tools to inspect the HTML structure of Copart and IAAI auction listings
   - Identify the CSS selectors for relevant data (prices, vehicle details, etc.)

2. **Update the scraper functions**:
   - Uncomment and modify the real fetch calls in `scrapeCopart` and `scrapeIAAI`
   - Implement the HTML parsing using Cheerio (example provided)

3. **Handle authentication**:
   - Some auction sites require login
   - You may need to implement cookie handling in the proxy server

## Example Scraping Implementation

Here's an example of how to implement the `scrapeCopart` function with real data:

```typescript
async function scrapeCopart(make: string, model: string): Promise<AuctionVehicle[]> {
  try {
    // Construct search URL
    const searchUrl = `https://www.copart.com/vehicleFinder?query=${encodeURIComponent(make)}%20${encodeURIComponent(model)}`;
    
    // Use our proxy to fetch the page
    const proxyResponse = await fetch(`/api/auctions/proxy?url=${encodeURIComponent(searchUrl)}`);
    const proxyData = await proxyResponse.json();
    
    if (proxyData.error) {
      throw new Error(proxyData.error);
    }
    
    // Parse the HTML
    const $ = cheerio.load(proxyData.data);
    const vehicles: AuctionVehicle[] = [];
    
    // Loop through each vehicle card/listing
    $('.lot-list-view-row').each((i, element) => {
      // Extract data from HTML elements
      const title = $(element).find('.lot-title').text().trim();
      const lotNumber = $(element).find('.lot-number').text().trim();
      const currentBidText = $(element).find('.bid-price').text().trim();
      const currentBid = parseFloat(currentBidText.replace(/[^0-9.]/g, ''));
      const imageUrl = $(element).find('.lot-image img').attr('src') || '';
      const damageType = $(element).find('.damage-type').text().trim();
      // ... extract other fields
      
      // Create vehicle object
      vehicles.push({
        id: `c-${Date.now()}-${i}`,
        source: 'copart',
        title,
        make,
        model: extractModelFromTitle(title),
        year: extractYearFromTitle(title),
        vin: '', // Would need to go to detail page for this
        lot: lotNumber,
        damageType,
        currentBid,
        // ... set other fields
        isFavorite: false,
        link: `https://www.copart.com/lot/${lotNumber}`
      });
    });
    
    return vehicles;
  } catch (error) {
    console.error('Error scraping Copart:', error);
    return [];
  }
}

// Helper functions
function extractYearFromTitle(title: string): number {
  const yearMatch = title.match(/\b(20\d{2}|19\d{2})\b/);
  return yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
}

function extractModelFromTitle(title: string): string {
  // Pattern matching for Tesla models
  if (title.includes('Model S')) return 'Model S';
  if (title.includes('Model 3')) return 'Model 3';
  if (title.includes('Model X')) return 'Model X';
  if (title.includes('Model Y')) return 'Model Y';
  if (title.includes('Cybertruck')) return 'Cybertruck';
  return '';
}
```

## Legal and Ethical Considerations

When implementing web scraping, consider these important points:

1. **Terms of Service**: Review each auction site's terms of service to ensure compliance
2. **Rate Limiting**: Implement rate limiting to avoid overloading their servers
3. **Identify as a Bot**: Some sites require you to identify your scraper in the User-Agent
4. **Data Usage**: Ensure you're using the data in accordance with the sites' terms

## Next Steps

1. **Implement Real Scraping**: Replace simulated data with actual scraped data
2. **Add More Sources**: Extend to other auction sites beyond Copart and IAAI
3. **Improve Analysis**: Enhance the "good deal" detection algorithms
4. **Authentication System**: Implement proper authentication for secured auction sites

For any technical questions about the implementation, contact the Doski Motors development team. 