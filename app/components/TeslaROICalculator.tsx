'use client'

import { useState, useEffect } from 'react'
import { FiDollarSign, FiTrendingUp, FiInfo } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

// Tesla market value estimates by model and year (average retail prices)
const TESLA_VALUES = {
  'Model 3': {
    2018: { base: 32000, performance: 41000 },
    2019: { base: 35000, performance: 44000 },
    2020: { base: 38000, performance: 47000 },
    2021: { base: 41000, performance: 51000 },
    2022: { base: 44000, performance: 55000 },
    2023: { base: 46000, performance: 57000 }
  },
  'Model Y': {
    2020: { base: 40000, performance: 49000 },
    2021: { base: 45000, performance: 54000 },
    2022: { base: 49000, performance: 58000 },
    2023: { base: 52000, performance: 61000 }
  },
  'Model S': {
    2018: { base: 55000, performance: 70000 },
    2019: { base: 65000, performance: 80000 },
    2020: { base: 72000, performance: 88000 },
    2021: { base: 80000, performance: 95000 },
    2022: { base: 88000, performance: 105000 },
    2023: { base: 94000, performance: 112000 }
  },
  'Model X': {
    2018: { base: 70000, performance: 85000 },
    2019: { base: 78000, performance: 92000 },
    2020: { base: 85000, performance: 100000 },
    2021: { base: 95000, performance: 110000 },
    2022: { base: 105000, performance: 120000 },
    2023: { base: 110000, performance: 125000 }
  },
  'Cybertruck': {
    2023: { base: 110000, performance: 125000 }
  }
};

// Repair cost estimates by damage type
const REPAIR_COSTS = {
  'Front End': {
    minor: 5000,
    moderate: 8000,
    severe: 12000
  },
  'Rear End': {
    minor: 4000,
    moderate: 7000,
    severe: 10000
  },
  'Side': {
    minor: 3500,
    moderate: 6000,
    severe: 9000
  },
  'Electrical': {
    minor: 5000,
    moderate: 10000,
    severe: 20000
  },
  'Hail': {
    minor: 3000,
    moderate: 5000,
    severe: 8000
  },
  'Flood': {
    minor: 8000,
    moderate: 15000,
    severe: 25000
  },
  'Battery': {
    minor: 7000,
    moderate: 15000, 
    severe: 25000
  }
};

// Fee estimates
const FEE_ESTIMATES = {
  auctionBuyerFee: 0.1, // 10% of purchase price
  transportBaseFee: 450,
  transportPerMile: 1.2,
  storageFee: 45, // per day
  inspectionFee: 175,
  registrationFee: 300,
  salesTax: 0.07 // 7% sales tax
};

interface ROICalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    model: string;
    year: number;
    purchasePrice: number;
    damageType: string;
    odometer: number;
  };
}

