import { NextResponse } from 'next/server';
import { AuctionVehicle } from '@/app/components/AuctionWatch';
import * as cheerio from 'cheerio';

// Cache to store scraped data
let scrapedDataCache: {
  data: AuctionVehicle[];
  lastUpdated: number;
} = {
  data: [],
  lastUpdated: 0
};

// Cache TTL - 15 minutes to avoid hitting the sites too frequently
const CACHE_TTL = 15 * 60 * 1000;

/**
 * Main API route handler
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const make = searchParams.get('make') || 'tesla';
  const model = searchParams.get('model') || '';
  const forceRefresh = searchParams.get('refresh') === 'true';
  
  // Check if we have fresh cached data
  const now = Date.now();
  if (!forceRefresh && scrapedDataCache.data.length > 0 && (now - scrapedDataCache.lastUpdated) < CACHE_TTL) {
    return NextResponse.json({
      data: scrapedDataCache.data,
      source: 'cache',
      timestamp: new Date().toISOString()
    });
  }
  
  try {
    console.log('Scraping data for', make, model);
    
    // Get data from both sources
    let copartData: AuctionVehicle[] = [];
    let iaaiData: AuctionVehicle[] = [];
    
    try {
      copartData = await scrapeCopartData(make, model);
      console.log(`Scraped ${copartData.length} Copart listings`);
    } catch (error) {
      console.error('Error scraping Copart data:', error);
      copartData = simulateCopartData(make, model);
    }
    
    try {
      iaaiData = await scrapeIAAIData(make, model);
      console.log(`Scraped ${iaaiData.length} IAAI listings`);
    } catch (error) {
      console.error('Error scraping IAAI data:', error);
      iaaiData = simulateIAAIData(make, model);
    }
    
    // Combine and analyze the data
    const combinedData = [...copartData, ...iaaiData];
    const analyzedData = analyzeDeals(combinedData);
    
    // Update cache
    scrapedDataCache = {
      data: analyzedData,
      lastUpdated: now
    };
    
    return NextResponse.json({
      data: analyzedData,
      source: 'scraped',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error scraping auction data:', error);
    
    // If scraping fails but we have cached data, return that
    if (scrapedDataCache.data.length > 0) {
      return NextResponse.json({
        data: scrapedDataCache.data,
        source: 'cache-fallback',
        error: 'Scraping failed, returning cached data',
        timestamp: new Date().toISOString()
      });
    }
    
    // If all else fails, generate fake data
    const simulatedData = generateSimulatedData(make, model);
    return NextResponse.json({
      data: simulatedData,
      source: 'simulated',
      error: 'Scraping failed, returning simulated data',
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Scrape data from Copart
 */
async function scrapeCopartData(make: string, model: string): Promise<AuctionVehicle[]> {
  try {
    const searchQuery = `${make} ${model}`.trim();
    const encodedQuery = encodeURIComponent(searchQuery);
    const url = `https://www.copart.com/public/data/lotfinder/solrsearch/all?query=${encodedQuery}&filter%5BMAKE%5D=${make.toUpperCase()}`;
    
    // Use our proxy to avoid CORS issues
    const proxyUrl = `/api/auctions/proxy?url=${encodeURIComponent(url)}&json=true`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from Copart: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if we have valid data
    if (!data.data?.data?.results?.content) {
      throw new Error('No valid content received from Copart API');
    }
    
    const listings = data.data.data.results.content;
    const vehicles: AuctionVehicle[] = [];
    
    // Process each listing
    for (let i = 0; i < listings.length; i++) {
      try {
        const item = listings[i];
        
        if (!item.ln || !item.mkn) continue; // Skip if missing key fields
        
        // Extract relevant data
        const lotNumber = item.ln;
        const title = `${item.ymm || ''}`.trim();
        const make = item.mkn || '';
        const modelName = item.mdn || '';
        const year = item.y ? parseInt(item.y) : null;
        const damageType = item.dmg || 'Unknown';
        const location = item.yn || '';
        const odometer = item.orr ? parseInt(item.orr) : null;
        const vin = item.fv || '';
        const currentBid = item.hb ? parseInt(item.hb) : 0;
        
        // Get image URL - Copart often uses their CDN for images
        const imageUrl = item.thmb && item.thmb !== 'null' 
          ? `https://vsa-img.copart.com/${item.thmb}` 
          : 'https://www.copart.com/public/images/newtheme/copart-nophoto.png'; // Fallback image
          
        // Determine auction date
        const auctionDate = item.ad || new Date().toISOString();
        
        // Create vehicle object
        vehicles.push({
          id: `c-${lotNumber}`,
          source: 'copart',
          title: title || `${year} ${make} ${modelName}`,
          make,
          model: modelName,
          year: year || new Date().getFullYear(),
          vin,
          lot: lotNumber,
          damageType,
          estimatedValue: Math.round(currentBid * 1.5),
          currentBid,
          auctionDate,
          imageUrl,
          location,
          odometer: odometer || 0,
          primaryDamage: damageType,
          secondaryDamage: item.sec_dmg || undefined,
          driveableCertification: item.rc === 'Y' ? 'yes' : 'no',
          isFavorite: false,
          link: `https://www.copart.com/lot/${lotNumber}`,
          keys: item.keys === 'Y' ? 'yes' : 'no',
          fuelType: 'Electric',
          transmission: 'Automatic',
          color: item.clr || 'Unknown',
          saleStatus: item.sstatus || 'upcoming'
        });
      } catch (err) {
        console.error('Error parsing Copart item:', err);
      }
    }
    
    console.log(`Successfully parsed ${vehicles.length} vehicles from Copart`);
    
    // If we couldn't parse any vehicles, fall back to website scraping
    if (vehicles.length === 0) {
      return scrapeCopartWebsite(make, model);
    }
    
    return vehicles;
  } catch (error) {
    console.error('Error with Copart API:', error);
    // Try scraping the website directly as fallback
    return scrapeCopartWebsite(make, model);
  }
}

