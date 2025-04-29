'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Vehicle {
  id: string
  title: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  location: string
  image: string
  images: string[]
  condition: string
  transmission: string
  fuelType: string
  bodyStyle: string
  available: boolean
  favorites: boolean
  views: number
  status: 'available' | 'pending' | 'sold'
  description?: string
  features?: string[]
  specifications: {
    [key: string]: string | number | undefined
  }
  featured?: boolean
  titleStatus: 'Clean' | 'Salvage' | 'Rebuilt'
  dateAdded?: string
  dateSold?: string
  purchasePrice?: number
  soldPrice?: number
  evIncentives?: {
    federal: number
    state: number
    local: number
    total: number
    eligibilityNotes: string
  }
  lastModified: string
  version: number
  backupTimestamp?: string
  isDraft?: boolean
}

interface VehicleState {
  vehicles: Vehicle[]
  deletedVehicles: Vehicle[] // Soft delete storage
  totalValue: number
  totalViews: number
  totalLikes: number
  salesMetrics: {
    totalSold: number
    totalRevenue: number
    totalProfit: number
    averageTimeToSell: number // in days
    evIncentivesTotal: number
    evSalesPercentage: number
  }
  inventoryMetrics: {
    averageAge: number // in days
    popularMakes: { make: string; count: number }[]
    priceRanges: { range: string; count: number }[]
    evInventoryPercentage: number
    averageEvIncentive: number
    popularFeatures: { feature: string; count: number }[]
    bestPerformingModels: { 
      model: string
      averageTimeToSell: number
      profit: number
      views: number 
    }[]
    leadConversionRate: number
    peakSalesDays: { day: string; count: number }[]
  }
  draftVehicle: Partial<Vehicle> | null
  draftVehicles: Array<{
    id: string
    vehicle: Partial<Vehicle>
    lastModified: string
    title: string
  }>
  addVehicle: (vehicle: Partial<Vehicle>) => void
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void
  deleteVehicle: (id: string) => void
  restoreVehicle: (id: string) => void
  toggleFavorite: (id: string) => void
  toggleFeatured: (id: string) => void
  updateStatus: (id: string, status: Vehicle['status']) => void
  incrementViews: (id: string) => void
  getVehicle: (id: string) => Vehicle | undefined
  backupVehicles: () => void
  restoreFromBackup: (timestamp: string) => void
  saveDraft: (vehicle: Partial<Vehicle>) => void
  clearDraft: () => void
  saveDraftToList: (vehicle: Partial<Vehicle>, title?: string) => void
  loadDraftFromList: (id: string) => void
  deleteDraftFromList: (id: string) => void
}

const DEFAULT_VEHICLE_IMAGE = '/placeholder-car.jpg'

const calculateSalesMetrics = (vehicles: Vehicle[]) => {
  const soldVehicles = vehicles.filter(v => v.status === 'sold');
  const totalSold = soldVehicles.length;
  
  // Calculate revenue and profit using soldPrice (if available) or listed price
  const totalRevenue = soldVehicles.reduce((sum, v) => {
    const salePrice = v.soldPrice || v.price;
    return sum + salePrice;
  }, 0);
  
  const totalProfit = soldVehicles.reduce((sum, v) => {
    const salePrice = v.soldPrice || v.price;
    const purchasePrice = v.purchasePrice || 0;
    return sum + (salePrice - purchasePrice);
  }, 0);
  
  const evSoldVehicles = soldVehicles.filter(v => v.fuelType === 'Electric');
  const evIncentivesTotal = evSoldVehicles.reduce((sum, v) => sum + (v.evIncentives?.total || 0), 0);
  const evSalesPercentage = totalSold > 0 ? (evSoldVehicles.length / totalSold) * 100 : 0;
  
  const timeToSell = soldVehicles
    .map(v => v.dateSold && v.dateAdded ? 
      (new Date(v.dateSold).getTime() - new Date(v.dateAdded).getTime()) / (1000 * 60 * 60 * 24) : 0
    )
    .filter(days => days > 0);
  
  const averageTimeToSell = timeToSell.length > 0 ? 
    timeToSell.reduce((sum, days) => sum + days, 0) / timeToSell.length : 0;

  return {
    totalSold,
    totalRevenue,
    totalProfit,
    averageTimeToSell,
    evIncentivesTotal,
    evSalesPercentage
  };
};