export default function TeslaROICalculator({ isOpen, onClose, initialData }: ROICalculatorProps) {
  // Vehicle data
  const [model, setModel] = useState(initialData?.model || 'Model 3');
  const [trim, setTrim] = useState('base');
  const [year, setYear] = useState(initialData?.year || 2022);
  const [purchasePrice, setPurchasePrice] = useState(initialData?.purchasePrice || 25000);
  const [damageType, setDamageType] = useState(initialData?.damageType || 'Front End');
  const [damageSeverity, setDamageSeverity] = useState('moderate');
  const [odometer, setOdometer] = useState(initialData?.odometer || 20000);
  
  // Repair costs
  const [repairCost, setRepairCost] = useState(8000);
  const [batteryReplacement, setBatteryReplacement] = useState(false);
  const [batteryReplacementCost, setBatteryReplacementCost] = useState(14000);
  const [motorReplacement, setMotorReplacement] = useState(false);
  const [motorReplacementCost, setMotorReplacementCost] = useState(5000);
  const [additionalPartsCost, setAdditionalPartsCost] = useState(0);
  const [laborCost, setLaborCost] = useState(0);
  
  // Fees and transport
  const [auctionFees, setAuctionFees] = useState(0);
  const [transportCost, setTransportCost] = useState(800);
  const [storageTime, setStorageTime] = useState(5);
  const [storageCost, setStorageCost] = useState(225);
  const [otherFees, setOtherFees] = useState(500);
  
  // Sales
  const [estimatedListPrice, setEstimatedListPrice] = useState(0);
  const [salesCommission, setSalesCommission] = useState(0);
  const [salesTax, setSalesTax] = useState(0);
  
  // Results
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [estimatedProfit, setEstimatedProfit] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);
  const [roi, setRoi] = useState(0);
  
  // Years available for selected model
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  
  // Update available years when model changes
  useEffect(() => {
    if (model && TESLA_VALUES[model]) {
      const years = Object.keys(TESLA_VALUES[model]).map(year => parseInt(year));
      setAvailableYears(years.sort((a, b) => b - a)); // Sort descending
      
      // Set year to most recent if current year isn't available
      if (!years.includes(year)) {
        setYear(years[0]);
      }
    }
  }, [model]);
  
  // Calculate auction fees when purchase price changes
  useEffect(() => {
    setAuctionFees(Math.round(purchasePrice * FEE_ESTIMATES.auctionBuyerFee));
  }, [purchasePrice]);
  
  // Calculate storage cost when storage time changes
  useEffect(() => {
    setStorageCost(storageTime * FEE_ESTIMATES.storageFee);
  }, [storageTime]);
  
  // Calculate sales tax
  useEffect(() => {
    setSalesTax(Math.round(estimatedListPrice * FEE_ESTIMATES.salesTax));
  }, [estimatedListPrice]);
  
  // Update repair costs when damage type or severity changes
  useEffect(() => {
    if (REPAIR_COSTS[damageType]) {
      setRepairCost(REPAIR_COSTS[damageType][damageSeverity]);
    }
  }, [damageType, damageSeverity]);
  
  // Get base market value 
  const getBaseMarketValue = () => {
    if (TESLA_VALUES[model] && TESLA_VALUES[model][year]) {
      const baseValue = TESLA_VALUES[model][year][trim];
      
      // Adjust for mileage (rough estimate: -$0.20 per mile over 10k/year)
      const expectedMileage = (new Date().getFullYear() - year) * 10000;
      const mileageAdjustment = odometer > expectedMileage ? 
        -((odometer - expectedMileage) * 0.2) : 0;
      
      return baseValue + mileageAdjustment;
    }
    return 0;
  };
  
  // Calculate totals
  const calculateTotals = () => {
    // Calculate base market value first
    const marketValue = getBaseMarketValue();
    setEstimatedListPrice(marketValue);
    
    // Calculate total repair costs
    const totalRepairCost = repairCost + 
      (batteryReplacement ? batteryReplacementCost : 0) + 
      (motorReplacement ? motorReplacementCost : 0) + 
      additionalPartsCost + 
      laborCost;
    
    // Calculate total investment
    const totalInv = purchasePrice + 
      totalRepairCost + 
      auctionFees + 
      transportCost + 
      storageCost + 
      otherFees;
    
    setTotalInvestment(totalInv);
    
    // Calculate profit metrics
    const profit = estimatedListPrice - totalInv - salesCommission - salesTax;
    setEstimatedProfit(profit);
    
    // Calculate return percentages
    setProfitMargin(totalInv > 0 ? (profit / totalInv) * 100 : 0);
    setRoi(totalInv > 0 ? (profit / totalInv) * 100 : 0);
  };
  
  // Recalculate totals when any input changes
  useEffect(() => {
    calculateTotals();
  }, [
    purchasePrice, 
    repairCost, 
    batteryReplacement, 
    batteryReplacementCost,
    motorReplacement, 
    motorReplacementCost,
    additionalPartsCost,
    laborCost,
    auctionFees,
    transportCost,
    storageCost,
    otherFees,
    estimatedListPrice,
    salesCommission,
    salesTax,
    model, 
    trim, 
    year, 
    odometer
  ]);
  
  // Handle saving calculator settings
  const handleSaveCalculation = () => {
    const calculationData = {
      vehicle: {
        model,
        trim,
        year,
        odometer,
        purchasePrice
      },
      damage: {
        type: damageType,
        severity: damageSeverity,
        repairCost
      },
      replacements: {
        battery: batteryReplacement,
        batteryReplacementCost,
        motor: motorReplacement,
        motorReplacementCost
      },
      additionalCosts: {
        additionalPartsCost,
        laborCost,
        auctionFees,
        transportCost,
        storageTime,
        storageCost,
        otherFees
      },
      sales: {
        estimatedListPrice,
        salesCommission,
        salesTax
      },
      results: {
        totalInvestment,
        estimatedProfit,
        profitMargin,
        roi
      },
      timestamp: new Date().toISOString()
    };
    
    // Get existing calculations or initialize empty array
    const existingCalcs = JSON.parse(localStorage.getItem('roiCalculations') || '[]');
    existingCalcs.push(calculationData);
    
    // Save to localStorage
    localStorage.setItem('roiCalculations', JSON.stringify(existingCalcs));
    
    toast.success('ROI calculation saved successfully');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Tesla ROI Calculator
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vehicle Information */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <FiInfo className="mr-2" /> Vehicle Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tesla Model
                  </label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.keys(TESLA_VALUES).map(modelName => (
                      <option key={modelName} value={modelName}>{modelName}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trim Level
                  </label>
                  <select
                    value={trim}
                    onChange={(e) => setTrim(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="base">Standard/Long Range</option>
                    <option value="performance">Performance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {availableYears.map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Odometer (miles)
                  </label>
                  <input
                    type="number"
                    value={odometer}
                    onChange={(e) => setOdometer(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Price ($)
                  </label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 px-3 py-2 text-gray-500 rounded-l-md border border-r-0 border-gray-300">$</span>
                    <input
                      type="number"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(parseInt(e.target.value) || 0)}
                      className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 border border-gray-300 rounded-r-md"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Damage and Repairs */}
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                <FiInfo className="mr-2" /> Damage & Repairs
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Damage Type
                  </label>
                  <select
                    value={damageType}
                    onChange={(e) => setDamageType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.keys(REPAIR_COSTS).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Damage Severity
                  </label>
                  <select
                    value={damageSeverity}
                    onChange={(e) => setDamageSeverity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="minor">Minor</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Repair Cost ($)
                  </label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 px-3 py-2 text-gray-500 rounded-l-md border border-r-0 border-gray-300">$</span>
                    <input
                      type="number"
                      value={repairCost}
                      onChange={(e) => setRepairCost(parseInt(e.target.value) || 0)}
                      className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 border border-gray-300 rounded-r-md"
                    />
                  </div>
                </div>
                
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="batteryReplacement"
                    checked={batteryReplacement}
                    onChange={(e) => setBatteryReplacement(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="batteryReplacement" className="ml-2 block text-sm text-gray-700">
                    Battery Replacement Needed
                  </label>
                </div>
                
                {batteryReplacement && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Battery Replacement Cost ($)
                    </label>
                    <div className="flex items-center">
                      <span className="bg-gray-100 px-3 py-2 text-gray-500 rounded-l-md border border-r-0 border-gray-300">$</span>
                      <input
                        type="number"
                        value={batteryReplacementCost}
                        onChange={(e) => setBatteryReplacementCost(parseInt(e.target.value) || 0)}
                        className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 border border-gray-300 rounded-r-md"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="motorReplacement"
                    checked={motorReplacement}
                    onChange={(e) => setMotorReplacement(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="motorReplacement" className="ml-2 block text-sm text-gray-700">
                    Motor Replacement Needed
                  </label>
                </div>
                
                {motorReplacement && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Motor Replacement Cost ($)
                    </label>
                    <div className="flex items-center">
                      <span className="bg-gray-100 px-3 py-2 text-gray-500 rounded-l-md border border-r-0 border-gray-300">$</span>
                      <input
                        type="number"
                        value={motorReplacementCost}
                        onChange={(e) => setMotorReplacementCost(parseInt(e.target.value) || 0)}
                        className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 border border-gray-300 rounded-r-md"
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Parts Cost ($)
                  </label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 px-3 py-2 text-gray-500 rounded-l-md border border-r-0 border-gray-300">$</span>
                    <input
                      type="number"
                      value={additionalPartsCost}
                      onChange={(e) => setAdditionalPartsCost(parseInt(e.target.value) || 0)}
                      className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 border border-gray-300 rounded-r-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Labor Cost ($)
                  </label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 px-3 py-2 text-gray-500 rounded-l-md border border-r-0 border-gray-300">$</span>
                    <input
                      type="number"
                      value={laborCost}
                      onChange={(e) => setLaborCost(parseInt(e.target.value) || 0)}
                      className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 border border-gray-300 rounded-r-md"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fees and Sales */}
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <FiDollarSign className="mr-2" /> Fees & Sales
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Auction Fees ($)
                  </label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 px-3 py-2 text-gray-500 rounded-l-md border border-r-0 border-gray-300">$</span>
                    <input
                      type="number"
                      value={auctionFees}
                      onChange={(e) => setAuctionFees(parseInt(e.target.value) || 0)}
                      className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 border border-gray-300 rounded-r-md"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Automatically calculated as 10% of purchase price, but you can adjust</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transport Cost ($)
                  </label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 px-3 py-2 text-gray-500 rounded-l-md border border-r-0 border-gray-300">$</span>
                    <input
                      type="number"
                      value={transportCost}
                      onChange={(e) => setTransportCost(parseInt(e.target.value) || 0)}
                      className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 border border-gray-300 rounded-r-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Storage Time (days)
                  </label>
                  <input
                    type="number"
                    value={storageTime}
                    onChange={(e) => setStorageTime(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Storage Cost ($)
                  </label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 px-3 py-2 text-gray-500 rounded-l-md border border-r-0 border-gray-300">$</span>
                    <input
                      type="number"
                      value={storageCost}
                      onChange={(e) => setStorageCost(parseInt(e.target.value) || 0)}
                      className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 border border-gray-300 rounded-r-md"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Auto-calculated as $45/day but you can adjust</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Other Fees ($)
                  </label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 px-3 py-2 text-gray-500 rounded-l-md border border-r-0 border-gray-300">$</span>
                    <input
                      type="number"
                      value={otherFees}
                      onChange={(e) => setOtherFees(parseInt(e.target.value) || 0)}
                      className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 border border-gray-300 rounded-r-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated List Price ($)
                  </label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 px-3 py-2 text-gray-500 rounded-l-md border border-r-0 border-gray-300">$</span>
                    <input
                      type="number"
                      value={estimatedListPrice}
                      onChange={(e) => setEstimatedListPrice(parseInt(e.target.value) || 0)}
                      className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 border border-gray-300 rounded-r-md"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Auto-calculated based on market data, but you can adjust</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sales Commission ($)
                  </label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 px-3 py-2 text-gray-500 rounded-l-md border border-r-0 border-gray-300">$</span>
                    <input
                      type="number"
                      value={salesCommission}
                      onChange={(e) => setSalesCommission(parseInt(e.target.value) || 0)}
                      className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 border border-gray-300 rounded-r-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Results */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiTrendingUp className="mr-2" /> Profit Analysis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h4 className="text-base font-medium text-gray-700 mb-4">Total Investment</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purchase Price:</span>
                    <span className="font-medium">${purchasePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Repair Costs:</span>
                    <span className="font-medium">
                      ${(repairCost + (batteryReplacement ? batteryReplacementCost : 0) + 
                         (motorReplacement ? motorReplacementCost : 0) + 
                         additionalPartsCost + laborCost).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fees & Transport:</span>
                    <span className="font-medium">
                      ${(auctionFees + transportCost + storageCost + otherFees).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 mt-2 border-t border-gray-200">
                    <span className="text-gray-800 font-medium">Total Investment:</span>
                    <span className="font-bold text-lg">${totalInvestment.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h4 className="text-base font-medium text-gray-700 mb-4">Profitability</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">List Price:</span>
                    <span className="font-medium">${estimatedListPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sales Tax:</span>
                    <span className="font-medium">${salesTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commission:</span>
                    <span className="font-medium">${salesCommission.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 mt-2 border-t border-gray-200">
                    <span className="text-gray-800 font-medium">Estimated Profit:</span>
                    <span className={`font-bold text-lg ${estimatedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${estimatedProfit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-800 font-medium">Profit Margin:</span>
                    <span className={`font-bold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {profitMargin.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-800 font-medium">ROI:</span>
                    <span className={`font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {roi.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <div className={`px-6 py-4 rounded-lg text-center ${
                profitMargin >= 20 ? 'bg-green-100 text-green-800' : 
                profitMargin >= 10 ? 'bg-blue-100 text-blue-800' : 
                profitMargin >= 0 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                <h4 className="font-bold mb-1">ROI Analysis</h4>
                <p>
                  {profitMargin >= 20 ? 'Excellent investment! This vehicle should yield a very strong return.' : 
                   profitMargin >= 10 ? 'Good investment. This vehicle is likely to be profitable.' : 
                   profitMargin >= 0 ? 'Marginal investment. Consider if you can reduce costs.' : 
                   'Not recommended. This investment is projected to lose money.'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSaveCalculation}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Calculation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 