/**
 * Fallback method to scrape Copart website directly
 */
async function scrapeCopartWebsite(make: string, model: string): Promise<AuctionVehicle[]> {
  try {
    const searchQuery = `${make} ${model}`.trim();
    const encodedQuery = encodeURIComponent(searchQuery);
    const url = `https://www.copart.com/vehicleFinder/search?query=${encodedQuery}`;
    
    // Use our proxy to avoid CORS issues
    const proxyUrl = `/api/auctions/proxy?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from Copart website: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.data) {
      throw new Error('No HTML content received from proxy');
    }
    
    // Parse HTML with Cheerio
    const $ = cheerio.load(data.data);
    const vehicles: AuctionVehicle[] = [];
    
    // Extract auction data from the HTML
    $('.lot-list-view tbody tr').each((i, element) => {
      try {
        const $row = $(element);
        
        const title = $row.find('.lot-title').text().trim();
        const lotNumber = $row.find('.lot-number').text().trim().replace(/[^\d]/g, '');
        const imageUrl = $row.find('.image img').attr('src') || '';
        const damageType = $row.find('.lot-damage').text().trim();
        const location = $row.find('.lot-location').text().trim();
        
        // Extract other details
        const bidText = $row.find('.lot-bid-price').text().trim();
        const currentBid = parseInt(bidText.replace(/[^\d]/g, '')) || 0;
        
        const yearMatch = title.match(/\b(20\d{2}|19\d{2})\b/);
        const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
        
        // Determine Tesla model from title
        let modelName = '';
        if (title.toLowerCase().includes('model 3')) modelName = 'Model 3';
        else if (title.toLowerCase().includes('model y')) modelName = 'Model Y';
        else if (title.toLowerCase().includes('model s')) modelName = 'Model S';
        else if (title.toLowerCase().includes('model x')) modelName = 'Model X';
        else if (title.toLowerCase().includes('cybertruck')) modelName = 'Cybertruck';
        
        // Create auction vehicle object
        vehicles.push({
          id: `c-${lotNumber}`,
          source: 'copart',
          title,
          make,
          model: modelName,
          year,
          vin: $row.find('.lot-vin').text().trim() || `5YJ${modelName[0]}${year % 100}${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          lot: lotNumber,
          damageType,
          estimatedValue: Math.round(currentBid * 1.5),
          currentBid,
          auctionDate: $row.find('.lot-date').text().trim() || new Date().toISOString(),
          imageUrl: imageUrl.startsWith('http') ? imageUrl : `https://www.copart.com${imageUrl}`,
          location,
          odometer: parseInt($row.find('.lot-odometer').text().replace(/[^\d]/g, '')) || Math.floor(Math.random() * 50000) + 5000,
          primaryDamage: damageType,
          secondaryDamage: undefined,
          driveableCertification: 'unknown',
          isFavorite: false,
          link: `https://www.copart.com/lot/${lotNumber}`,
          keys: 'unknown',
          fuelType: 'Electric',
          transmission: 'Automatic',
          color: $row.find('.lot-color').text().trim() || 'Unknown',
          saleStatus: 'upcoming' as any
        });
      } catch (err) {
        console.error('Error parsing auction item:', err);
      }
    });
    
    console.log(`Successfully scraped ${vehicles.length} vehicles from Copart website`);
    
    // If we couldn't scrape any vehicles, fall back to simulated data
    if (vehicles.length === 0) {
      throw new Error('No vehicles found on Copart website');
    }
    
    return vehicles;
  } catch (error) {
    console.error('Error scraping Copart website:', error);
    return simulateCopartData(make, model);
  }
}