const calculateInventoryMetrics = (vehicles: Vehicle[]) => {
  const availableVehicles = vehicles.filter(v => v.status !== 'sold');
  
  // Calculate average age
  const ages = availableVehicles
    .map(v => v.dateAdded ? 
      (new Date().getTime() - new Date(v.dateAdded).getTime()) / (1000 * 60 * 60 * 24) : 0
    )
    .filter(days => days > 0);
  
  const averageAge = ages.length > 0 ? 
    ages.reduce((sum, days) => sum + days, 0) / ages.length : 0;

  // Calculate EV metrics
  const evVehicles = availableVehicles.filter(v => v.fuelType === 'Electric');
  const evInventoryPercentage = (evVehicles.length / availableVehicles.length) * 100 || 0;
  const averageEvIncentive = evVehicles.reduce((sum, v) => sum + (v.evIncentives?.total || 0), 0) / evVehicles.length || 0;

  // Popular features analysis
  const featureCounts = availableVehicles.reduce((acc, v) => {
    v.features?.forEach(feature => {
      acc[feature] = (acc[feature] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const popularFeatures = Object.entries(featureCounts)
    .map(([feature, count]) => ({ feature, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Best performing models
  const modelPerformance = vehicles
    .filter(v => v.status === 'sold')
    .reduce((acc, v) => {
      const key = `${v.make} ${v.model}`;
      if (!acc[key]) {
        acc[key] = {
          model: key,
          sales: 0,
          totalProfit: 0,
          totalDaysToSell: 0,
          views: 0
        };
      }
      acc[key].sales++;
      acc[key].totalProfit += (v.soldPrice || v.price) - (v.purchasePrice || 0);
      acc[key].totalDaysToSell += v.dateSold && v.dateAdded ?
        (new Date(v.dateSold).getTime() - new Date(v.dateAdded).getTime()) / (1000 * 60 * 60 * 24) : 0;
      acc[key].views += v.views;
      return acc;
    }, {} as Record<string, any>);

  const bestPerformingModels = Object.values(modelPerformance)
    .map(m => ({
      model: m.model,
      averageTimeToSell: m.totalDaysToSell / m.sales,
      profit: m.totalProfit / m.sales,
      views: m.views / m.sales
    }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5);

  // Peak sales days analysis
  const salesByDay = vehicles
    .filter(v => v.status === 'sold' && v.dateSold)
    .reduce((acc, v) => {
      const day = new Date(v.dateSold!).toLocaleDateString('en-US', { weekday: 'long' });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const peakSalesDays = Object.entries(salesByDay)
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => b.count - a.count);

  // Calculate popular makes
  const makeCount = availableVehicles.reduce((acc, v) => {
    acc[v.make] = (acc[v.make] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const popularMakes = Object.entries(makeCount)
    .map(([make, count]) => ({ make, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate price ranges
  const ranges = [
    { min: 0, max: 10000, label: 'Under $10k' },
    { min: 10000, max: 25000, label: '$10k-$25k' },
    { min: 25000, max: 50000, label: '$25k-$50k' },
    { min: 50000, max: 100000, label: '$50k-$100k' },
    { min: 100000, max: Infinity, label: 'Over $100k' }
  ];

  const priceRanges = ranges.map(range => ({
    range: range.label,
    count: availableVehicles.filter(v => v.price >= range.min && v.price < range.max).length
  }));

  return {
    averageAge,
    popularMakes,
    priceRanges,
    evInventoryPercentage,
    averageEvIncentive,
    popularFeatures,
    bestPerformingModels,
    leadConversionRate: 0, // To be calculated based on leads data
    peakSalesDays
  };
};

// Helper to calculate total value of available vehicles
const calculateTotalValue = (vehicles: Vehicle[]) => {
  return vehicles
    .filter(v => v.status !== 'sold')
    .reduce((sum, v) => sum + v.price, 0);
};

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set, get) => ({
      vehicles: [
        {
          id: '1',
          title: '2020 BMW M3 Competition',
          make: 'BMW',
          model: 'M3',
          year: 2020,
          price: 72000,
          mileage: 15000,
          location: 'San Diego, CA',
          image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068',
          images: [
            'https://images.unsplash.com/photo-1617531653332-bd46c24f2068',
            'https://images.unsplash.com/photo-1607853202273-797f1c22a38e',
            'https://images.unsplash.com/photo-1606664825213-708b757e1a71',
            'https://images.unsplash.com/photo-1580273916550-e323be2ae537'
          ],
          condition: 'Used',
          transmission: 'Automatic',
          fuelType: 'Gasoline',
          bodyStyle: 'Sedan',
          available: true,
          favorites: false,
          views: 245,
          status: 'available',
          featured: false,
          description: 'Pristine condition BMW M3 Competition with full service history.',
          features: [
            'Competition Package',
            'Carbon Fiber Interior Trim',
            'M Sport Exhaust',
            'Head-Up Display'
          ],
          specifications: {
            engine: '3.0L Twin-Turbo Inline-6',
            horsepower: 503,
            torque: 479,
            acceleration: 3.8,
            range: undefined,
            topSpeed: undefined,
            cargo: undefined
          },
          titleStatus: 'Clean',
          lastModified: new Date().toISOString(),
          version: 1
        },
        {
          id: '2',
          title: '2022 Tesla Model Y Performance',
          make: 'Tesla',
          model: 'Model Y',
          year: 2022,
          price: 65000,
          mileage: 8000,
          location: 'San Diego, CA',
          image: 'https://placehold.co/800x600/e6e6e6/4a4a4a?text=Tesla+Model+Y',
          images: [],
          condition: 'Used',
          transmission: 'Automatic',
          fuelType: 'Electric',
          bodyStyle: 'SUV',
          available: true,
          favorites: false,
          views: 189,
          status: 'available',
          featured: false,
          description: 'Fully loaded Tesla Model Y Performance with FSD capability.',
          features: [
            'Full Self-Driving Capability',
            'Premium Interior',
            'Glass Roof',
            '21" Überturbine Wheels'
          ],
          specifications: {
            range: 303,
            acceleration: 3.5,
            topSpeed: 155,
            cargo: 76,
            engine: undefined,
            horsepower: undefined,
            torque: undefined
          },
          titleStatus: 'Clean',
          lastModified: new Date().toISOString(),
          version: 1
        },
        {
          id: '3',
          title: '2021 Porsche 911 Carrera S',
          make: 'Porsche',
          model: '911',
          year: 2021,
          price: 125000,
          mileage: 12000,
          location: 'San Diego, CA',
          image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e',
          images: [
            'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e',
            'https://images.unsplash.com/photo-1611016186353-9af58c69a533',
            'https://images.unsplash.com/photo-1611016186353-9af58c69a533',
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70'
          ],
          condition: 'Used',
          transmission: 'Manual',
          fuelType: 'Gasoline',
          bodyStyle: 'Coupe',
          available: true,
          favorites: false,
          views: 312,
          status: 'available',
          featured: false,
          description: 'Beautiful Porsche 911 Carrera S with rare manual transmission.',
          features: [
            'Sport Chrono Package',
            'PASM Sport Suspension',
            'Sports Exhaust System',
            'GT Sport Steering Wheel'
          ],
          specifications: {
            engine: '3.0L Twin-Turbo Flat-6',
            horsepower: 443,
            torque: 390,
            acceleration: 3.7,
            range: undefined,
            topSpeed: undefined,
            cargo: undefined
          },
          titleStatus: 'Clean',
          lastModified: new Date().toISOString(),
          version: 1
        }
      ],
      totalValue: 262000,
      totalViews: 746,
      totalLikes: 0,
      salesMetrics: {
        totalSold: 0,
        totalRevenue: 0,
        totalProfit: 0,
        averageTimeToSell: 0,
        evIncentivesTotal: 0,
        evSalesPercentage: 0
      },
      inventoryMetrics: {
        averageAge: 0,
        popularMakes: [],
        priceRanges: [],
        evInventoryPercentage: 0,
        averageEvIncentive: 0,
        popularFeatures: [],
        bestPerformingModels: [],
        leadConversionRate: 0,
        peakSalesDays: []
      },
      deletedVehicles: [],
      draftVehicle: null,
      draftVehicles: [],
      addVehicle: (vehicle) =>
        set((state) => {
          const newVehicle: Vehicle = {
            ...vehicle,
            id: Math.random().toString(36).substr(2, 9),
            lastModified: new Date().toISOString(),
            version: 1,
            title: vehicle.title || '',
            make: vehicle.make || '',
            model: vehicle.model || '',
            year: vehicle.year || new Date().getFullYear(),
            price: vehicle.price || 0,
            mileage: vehicle.mileage || 0,
            location: vehicle.location || '',
            image: vehicle.images?.[0] || vehicle.image || DEFAULT_VEHICLE_IMAGE,
            images: vehicle.images || [vehicle.image || DEFAULT_VEHICLE_IMAGE],
            condition: vehicle.condition || 'Used',
            transmission: vehicle.transmission || 'Automatic',
            fuelType: vehicle.fuelType || 'Gasoline',
            bodyStyle: vehicle.bodyStyle || 'Sedan',
            available: true,
            favorites: false,
            views: 0,
            status: vehicle.status || 'available',
            description: vehicle.description || '',
            features: vehicle.features || [],
            specifications: vehicle.specifications || {},
            featured: vehicle.featured || false,
            titleStatus: vehicle.titleStatus || 'Clean',
            dateAdded: new Date().toISOString(),
            dateSold: vehicle.status === 'sold' ? new Date().toISOString() : undefined,
            purchasePrice: vehicle.purchasePrice,
            soldPrice: vehicle.status === 'sold' ? vehicle.price : undefined,
            isDraft: false
          } as Vehicle;
          
          // Create backup before adding
          const timestamp = new Date().toISOString();
          localStorage.setItem(`vehicle-backup-${timestamp}`, 
            JSON.stringify([...state.vehicles])
          );
          
          // Clear draft after successful addition
          const vehicles = [...state.vehicles, newVehicle];
          return {
            vehicles,
            deletedVehicles: state.deletedVehicles,
            draftVehicle: null,
            totalValue: calculateTotalValue(vehicles),
            totalViews: state.totalViews,
            totalLikes: state.totalLikes,
            salesMetrics: calculateSalesMetrics(vehicles),
            inventoryMetrics: calculateInventoryMetrics(vehicles)
          };
        }),
      updateVehicle: (id, updatedVehicle) =>
        set((state) => {
          const vehicles = state.vehicles.map((vehicle) => {
            if (vehicle.id === id) {
              const newVehicle = { 
                ...vehicle, 
                ...updatedVehicle,
                lastModified: new Date().toISOString(),
                version: vehicle.version + 1
              };
              
              // Handle status changes
              if (updatedVehicle.status === 'sold' && vehicle.status !== 'sold') {
                newVehicle.dateSold = new Date().toISOString();
                newVehicle.soldPrice = updatedVehicle.soldPrice || updatedVehicle.price || vehicle.price;
              } else if (updatedVehicle.status && updatedVehicle.status !== 'sold') {
                newVehicle.dateSold = undefined;
                newVehicle.soldPrice = undefined;
              }

              // Handle image updates
              if (updatedVehicle.images?.length) {
                newVehicle.image = updatedVehicle.images[0];
              } else if (updatedVehicle.image) {
                newVehicle.images = [updatedVehicle.image, ...(vehicle.images || []).slice(1)];
              }

              return newVehicle;
            }
            return vehicle;
          });
          
          // Create backup before updating
          const timestamp = new Date().toISOString();
          localStorage.setItem(`vehicle-backup-${timestamp}`, 
            JSON.stringify([...state.vehicles])
          );
          
          return {
            ...state,
            vehicles,
            totalValue: calculateTotalValue(vehicles),
            salesMetrics: calculateSalesMetrics(vehicles),
            inventoryMetrics: calculateInventoryMetrics(vehicles)
          };
        }),
      deleteVehicle: (id) =>
        set((state) => {
          const vehicleToDelete = state.vehicles.find(v => v.id === id);
          if (!vehicleToDelete) return state;

          // Create backup before soft deletion
          const timestamp = new Date().toISOString();
          localStorage.setItem(`vehicle-backup-${timestamp}`, 
            JSON.stringify([...state.vehicles])
          );

          // Move to deletedVehicles instead of permanent deletion
          const deletedVehicles = [...state.deletedVehicles, {
            ...vehicleToDelete,
            lastModified: new Date().toISOString(),
            version: vehicleToDelete.version + 1,
            backupTimestamp: timestamp
          }];

          const vehicles = state.vehicles.filter(v => v.id !== id);

          return {
            ...state,
            vehicles,
            deletedVehicles,
            totalValue: calculateTotalValue(vehicles),
            totalViews: state.totalViews,
            totalLikes: state.totalLikes - (vehicleToDelete.favorites ? 1 : 0),
            salesMetrics: calculateSalesMetrics(vehicles),
            inventoryMetrics: calculateInventoryMetrics(vehicles)
          };
        }),
      restoreVehicle: (id) =>
        set((state) => {
          const vehicleToRestore = state.deletedVehicles.find(v => v.id === id);
          if (!vehicleToRestore) return state;

          const vehicles = [...state.vehicles, {
            ...vehicleToRestore,
            lastModified: new Date().toISOString(),
            version: (vehicleToRestore.version || 0) + 1
          }];

          const deletedVehicles = state.deletedVehicles.filter(v => v.id !== id);

          return {
            vehicles,
            deletedVehicles,
            totalValue: calculateTotalValue(vehicles),
            totalViews: state.totalViews,
            totalLikes: state.totalLikes,
            salesMetrics: calculateSalesMetrics(vehicles),
            inventoryMetrics: calculateInventoryMetrics(vehicles)
          };
        }),
      backupVehicles: () =>
        set((state) => {
          const timestamp = new Date().toISOString();
          localStorage.setItem(`vehicle-backup-${timestamp}`, 
            JSON.stringify([...state.vehicles])
          );
          return state;
        }),
      restoreFromBackup: (timestamp) =>
        set((state) => {
          const backup = localStorage.getItem(`vehicle-backup-${timestamp}`);
          if (!backup) return state;

          const restoredVehicles = JSON.parse(backup);
          return {
            ...state,
            vehicles: restoredVehicles,
          };
        }),
      toggleFavorite: (id) =>
        set((state) => {
          const updatedVehicles = state.vehicles.map((vehicle) =>
            vehicle.id === id ? { ...vehicle, favorites: !vehicle.favorites } : vehicle
          );
          const totalLikes = updatedVehicles.filter(v => v.favorites).length;
          return {
            vehicles: updatedVehicles,
            totalValue: state.totalValue,
            totalViews: state.totalViews,
            totalLikes
          };
        }),
      toggleFeatured: (id) =>
        set((state) => ({
          vehicles: state.vehicles.map((vehicle) =>
            vehicle.id === id ? { ...vehicle, featured: !vehicle.featured } : vehicle
          ),
          totalValue: state.totalValue,
          totalViews: state.totalViews,
          totalLikes: state.totalLikes
        })),
      updateStatus: (id, status) =>
        set((state) => {
          const vehicles = state.vehicles.map((vehicle) =>
            vehicle.id === id ? {
              ...vehicle,
              status,
              dateSold: status === 'sold' ? new Date().toISOString() : vehicle.dateSold
            } : vehicle
          );
          
          return {
            vehicles,
            totalValue: calculateTotalValue(vehicles),
            totalViews: state.totalViews,
            totalLikes: state.totalLikes,
            salesMetrics: calculateSalesMetrics(vehicles),
            inventoryMetrics: calculateInventoryMetrics(vehicles)
          };
        }),
      incrementViews: (id) =>
        set((state) => ({
          vehicles: state.vehicles.map((vehicle) =>
            vehicle.id === id ? { ...vehicle, views: vehicle.views + 1 } : vehicle
          ),
          totalValue: state.totalValue,
          totalViews: state.totalViews + 1,
          totalLikes: state.totalLikes
        })),
      getVehicle: (id) => {
        const state = get();
        return state.vehicles.find((v) => v.id === id);
      },
      saveDraft: (vehicle) =>
        set((state) => ({
          ...state,
          draftVehicle: {
            ...vehicle,
            lastModified: new Date().toISOString(),
            isDraft: true
          }
        })),
      clearDraft: () =>
        set((state) => ({
          ...state,
          draftVehicle: null
        })),
      saveDraftToList: (vehicle, title) => 
        set((state) => {
          const drafts = [...state.draftVehicles];
          // Remove oldest draft if we have 10 already
          if (drafts.length >= 10) {
            drafts.pop();
          }
          
          // Create a new draft
          const draftId = Math.random().toString(36).substr(2, 9);
          const draftTitle = title || `Draft ${vehicle.make || ''} ${vehicle.model || ''} ${new Date().toLocaleString()}`;
          
          drafts.unshift({
            id: draftId,
            vehicle,
            lastModified: new Date().toISOString(),
            title: draftTitle
          });
          
          return { ...state, draftVehicles: drafts };
        }),
      
      loadDraftFromList: (id) =>
        set((state) => {
          const draft = state.draftVehicles.find(d => d.id === id);
          if (draft) {
            return { ...state, draftVehicle: draft.vehicle };
          }
          return state;
        }),
      
      deleteDraftFromList: (id) =>
        set((state) => ({
          ...state,
          draftVehicles: state.draftVehicles.filter(d => d.id !== id)
        })),
    }),
    {
      name: 'vehicle-store',
      version: 3,
      onRehydrateStorage: () => (state) => {
        // Perform data validation on rehydration
        if (state && (!state.vehicles || !Array.isArray(state.vehicles))) {
          console.error('Invalid state structure detected');
          // Attempt to recover from backup
          const backups = Object.keys(localStorage)
            .filter(key => key.startsWith('vehicle-backup-'))
            .sort()
            .reverse();
          
          if (backups.length > 0) {
            const latestBackup = localStorage.getItem(backups[0]);
            if (latestBackup) {
              state.vehicles = JSON.parse(latestBackup);
            }
          }
        }
      }
    }
  )
) 