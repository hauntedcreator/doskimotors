import { NextResponse } from 'next/server';
import { AuctionVehicle } from '@/app/components/AuctionWatch';

// Cache to store generated data
let cachedData: {
  data: AuctionVehicle[];
  lastUpdated: number;
} = {
  data: [],
  lastUpdated: 0
};

// Cache TTL - 15 minutes
const CACHE_TTL = 15 * 60 * 1000;

/**
 * Main API route handler - alternative implementation without Cheerio
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const make = searchParams.get('make') || 'tesla';
  const model = searchParams.get('model') || '';
  const forceRefresh = searchParams.get('refresh') === 'true';
  
  // Check if we have fresh cached data
  const now = Date.now();
  if (!forceRefresh && cachedData.data.length > 0 && (now - cachedData.lastUpdated) < CACHE_TTL) {
    return NextResponse.json({
      data: cachedData.data,
      source: 'cache',
      timestamp: new Date().toISOString()
    });
  }
  
  try {
    console.log('Generating simulated data for', make, model);
    
    // Generate simulated data
    const simulatedData = generateSimulatedData(make, model);
    
    // Update cache
    cachedData = {
      data: simulatedData,
      lastUpdated: now
    };
    
    return NextResponse.json({
      data: simulatedData,
      source: 'simulated',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating simulated data:', error);
    
    // If we have cached data, return that
    if (cachedData.data.length > 0) {
      return NextResponse.json({
        data: cachedData.data,
        source: 'cache-fallback',
        error: 'Data generation failed, returning cached data',
        timestamp: new Date().toISOString()
      });
    }
    
    // Otherwise return an empty array
    return NextResponse.json({
      data: [],
      source: 'empty',
      error: 'Failed to generate data and no cache available',
      timestamp: new Date().toISOString()
    });
  }
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
      title: `${year} ${make} ${modelName} ${damage === 'Flood' ? 'Flood' : ''}`,
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
      title: `${year} ${make} ${modelName} ${damage === 'Flood' ? 'Flood' : ''}`,
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