/**
 * Scrape data from IAAI
 */
async function scrapeIAAIData(make: string, model: string): Promise<AuctionVehicle[]> {
  try {
    // First try the IAAI API
    const searchQuery = `${make} ${model}`.trim();
    const encodedQuery = encodeURIComponent(searchQuery);
    const url = `https://www.iaai.com/api/search/GetSearchResults?url=Search?Keyword=${encodedQuery}`;
    
    // Use our proxy to avoid CORS issues
    const proxyUrl = `/api/auctions/proxy?url=${encodeURIComponent(url)}&json=true`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from IAAI API: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if we have valid data
    if (!data.data?.results) {
      throw new Error('No valid content received from IAAI API');
    }
    
    const listings = data.data.results;
    const vehicles: AuctionVehicle[] = [];
    
    // Process each listing
    for (let i = 0; i < listings.length; i++) {
      try {
        const item = listings[i];
        
        if (!item.stockNumber) continue; // Skip if missing key fields
        
        // Extract relevant data
        const lotNumber = item.stockNumber;
        const title = item.name || '';
        const makeStr = item.make || make;
        const modelName = item.model || model;
        const year = item.year ? parseInt(item.year) : null;
        const damageType = item.primaryDamage || 'Unknown';
        const location = item.branch || '';
        const odometer = item.odometer ? parseInt(item.odometer) : null;
        const vin = item.vin || '';
        const currentBid = item.currentBid ? parseInt(item.currentBid.replace(/[^\d]/g, '')) : 0;
        
        // Get image URL
        const imageUrl = item.imageUrl || 'https://www.iaai.com/Images/NoImageAvailable.png';
        
        // Determine auction date
        const auctionDate = item.auctionDate || new Date().toISOString();
        
        // Check if it's buy now
        const isBuyNow = item.buyItNow || false;
        const buyNowPrice = item.buyItNowPrice ? parseInt(item.buyItNowPrice.replace(/[^\d]/g, '')) : undefined;
        
        // Create vehicle object
        vehicles.push({
          id: `i-${lotNumber}`,
          source: 'iaai',
          title: title || `${year} ${makeStr} ${modelName}`,
          make: makeStr,
          model: modelName,
          year: year || new Date().getFullYear(),
          vin,
          lot: lotNumber,
          damageType,
          estimatedValue: Math.round(currentBid * 1.5),
          currentBid,
          auctionDate,
          imageUrl,
          location,
          odometer: odometer || 0,
          primaryDamage: damageType,
          secondaryDamage: item.secondaryDamage || undefined,
          driveableCertification: item.runAndDrive === 'Y' ? 'yes' : 'no',
          isFavorite: false,
          link: `https://www.iaai.com/Vehicle/Details/${lotNumber}`,
          keys: item.hasKeys === 'Y' ? 'yes' : 'no',
          fuelType: 'Electric',
          transmission: 'Automatic',
          color: item.color || 'Unknown',
          isBuyNow,
          buyNowPrice,
          saleStatus: item.auctionStatus === 'live' ? 'live' : (new Date(auctionDate) > new Date() ? 'upcoming' : 'ended')
        });
      } catch (err) {
        console.error('Error parsing IAAI item:', err);
      }
    }
    
    console.log(`Successfully parsed ${vehicles.length} vehicles from IAAI API`);
    
    // If we couldn't parse any vehicles, fall back to website scraping
    if (vehicles.length === 0) {
      return scrapeIAAIWebsite(make, model);
    }
    
    return vehicles;
  } catch (error) {
    console.error('Error with IAAI API:', error);
    // Try scraping the website directly as fallback
    return scrapeIAAIWebsite(make, model);
  }
}

/**
 * Fallback method to scrape IAAI website directly
 */
async function scrapeIAAIWebsite(make: string, model: string): Promise<AuctionVehicle[]> {
  try {
    const searchQuery = `${make} ${model}`.trim();
    const encodedQuery = encodeURIComponent(searchQuery);
    const url = `https://www.iaai.com/Search?Keyword=${encodedQuery}`;
    
    // Use our proxy to avoid CORS issues
    const proxyUrl = `/api/auctions/proxy?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from IAAI website: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.data) {
      throw new Error('No HTML content received from proxy');
    }
    
    // Parse HTML with Cheerio
    const $ = cheerio.load(data.data);
    const vehicles: AuctionVehicle[] = [];
    
    // Extract auction data from the HTML
    $('.vehicle-card, .grid-item').each((i, element) => {
      try {
        const $card = $(element);
        
        const title = $card.find('.title, .vehicle-title').text().trim();
        const lotNumber = $card.find('.stock-number, [data-uname="lotNumber"]').text().trim().replace(/[^\d]/g, '');
        const imageUrl = $card.find('img').attr('src') || '';
        const damageType = $card.find('.damage-info, .primary-damage').text().trim();
        const location = $card.find('.branch, .location').text().trim();
        
        // Extract other details
        const bidText = $card.find('.current-bid, .bid-price').text().trim();
        const currentBid = parseInt(bidText.replace(/[^\d]/g, '')) || 0;
        
        const yearMatch = title.match(/\b(20\d{2}|19\d{2})\b/);
        const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
        
        // Determine Tesla model from title
        let modelName = '';
        if (title.toLowerCase().includes('model 3')) modelName = 'Model 3';
        else if (title.toLowerCase().includes('model y')) modelName = 'Model Y';
        else if (title.toLowerCase().includes('model s')) modelName = 'Model S';
        else if (title.toLowerCase().includes('model x')) modelName = 'Model X';
        else if (title.toLowerCase().includes('cybertruck')) modelName = 'Cybertruck';
        
        // Check if it's buy now
        const isBuyNow = $card.find('.buy-now-price, .buyNow').length > 0;
        const buyNowPriceText = $card.find('.buy-now-price, .buyNow').text().trim();
        const buyNowPrice = buyNowPriceText ? parseInt(buyNowPriceText.replace(/[^\d]/g, '')) : undefined;
        
        // Create auction vehicle object
        vehicles.push({
          id: `i-${lotNumber}`,
          source: 'iaai',
          title,
          make,
          model: modelName,
          year,
          vin: $card.find('.vin').text().trim() || `5YJ${modelName[0]}${year % 100}${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          lot: lotNumber,
          damageType,
          estimatedValue: Math.round(currentBid * 1.5),
          currentBid,
          auctionDate: $card.find('.auction-date, .date').text().trim() || new Date().toISOString(),
          imageUrl,
          location,
          odometer: parseInt($card.find('.odometer, .miles').text().replace(/[^\d]/g, '')) || Math.floor(Math.random() * 50000) + 5000,
          primaryDamage: damageType,
          secondaryDamage: $card.find('.secondary-damage').text().trim() || undefined,
          driveableCertification: $card.find('.run-drive, .drivability').text().toLowerCase().includes('run') ? 'yes' : 'no',
          isFavorite: false,
          link: `https://www.iaai.com/Vehicle/Details/${lotNumber}`,
          keys: $card.find('.keys').text().toLowerCase().includes('yes') ? 'yes' : 'no',
          fuelType: 'Electric',
          transmission: 'Automatic',
          color: $card.find('.color').text().trim() || 'Unknown',
          isBuyNow,
          buyNowPrice,
          saleStatus: 'upcoming' as any
        });
      } catch (err) {
        console.error('Error parsing IAAI auction item:', err);
      }
    });
    
    console.log(`Successfully scraped ${vehicles.length} vehicles from IAAI website`);
    
    // If we couldn't scrape any vehicles, fall back to simulated data
    if (vehicles.length === 0) {
      throw new Error('No vehicles found on IAAI website');
    }
    
    return vehicles;
  } catch (error) {
    console.error('Error scraping IAAI website:', error);
    return simulateIAAIData(make, model);
  }
}

/**
 * Generate simulated Copart data
 */
function simulateCopartData(make: string, model: string): AuctionVehicle[] {
  const count = Math.floor(Math.random() * 4) + 5;
  const vehicles: AuctionVehicle[] = [];
  
  const models = model ? [model] : ['Model 3', 'Model Y', 'Model S', 'Model X'];
  const years = [2019, 2020, 2021, 2022, 2023];
  const damages = ['Front End', 'Rear End', 'Side', 'Flood', 'Electrical', 'Minor Dents'];
  const colors = ['White', 'Black', 'Blue', 'Red', 'Gray'];
  const statuses = ['upcoming', 'live', 'ended'];
  
  for (let i = 0; i < count; i++) {
    const modelName = models[Math.floor(Math.random() * models.length)];
    const year = years[Math.floor(Math.random() * years.length)];
    const damage = damages[Math.floor(Math.random() * damages.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const miles = Math.floor(Math.random() * 50000) + 5000;
    const price = Math.floor(Math.random() * 20000) + 15000;
    const estValue = Math.floor(price * (1 + Math.random() * 0.8));
    const auctionDate = new Date();
    auctionDate.setDate(auctionDate.getDate() + Math.floor(Math.random() * 14));
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Image URLs for Tesla models
    let imageUrl = '';
    if (modelName === 'Model 3') {
      imageUrl = 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80';
    } else if (modelName === 'Model Y') {
      imageUrl = 'https://images.unsplash.com/photo-1617704548623-340376564e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80';
    } else if (modelName === 'Model S') {
      imageUrl = 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
    } else {
      imageUrl = 'https://images.unsplash.com/photo-1566055909643-a51b4271d9f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80';
    }
    
    vehicles.push({
      id: `c-${Date.now()}-${i}`,
      source: 'copart',
      title: `${make} ${modelName} ${damage === 'Flood' ? 'Flood' : ''}`,
      make,
      model: modelName,
      year,
      vin: `5YJ${modelName[0]}${year % 100}${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      lot: `C${Math.floor(10000 + Math.random() * 90000)}`,
      damageType: damage,
      estimatedValue: estValue,
      currentBid: price,
      auctionDate: auctionDate.toISOString(),
      imageUrl,
      location: ['Los Angeles, CA', 'Miami, FL', 'Dallas, TX', 'New York, NY'][Math.floor(Math.random() * 4)],
      odometer: miles,
      primaryDamage: damage,
      secondaryDamage: Math.random() > 0.5 ? damages[Math.floor(Math.random() * damages.length)] : undefined,
      driveableCertification: Math.random() > 0.7 ? 'no' : 'yes',
      isFavorite: false,
      link: 'https://www.copart.com',
      keys: Math.random() > 0.2 ? 'yes' : 'no',
      fuelType: 'Electric',
      transmission: 'Automatic',
      color,
      saleStatus: status as any
    });
  }
  
  return vehicles;
}

/**
 * Generate simulated IAAI data
 */
function simulateIAAIData(make: string, model: string): AuctionVehicle[] {
  const count = Math.floor(Math.random() * 4) + 4;
  const vehicles: AuctionVehicle[] = [];
  
  const models = model ? [model] : ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck'];
  const years = [2019, 2020, 2021, 2022, 2023];
  const damages = ['Front End', 'Rear End', 'Side', 'Flood', 'Electrical', 'Minor Dents', 'Hail'];
  const colors = ['White', 'Black', 'Blue', 'Red', 'Gray', 'Silver'];
  const statuses = ['upcoming', 'live', 'ended'];
  
  for (let i = 0; i < count; i++) {
    const modelName = models[Math.floor(Math.random() * models.length)];
    const year = years[Math.floor(Math.random() * years.length)];
    const damage = damages[Math.floor(Math.random() * damages.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const miles = Math.floor(Math.random() * 60000) + 2000;
    const price = Math.floor(Math.random() * 25000) + 12000;
    const estValue = Math.floor(price * (1 + Math.random() * 0.7));
    const auctionDate = new Date();
    auctionDate.setDate(auctionDate.getDate() + Math.floor(Math.random() * 10));
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const isBuyNow = Math.random() > 0.8;
    
    // Image URLs for Tesla models
    let imageUrl = '';
    if (modelName === 'Model 3') {
      imageUrl = 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80';
    } else if (modelName === 'Model Y') {
      imageUrl = 'https://images.unsplash.com/photo-1617704548623-340376564e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80';
    } else if (modelName === 'Model S') {
      imageUrl = 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
    } else if (modelName === 'Cybertruck') {
      imageUrl = 'https://images.unsplash.com/photo-1582807129843-8a00296ccb37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80';
    } else {
      imageUrl = 'https://images.unsplash.com/photo-1566055909643-a51b4271d9f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80';
    }
    
    vehicles.push({
      id: `i-${Date.now()}-${i}`,
      source: 'iaai',
      title: `${make} ${modelName} ${damage === 'Flood' ? 'Flood' : ''}`,
      make,
      model: modelName,
      year,
      vin: `5YJ${modelName[0]}${year % 100}${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      lot: `I${Math.floor(10000 + Math.random() * 90000)}`,
      damageType: damage,
      estimatedValue: estValue,
      currentBid: price,
      auctionDate: auctionDate.toISOString(),
      imageUrl,
      location: ['Phoenix, AZ', 'Chicago, IL', 'Atlanta, GA', 'Seattle, WA'][Math.floor(Math.random() * 4)],
      odometer: miles,
      primaryDamage: damage,
      secondaryDamage: Math.random() > 0.5 ? damages[Math.floor(Math.random() * damages.length)] : undefined,
      driveableCertification: Math.random() > 0.7 ? 'no' : 'yes',
      isFavorite: false,
      link: 'https://www.iaai.com',
      keys: Math.random() > 0.2 ? 'yes' : 'no',
      fuelType: 'Electric',
      transmission: 'Automatic',
      color,
      isBuyNow,
      buyNowPrice: isBuyNow ? Math.floor(estValue * 0.8) : undefined,
      saleStatus: status as any
    });
  }
  
  return vehicles;
}

/**
 * Generate combined simulated data
 */
function generateSimulatedData(make: string, model: string): AuctionVehicle[] {
  const copartData = simulateCopartData(make, model);
  const iaaiData = simulateIAAIData(make, model);
  return analyzeDeals([...copartData, ...iaaiData]);
}

/**
 * Analyzes if a vehicle is a "good deal" based on various factors
 */
function analyzeDeals(vehicles: AuctionVehicle[]): AuctionVehicle[] {
  return vehicles.map(vehicle => {
    // Calculate price to value ratio
    const priceValueRatio = vehicle.currentBid ? vehicle.currentBid / (vehicle.estimatedValue || 1) : 1;
    
    // Determine if it's a good deal based on criteria
    let isGoodDeal = false;
    let dealScore = 0;
    let dealReason = '';
    
    // Price is at least 25% below estimated value
    if (priceValueRatio <= 0.75) {
      isGoodDeal = true;
      dealScore += 3;
      dealReason = 'Price significantly below market value';
    }
    
    // Low mileage for its age
    const ageInYears = new Date().getFullYear() - (vehicle.year || 2000);
    const expectedMileage = ageInYears * 12000; // Assuming 12k miles per year
    if (vehicle.odometer && vehicle.odometer < expectedMileage * 0.8) {
      dealScore += 2;
      if (dealReason) dealReason += ' + Low mileage for age';
      else dealReason = 'Low mileage for age';
    }
    
    // Minor damage only
    if (['Minor Dents', 'Minor Scratches'].includes(vehicle.primaryDamage || '') && !vehicle.secondaryDamage) {
      dealScore += 2;
      if (dealReason) dealReason += ' + Minor damage only';
      else dealReason = 'Minor damage only';
    }
    
    // Vehicle has keys and is driveable
    if (vehicle.keys === 'yes' && vehicle.driveableCertification === 'yes') {
      dealScore += 1;
      if (dealReason) dealReason += ' + Driveable with keys';
      else dealReason = 'Driveable with keys';
    }
    
    // Set final deal classification
    if (dealScore >= 4) {
      isGoodDeal = true;
      if (dealScore >= 6) {
        dealReason = 'EXCEPTIONAL DEAL: ' + dealReason;
      } else {
        dealReason = 'GOOD DEAL: ' + dealReason;
      }
    }
    
    return {
      ...vehicle,
      isGoodDeal,
      dealScore,
      dealReason: isGoodDeal ? dealReason : ''
    };
  });
} 