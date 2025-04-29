'use client'

import { useState, useEffect, useRef } from 'react'
import { Vehicle } from '../store/vehicleStore'
import { FiUpload, FiX, FiImage, FiCopy } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { Listbox, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface VehicleFormProps {
  vehicle?: Partial<Vehicle>;
  onSubmit: (vehicleData: Partial<Vehicle>) => Promise<void>;
  onCancel: () => void;
  onChange?: (data: Partial<Vehicle>) => void;
}

const brandTrimLevels: Record<string, Record<string, string[]>> = {
  'Tesla': {
    'Model 3': ['Standard Range', 'Long Range', 'Performance'],
    'Model Y': ['Standard Range', 'Long Range', 'Performance'],
    'Model S': ['Long Range', 'Plaid'],
    'Model X': ['Long Range', 'Plaid']
  },
  'BMW': {
    '3 Series': ['320i', '330i', 'M340i', 'M3'],
    '5 Series': ['530i', '540i', 'M550i', 'M5'],
    'X5': ['sDrive40i', 'xDrive40i', 'M50i', 'M'],
  },
  'Mercedes-Benz': {
    'C-Class': ['C 300', 'C 43 AMG', 'C 63 AMG'],
    'E-Class': ['E 350', 'E 450', 'AMG E 53', 'AMG E 63 S'],
    'GLC': ['GLC 300', 'AMG GLC 43', 'AMG GLC 63'],
  },
  'Toyota': {
    'Camry': ['LE', 'SE', 'XSE', 'XLE', 'TRD'],
    'Corolla': ['L', 'LE', 'SE', 'XSE', 'XLE'],
    'RAV4': ['LE', 'XLE', 'XLE Premium', 'Adventure', 'Limited'],
  },
  'Honda': {
    'Civic': ['LX', 'Sport', 'EX', 'Touring', 'Si', 'Type R'],
    'Accord': ['LX', 'Sport', 'EX-L', 'Touring'],
    'CR-V': ['LX', 'EX', 'EX-L', 'Touring'],
  },
  'Ford': {
    'F-150': ['XL', 'XLT', 'Lariat', 'King Ranch', 'Platinum', 'Limited', 'Raptor'],
    'Mustang': ['EcoBoost', 'GT', 'Mach 1', 'Shelby GT350', 'Shelby GT500'],
    'Escape': ['S', 'SE', 'SEL', 'Titanium'],
  },
  'Chevrolet': {
    'Silverado 1500': ['WT', 'Custom', 'LT', 'RST', 'LTZ', 'High Country'],
    'Malibu': ['L', 'LS', 'RS', 'LT', 'Premier'],
    'Equinox': ['L', 'LS', 'LT', 'Premier'],
  },
  // Add more brands/models as needed
};

// Tesla models, years, trims, and specs mapping
const teslaModels = ['Roadster', 'Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck'];
const teslaYears = Array.from({ length: 2025 - 2008 + 1 }, (_, i) => 2008 + i);
const teslaTrimsByYear: Record<string, Record<number, string[]>> = {
  'Roadster': {
    2008: ['Roadster (base)'],
    2009: ['Roadster (base)'],
    2010: ['Roadster Sport'],
    2011: ['Roadster 2.5'],
  },
  'Model S': {
    2012: ['40', '60', '85'],
    2013: ['60', '85', 'P85'],
    2014: ['60', '85', 'P85', 'P85+'],
    2015: ['70D', '85D', 'P85D'],
    2016: ['60', '60D', '70', '70D', '75', '75D', '85', '85D', 'P85D', '90D', 'P90D'],
    2017: ['75', '75D', '90D', 'P90D', '100D', 'P100D'],
    2018: ['75D', '100D', 'P100D'],
    2019: ['Long Range', 'Performance'],
    2020: ['Long Range Plus', 'Performance'],
    2021: ['Long Range', 'Plaid'],
    2022: ['Long Range', 'Plaid'],
    2023: ['Long Range', 'Plaid'],
    2024: ['Long Range', 'Plaid'],
    2025: ['Long Range', 'Plaid'],
  },
  'Model X': {
    2016: ['75D', '90D', 'P90D'],
    2017: ['75D', '90D', '100D', 'P100D'],
    2018: ['75D', '100D', 'P100D'],
    2019: ['Long Range', 'Performance'],
    2020: ['Long Range Plus', 'Performance'],
    2021: ['Long Range', 'Plaid'],
    2022: ['Long Range', 'Plaid'],
    2023: ['Long Range', 'Plaid'],
    2024: ['Long Range', 'Plaid'],
    2025: ['Long Range', 'Plaid'],
  },
  'Model 3': {
    2017: ['Standard Range Plus', 'Long Range RWD'],
    2018: ['Mid Range RWD', 'Long Range AWD', 'Performance'],
    2019: ['Standard Range Plus', 'Long Range AWD', 'Performance'],
    2020: ['Standard Range Plus', 'Long Range AWD', 'Performance'],
    2021: ['Standard Range Plus', 'Long Range AWD', 'Performance'],
    2022: ['RWD', 'Long Range AWD', 'Performance'],
    2023: ['RWD', 'Long Range AWD', 'Performance'],
    2024: ['RWD', 'Long Range AWD', 'Performance'],
    2025: ['RWD', 'Long Range AWD', 'Performance'],
  },
  'Model Y': {
    2020: ['Long Range AWD', 'Performance'],
    2021: ['Standard Range RWD', 'Long Range AWD', 'Performance'],
    2022: ['Long Range AWD', 'Performance'],
    2023: ['Long Range AWD', 'Performance', 'RWD'],
    2024: ['Long Range AWD', 'Performance', 'RWD'],
    2025: ['Long Range AWD', 'Performance', 'RWD'],
  },
  'Cybertruck': {
    2023: ['All-Wheel Drive', 'Cyberbeast'],
    2024: ['Rear-Wheel Drive', 'All-Wheel Drive', 'Cyberbeast'],
    2025: ['Rear-Wheel Drive', 'All-Wheel Drive', 'Cyberbeast'],
  },
};
// Expanded teslaSpecs mapping (add Cybertruck and more years/trims for all models)
const teslaSpecs: Record<string, Record<number, Record<string, {
  range: string,
  battery: string,
  chargingSpeed: string,
  zeroToSixty: string,
  fsdHardware: string,
  cameras: string,
  notes: string,
}>>> = {
  'Roadster': {
    2008: {
      'Roadster (base)': {
        range: '244 miles', battery: '53 kWh', chargingSpeed: '~3.5kW (home)', zeroToSixty: '3.9 sec', fsdHardware: 'None', cameras: 'None', notes: 'Hand-built, based on Lotus Elise',
      },
    },
    2009: {
      'Roadster (base)': {
        range: '244 miles', battery: '53 kWh', chargingSpeed: '~3.5kW (home)', zeroToSixty: '3.9 sec', fsdHardware: 'None', cameras: 'None', notes: 'Hand-built, based on Lotus Elise',
      },
    },
    2010: {
      'Roadster Sport': {
        range: '244 miles', battery: '53 kWh', chargingSpeed: '~3.5kW (home)', zeroToSixty: '3.9 sec', fsdHardware: 'None', cameras: 'None', notes: 'Hand-built, based on Lotus Elise',
      },
    },
    2011: {
      'Roadster 2.5': {
        range: '244 miles', battery: '53 kWh', chargingSpeed: '~3.5kW (home)', zeroToSixty: '3.7 sec', fsdHardware: 'None', cameras: 'None', notes: 'Updated styling, better cooling',
      },
    },
  },
  'Model S': {
    2012: {
      '40': { range: '139 miles', battery: '40 kWh', chargingSpeed: '90kW', zeroToSixty: '6.5 sec', fsdHardware: 'None', cameras: 'None', notes: 'Original Model S' },
      '60': { range: '208 miles', battery: '60 kWh', chargingSpeed: '90kW', zeroToSixty: '5.9 sec', fsdHardware: 'None', cameras: 'None', notes: '' },
      '85': { range: '265 miles', battery: '85 kWh', chargingSpeed: '90kW', zeroToSixty: '5.4 sec', fsdHardware: 'None', cameras: 'None', notes: '' },
    },
    2013: {
      '60': { range: '208 miles', battery: '60 kWh', chargingSpeed: '90kW', zeroToSixty: '5.9 sec', fsdHardware: 'None', cameras: 'None', notes: '' },
      '85': { range: '265 miles', battery: '85 kWh', chargingSpeed: '90kW', zeroToSixty: '5.4 sec', fsdHardware: 'None', cameras: 'None', notes: '' },
      'P85': { range: '265 miles', battery: '85 kWh', chargingSpeed: '90kW', zeroToSixty: '4.2 sec', fsdHardware: 'None', cameras: 'None', notes: 'Performance Model' },
    },
    2014: {
      '60': { range: '208 miles', battery: '60 kWh', chargingSpeed: '120kW', zeroToSixty: '5.9 sec', fsdHardware: 'None', cameras: 'None', notes: '' },
      '85': { range: '265 miles', battery: '85 kWh', chargingSpeed: '120kW', zeroToSixty: '5.4 sec', fsdHardware: 'None', cameras: 'None', notes: '' },
      'P85': { range: '265 miles', battery: '85 kWh', chargingSpeed: '120kW', zeroToSixty: '4.2 sec', fsdHardware: 'None', cameras: 'None', notes: '' },
      'P85+': { range: '265 miles', battery: '85 kWh', chargingSpeed: '120kW', zeroToSixty: '4.2 sec', fsdHardware: 'None', cameras: 'None', notes: 'Performance Plus' },
    },
    2015: {
      '70D': { range: '240 miles', battery: '70 kWh', chargingSpeed: '120kW', zeroToSixty: '5.2 sec', fsdHardware: 'None', cameras: 'None', notes: 'Dual Motor' },
      '85D': { range: '270 miles', battery: '85 kWh', chargingSpeed: '120kW', zeroToSixty: '5.2 sec', fsdHardware: 'None', cameras: 'None', notes: 'Dual Motor' },
      'P85D': { range: '253 miles', battery: '85 kWh', chargingSpeed: '120kW', zeroToSixty: '3.1 sec', fsdHardware: 'None', cameras: 'None', notes: 'Insane Mode' },
    },
    2016: {
      '60': { range: '210 miles', battery: '60 kWh', chargingSpeed: '120kW', zeroToSixty: '5.5 sec', fsdHardware: 'HW1', cameras: '1 cam', notes: 'AP1' },
      '60D': { range: '218 miles', battery: '60 kWh', chargingSpeed: '120kW', zeroToSixty: '5.2 sec', fsdHardware: 'HW1', cameras: '1 cam', notes: 'AP1' },
      '75': { range: '249 miles', battery: '75 kWh', chargingSpeed: '120kW', zeroToSixty: '5.5 sec', fsdHardware: 'HW1', cameras: '1 cam', notes: 'AP1' },
      '75D': { range: '259 miles', battery: '75 kWh', chargingSpeed: '120kW', zeroToSixty: '5.2 sec', fsdHardware: 'HW1', cameras: '1 cam', notes: 'AP1' },
      '90D': { range: '294 miles', battery: '90 kWh', chargingSpeed: '120kW', zeroToSixty: '4.2 sec', fsdHardware: 'HW1', cameras: '1 cam', notes: 'AP1' },
      'P90D': { range: '270 miles', battery: '90 kWh', chargingSpeed: '120kW', zeroToSixty: '2.8 sec', fsdHardware: 'HW1', cameras: '1 cam', notes: 'Ludicrous Mode' },
    },
    2017: {
      '75': { range: '249 miles', battery: '75 kWh', chargingSpeed: '120kW', zeroToSixty: '5.5 sec', fsdHardware: 'HW2', cameras: '8 cams', notes: 'AP2' },
      '75D': { range: '259 miles', battery: '75 kWh', chargingSpeed: '120kW', zeroToSixty: '5.2 sec', fsdHardware: 'HW2', cameras: '8 cams', notes: 'AP2' },
      '100D': { range: '335 miles', battery: '100 kWh', chargingSpeed: '120kW', zeroToSixty: '4.1 sec', fsdHardware: 'HW2', cameras: '8 cams', notes: 'AP2' },
      'P100D': { range: '315 miles', battery: '100 kWh', chargingSpeed: '120kW', zeroToSixty: '2.28 sec', fsdHardware: 'HW2', cameras: '8 cams', notes: 'Ludicrous Plus' },
    },
    2018: {
      '75D': { range: '259 miles', battery: '75 kWh', chargingSpeed: '120kW', zeroToSixty: '5.2 sec', fsdHardware: 'HW2.5', cameras: '8 cams', notes: 'AP2.5' },
      '100D': { range: '335 miles', battery: '100 kWh', chargingSpeed: '120kW', zeroToSixty: '4.1 sec', fsdHardware: 'HW2.5', cameras: '8 cams', notes: 'AP2.5' },
      'P100D': { range: '315 miles', battery: '100 kWh', chargingSpeed: '120kW', zeroToSixty: '2.28 sec', fsdHardware: 'HW2.5', cameras: '8 cams', notes: 'Ludicrous Plus' },
    },
    2019: {
      'Long Range': { range: '370 miles', battery: '100 kWh', chargingSpeed: '200kW', zeroToSixty: '3.7 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: 'Raven Suspension' },
      'Performance': { range: '345 miles', battery: '100 kWh', chargingSpeed: '200kW', zeroToSixty: '2.4 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: 'Raven + Ludicrous' },
    },
    2020: {
      'Long Range Plus': { range: '402 miles', battery: '100 kWh', chargingSpeed: '250kW', zeroToSixty: '3.7 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: 'Efficiency Update' },
      'Performance': { range: '348 miles', battery: '100 kWh', chargingSpeed: '250kW', zeroToSixty: '2.3 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: 'Cheetah Stance' },
    },
    2021: {
      'Long Range': { range: '405 miles', battery: '100 kWh', chargingSpeed: '250kW', zeroToSixty: '3.1 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: 'New Interior' },
      'Plaid': { range: '396 miles', battery: '100 kWh', chargingSpeed: '250kW', zeroToSixty: '1.99 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: 'Tri-Motor' },
    },
    2022: {
      'Long Range': { range: '405 miles', battery: '100 kWh', chargingSpeed: '250kW', zeroToSixty: '3.1 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: '' },
      'Plaid': { range: '390 miles', battery: '100 kWh', chargingSpeed: '250kW', zeroToSixty: '1.99 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Plaid 3-motor' },
    },
    2023: {
      'Long Range': { range: '405 miles', battery: '100 kWh', chargingSpeed: '250kW', zeroToSixty: '3.1 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: '' },
      'Plaid': { range: '390 miles', battery: '100 kWh', chargingSpeed: '250kW', zeroToSixty: '1.99 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Plaid 3-motor' },
    },
    2024: {
      'Long Range': { range: '405 miles', battery: '100 kWh', chargingSpeed: '250kW', zeroToSixty: '3.1 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: '' },
      'Plaid': { range: '390 miles', battery: '100 kWh', chargingSpeed: '250kW', zeroToSixty: '1.99 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Plaid 3-motor' },
    },
    2025: {
      'Long Range': { range: '405 miles', battery: '100 kWh', chargingSpeed: '250kW', zeroToSixty: '3.1 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: '' },
      'Plaid': { range: '396 miles', battery: '100 kWh', chargingSpeed: '250kW', zeroToSixty: '1.99 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Tri-Motor' },
    },
  },
  'Model X': {
    2023: {
      'Long Range': { range: '348 miles', battery: '100 kWh', chargingSpeed: '250kW', zeroToSixty: '2.5 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: '' },
      'Plaid': { range: '333 miles', battery: '100 kWh', chargingSpeed: '250kW', zeroToSixty: '2.5 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Plaid 3-motor' },
    },
    2024: {
      'Long Range': { range: '348 miles', battery: '100 kWh', chargingSpeed: '250kW', zeroToSixty: '2.5 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: '' },
      'Plaid': { range: '333 miles', battery: '100 kWh', chargingSpeed: '250kW', zeroToSixty: '2.5 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Plaid 3-motor' },
    },
    2025: {
      'Long Range': { range: '348 miles', battery: '100 kWh', chargingSpeed: '250kW', zeroToSixty: '3.8 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: '' },
      'Plaid': { range: '333 miles', battery: '100 kWh', chargingSpeed: '250kW', zeroToSixty: '2.5 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Tri-Motor' },
    },
  },
  'Model 3': {
    2020: {
      'Standard Range Plus': { range: '250 miles', battery: '54 kWh LFP', chargingSpeed: '170kW', zeroToSixty: '5.3 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: 'LFP Battery' },
      'Long Range AWD': { range: '322 miles', battery: '82 kWh', chargingSpeed: '250kW', zeroToSixty: '4.2 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: 'Dual Motor' },
      'Performance': { range: '299 miles', battery: '82 kWh', chargingSpeed: '250kW', zeroToSixty: '3.1 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: 'Track Mode' },
    },
    2021: {
      'Standard Range Plus': { range: '263 miles', battery: '54 kWh LFP', chargingSpeed: '170kW', zeroToSixty: '5.3 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: 'LFP Battery' },
      'Long Range AWD': { range: '353 miles', battery: '82 kWh', chargingSpeed: '250kW', zeroToSixty: '4.2 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: 'Dual Motor' },
      'Performance': { range: '315 miles', battery: '82 kWh', chargingSpeed: '250kW', zeroToSixty: '3.1 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: 'Track Mode' },
    },
    2022: {
      'RWD': { range: '272 miles', battery: '60 kWh LFP', chargingSpeed: '170kW', zeroToSixty: '5.8 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: 'LFP Battery' },
      'Long Range AWD': { range: '358 miles', battery: '82 kWh', chargingSpeed: '250kW', zeroToSixty: '4.2 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: 'Dual Motor' },
      'Performance': { range: '315 miles', battery: '82 kWh', chargingSpeed: '250kW', zeroToSixty: '3.1 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: 'Track Mode' },
    },
    2023: {
      'RWD': { range: '272 miles', battery: '60 kWh LFP', chargingSpeed: '170kW', zeroToSixty: '5.8 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: 'Highland Refresh' },
      'Long Range AWD': { range: '333 miles', battery: '82 kWh', chargingSpeed: '250kW', zeroToSixty: '4.2 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: 'Highland Refresh' },
      'Performance': { range: '315 miles', battery: '82 kWh', chargingSpeed: '250kW', zeroToSixty: '3.1 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: 'Highland Refresh' },
    },
    2024: {
      'RWD': { range: '272 miles', battery: '60 kWh LFP', chargingSpeed: '170kW', zeroToSixty: '5.8 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Highland Design' },
      'Long Range AWD': { range: '333 miles', battery: '82 kWh', chargingSpeed: '250kW', zeroToSixty: '4.2 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Highland Design' },
      'Performance': { range: '315 miles', battery: '82 kWh', chargingSpeed: '250kW', zeroToSixty: '3.1 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Highland Design' },
    },
    2025: {
      'RWD': { range: '272 miles', battery: '60 kWh LFP', chargingSpeed: '170kW', zeroToSixty: '5.8 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Highland Design' },
      'Long Range AWD': { range: '333 miles', battery: '82 kWh', chargingSpeed: '250kW', zeroToSixty: '4.2 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Highland Design' },
      'Performance': { range: '315 miles', battery: '82 kWh', chargingSpeed: '250kW', zeroToSixty: '3.1 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Highland Design' },
    },
  },
  'Model Y': {
    2023: {
      'Long Range AWD': { range: '330 miles', battery: '82 kWh NCA', chargingSpeed: '250kW', zeroToSixty: '4.8 sec', fsdHardware: 'HW3/HW4 (late)', cameras: '8/11 cams', notes: '' },
      'Performance': { range: '303 miles', battery: '82 kWh NCA', chargingSpeed: '250kW', zeroToSixty: '3.5 sec', fsdHardware: 'HW3/HW4 (late)', cameras: '8/11 cams', notes: '' },
      'RWD': { range: '260 miles', battery: 'LFP pack', chargingSpeed: '250kW', zeroToSixty: '6.6 sec', fsdHardware: 'HW3', cameras: '8 cams', notes: 'New entry version' },
    },
    2024: {
      'Long Range AWD': { range: '330 miles', battery: '82 kWh NCA', chargingSpeed: '250kW', zeroToSixty: '4.8 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: '' },
      'Performance': { range: '303 miles', battery: '82 kWh NCA', chargingSpeed: '250kW', zeroToSixty: '3.5 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: '' },
      'RWD': { range: '260 miles', battery: 'LFP pack', chargingSpeed: '250kW', zeroToSixty: '6.6 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: '' },
    },
    2025: {
      'Long Range AWD': { range: '330 miles', battery: '82 kWh NCA', chargingSpeed: '250kW', zeroToSixty: '4.8 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: '' },
      'Performance': { range: '303 miles', battery: '82 kWh NCA', chargingSpeed: '250kW', zeroToSixty: '3.5 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: '' },
      'RWD': { range: '260 miles', battery: 'LFP pack', chargingSpeed: '250kW', zeroToSixty: '6.6 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: '' },
    },
  },
  'Cybertruck': {
    2023: {
      'Cyberbeast': { range: '320 miles (450+ w/ extender)', battery: '~123kWh NCA', chargingSpeed: '250kW+', zeroToSixty: '2.6 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Tri-motor' },
      'All-Wheel Drive': { range: '340 miles', battery: '~123kWh NCA', chargingSpeed: '250kW+', zeroToSixty: '4.1 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Dual-motor' },
    },
    2024: {
      'Rear-Wheel Drive': { range: '~250 miles', battery: '~100kWh (est)', chargingSpeed: '250kW+', zeroToSixty: '6.5 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Single motor version' },
      'All-Wheel Drive': { range: '340 miles', battery: '~123kWh NCA', chargingSpeed: '250kW+', zeroToSixty: '4.1 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Dual-motor' },
      'Cyberbeast': { range: '320 miles (450+ w/ extender)', battery: '~123kWh NCA', chargingSpeed: '250kW+', zeroToSixty: '2.6 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Tri-motor' },
    },
    2025: {
      'Rear-Wheel Drive': { range: '~250 miles', battery: '~100kWh (est)', chargingSpeed: '250kW+', zeroToSixty: '6.5 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Single motor version' },
      'All-Wheel Drive': { range: '340 miles', battery: '~123kWh NCA', chargingSpeed: '250kW+', zeroToSixty: '4.1 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Dual-motor' },
      'Cyberbeast': { range: '320 miles (450+ w/ extender)', battery: '~123kWh NCA', chargingSpeed: '250kW+', zeroToSixty: '2.6 sec', fsdHardware: 'HW4', cameras: '11 cams', notes: 'Tri-motor' },
    },
  },
};

interface SocialMediaStatus {
  twitter: {
    status: 'idle' | 'posting' | 'success' | 'error';
    link?: string;
    error?: string;
  };
  facebook: {
    status: 'idle' | 'posting' | 'success' | 'error' | 'copied';
    error?: string;
  };
  instagram: {
    status: 'idle' | 'posting' | 'success' | 'error' | 'copied';
    error?: string;
  };
}

export default function VehicleForm({ vehicle, onSubmit, onCancel, onChange }: VehicleFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    title: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    location: 'San Diego, CA',
    image: '',
    condition: 'Used',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    bodyStyle: 'Sedan',
    status: 'available',
    description: '',
    features: [],
    titleStatus: 'Clean',
    specifications: { trim: '', ...(vehicle?.specifications || {}) },
    ...vehicle
  })

  const [images, setImages] = useState<string[]>([])
  const [isEV, setIsEV] = useState(false)
  const [evFeatures, setEvFeatures] = useState({
    fsd: false,
    enhancedAutopilot: false,
    unlimitedSupercharging: false,
    underWarranty: false,
    trim: 'Standard Range',
    batteryWarranty: false,
    evIncentiveEligible: true,
    premiumConnectivity: false,
    accelerationBoost: false,
    homeChargerIncluded: false,
    keyCards: '1',
    hasCCSAdapter: false,
    processor: '',
    hasMobileCharger: false,
    hasAirCompressor: false,
    hasRoadsideKit: false,
    range: '',
    batterySize: '',
    chargingSpeed: '',
    zeroToSixty: '',
    fsdHardware: '',
    cameras: '',
    notes: '',
  })

  const [uploadError, setUploadError] = useState<string | null>(null)
  const [carsForSaleLink, setCarsForSaleLink] = useState('');
  const [socialPosts, setSocialPosts] = useState({
    instagram: false,
    facebook: false,
    twitter: false,
  });
  const [prefillLoading, setPrefillLoading] = useState(false);
  const [prefillError, setPrefillError] = useState<string | { error: string; debug?: any } | null>(null);
  const [twitterStatus, setTwitterStatus] = useState<'idle' | 'posting' | 'success' | 'error'>("idle");
  const [twitterError, setTwitterError] = useState<string | null>(null);
  const [fbCopyStatus, setFbCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [detailsPaste, setDetailsPaste] = useState('');
  const [evCreditEligible, setEvCreditEligible] = useState(false);
  const [evCreditAmount, setEvCreditAmount] = useState(4000);
  const [selectedTrim, setSelectedTrim] = useState('');

  // Add new state variables after the existing state declarations
  const [socialMediaStatus, setSocialMediaStatus] = useState<SocialMediaStatus>({
    twitter: { status: 'idle' },
    facebook: { status: 'idle' },
    instagram: { status: 'idle' }
  });

  useEffect(() => {
    setIsEV(formData.fuelType === 'Electric')
  }, [formData.fuelType])

  useEffect(() => {
    if (vehicle) {
      if (vehicle.images && Array.isArray(vehicle.images)) {
        setImages(vehicle.images);
      }
      if (vehicle.image) {
        setFormData(prev => ({ ...prev, image: vehicle.image }));
      }
    }
  }, [vehicle]);

  useEffect(() => {
    const year = formData.year || '';
    const make = formData.make || '';
    const model = formData.model || '';
    const autoTitle = [year, make, model].filter(Boolean).join(' ');
    setFormData(prev => ({ ...prev, title: autoTitle }));
  }, [formData.year, formData.make, formData.model]);

  useEffect(() => {
    const isTesla = formData.make?.toLowerCase() === 'tesla';
    const isElectric = formData.fuelType === 'Electric';
    
    if (isTesla || isElectric) {
      setEvFeatures(prev => ({
        ...prev,
        range: '300',
        batterySize: '75',
        chargingSpeed: '250',
        zeroToSixty: '',
        fsdHardware: '',
        cameras: '',
        notes: '',
        fsd: true,
        enhancedAutopilot: true,
        unlimitedSupercharging: true,
        batteryWarranty: true,
        evIncentiveEligible: true,
        underWarranty: false,
        trim: 'Standard Range',
        premiumConnectivity: false,
        accelerationBoost: false,
        homeChargerIncluded: false,
        keyCards: '2',
        hasCCSAdapter: false,
        processor: '',
        hasMobileCharger: true,
        hasAirCompressor: false,
        hasRoadsideKit: false,
      }));

      if (!formData.description?.includes('This Tesla')) {
        setFormData(prev => ({
          ...prev,
          fuelType: 'Electric',
          features: ['Autopilot', 'Navigation', 'Heated Seats'],
          bodyStyle: prev.bodyStyle || 'Sedan',
          transmission: prev.transmission || 'Automatic',
          condition: prev.condition || 'Used',
          description: `This Tesla is in excellent condition with Full Self-Driving, long range, and eligible for EV incentives. Battery warranty is active. Contact for more details.`
        }));
      }
    }
  }, [formData.make, formData.fuelType]);

  useEffect(() => {
    let desc = '';
    
    // Basic vehicle info
    if (formData.year) desc += `${formData.year} `;
    if (formData.make) desc += `${formData.make} `;
    if (formData.model) desc += `${formData.model} `;
    if (selectedTrim) desc += `${selectedTrim}\n`;
    if (formData.mileage) desc += `${formData.mileage.toLocaleString()} miles\n\n`;

    // Important EV specs
    if (evFeatures.range) desc += `Range: ${evFeatures.range} miles\n`;
    if (evFeatures.chargingSpeed) desc += `Charging Speed: ${evFeatures.chargingSpeed}kW (Full charge in ~1 hour at max rate)\n`;
    if (evFeatures.zeroToSixty) desc += `0-60 mph: ${evFeatures.zeroToSixty}\n\n`;

    // Premium features
    const features = [];
    if (evFeatures.fsd) features.push("Full Self-Driving");
    if (evFeatures.enhancedAutopilot) features.push("Enhanced Autopilot");
    if (evFeatures.unlimitedSupercharging) features.push("Unlimited Free Supercharging");
    if (evFeatures.premiumConnectivity) features.push("Premium Connectivity");
    if (evFeatures.accelerationBoost) features.push("Acceleration Boost");
    if (features.length > 0) {
      desc += "Included Features:\n";
      features.forEach(feature => desc += `• ${feature}\n`);
      desc += '\n';
    }

    // Title status and warranty information
    if (formData.titleStatus === 'Salvage') {
      desc += `• Dealer warranty: 3 months or 3,000 miles\n`;
      desc += `• Supercharging network: Fully active and working\n`;
      desc += `• Tesla warranty: Not included\n`;
      desc += `• Repairs: Professionally completed and Tesla verified\n`;
    } else if (formData.titleStatus === 'Rebuilt') {
      desc += `• Dealer warranty: 3 months or 3,000 miles\n`;
      desc += `• Supercharging network: Fully active and working\n`;
      desc += `• Tesla warranty: Not included\n`;
      desc += `• Repairs: Professionally completed and Tesla verified\n`;
      desc += `• Registration: Ready to be registered\n`;
    } else if (formData.titleStatus === 'Clean') {
      desc += `• Dealer warranty: 3 months or 3,000 miles\n`;
      if (evFeatures.batteryWarranty) desc += `• Battery/powertrain warranty: Active\n`;
      desc += `• Tesla warranty: Included\n`;
    }

    // Additional important notes
    if (evFeatures.evIncentiveEligible) {
      desc += `\nEligible for EV tax incentives and rebates.\n`;
    }

    setFormData(prev => ({ ...prev, description: desc }));
  }, [
    formData.year,
    formData.make,
    formData.model,
    selectedTrim,
    formData.mileage,
    formData.titleStatus,
    evFeatures.range,
    evFeatures.chargingSpeed,
    evFeatures.zeroToSixty,
    evFeatures.fsd,
    evFeatures.enhancedAutopilot,
    evFeatures.unlimitedSupercharging,
    evFeatures.premiumConnectivity,
    evFeatures.accelerationBoost,
    evFeatures.batteryWarranty,
    evFeatures.evIncentiveEligible
  ]);

  useEffect(() => {
    if (formData.make?.toLowerCase() === 'tesla') {
      setFormData(prev => ({ ...prev, fuelType: 'Electric' }));
    }
  }, [formData.make]);

  // Add new useEffect for Tesla trim specs
  useEffect(() => {
    if (
      formData.make?.toLowerCase() === 'tesla' &&
      formData.model &&
      formData.year &&
      selectedTrim &&
      teslaSpecs[formData.model]?.[formData.year]?.[selectedTrim]
    ) {
      const specs = teslaSpecs[formData.model][formData.year][selectedTrim];
      const year = formData.year; // Capture year to avoid undefined checks
      
      // Update evFeatures with the specs
      setEvFeatures(prev => ({
        ...prev,
        range: specs.range.split(' ')[0], // Extract just the number
        batterySize: specs.battery.split(' ')[0], // Extract just the number
        chargingSpeed: specs.chargingSpeed.split('k')[0], // Extract just the number
        zeroToSixty: specs.zeroToSixty,
        fsdHardware: specs.fsdHardware,
        cameras: specs.cameras,
        notes: specs.notes,
        // Set additional EV features based on the year and model
        fsd: year >= 2019,
        enhancedAutopilot: year >= 2019,
        unlimitedSupercharging: year <= 2020,
        batteryWarranty: true,
        evIncentiveEligible: year >= 2020,
        underWarranty: year >= 2021,
        premiumConnectivity: year >= 2019,
        accelerationBoost: formData.model === 'Model 3' || formData.model === 'Model Y',
        homeChargerIncluded: false,
        keyCards: year >= 2021 ? '2' : '1',
        hasCSSAdapter: year >= 2021,
        processor: year >= 2021 ? 'AMD Ryzen' : 'Intel Atom',
        hasMobileCharger: year <= 2021,
        hasAirCompressor: formData.model === 'Model X' || formData.model === 'Model S',
        hasRoadsideKit: true
      }));

      // Update formData with the specifications
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          trim: selectedTrim,
          range: parseInt(specs.range.split(' ')[0]), // Convert to number
          batterySize: specs.battery,
          chargingSpeed: specs.chargingSpeed,
          zeroToSixty: specs.zeroToSixty,
          fsdHardware: specs.fsdHardware,
          cameras: specs.cameras,
          notes: specs.notes
        }
      }));
    }
  }, [formData.make, formData.model, formData.year, selectedTrim]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null) // Clear any previous errors
    const files = e.target.files
    if (!files || files.length === 0) return

    // Validate file types and sizes
    const validFiles = Array.from(files).every(file => {
      if (!file.type.startsWith('image/')) {
        setUploadError('Only image files are allowed')
        return false
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setUploadError('Files must be less than 10MB')
        return false
      }
      return true
    })

    if (!validFiles) return

    const formData = new FormData()
    Array.from(files).forEach(file => {
      formData.append('images', file)
    })

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload images')
      }

      const data = await response.json()
      // Use relative paths for local uploads
      const uploadedUrls = data.urls.map((url: string) => url)

      // Update both the images state and formData
      const newImages = [...images, ...uploadedUrls]
      setImages(newImages)
      
      setFormData(prev => ({
        ...prev,
        image: newImages[0] || prev.image, // Set first image as main if none exists
        images: newImages
      }))
    } catch (error) {
      console.error('Error uploading images:', error)
      setUploadError(error instanceof Error ? error.message : 'Failed to upload images')
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
    
    setFormData(prev => ({
      ...prev,
      image: newImages[0] || '', // Update main image if first image is removed
      images: newImages
    }))
  }

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    setImages(newImages)
    
    setFormData(prev => ({
      ...prev,
      image: newImages[0] || '', // Update main image if order changes
      images: newImages
    }))
  }

  const composeTweet = () => {
    const price = formData.price ? `$${formData.price.toLocaleString()}` : '';
    const year = formData.year || '';
    const make = formData.make || '';
    const model = formData.model || '';
    const mileage = formData.mileage ? `${formData.mileage.toLocaleString()} mi` : '';
    const trim = selectedTrim ? ` ${selectedTrim}` : '';
    
    // Start with essential info
    let tweet = `${year} ${make} ${model}${trim}\n${price} | ${mileage}`;
    
    // Add location if space permits
    if (formData.location) {
      tweet += `\n📍 ${formData.location}`;
    }

    // Add key features (prioritize important ones)
    const features = [];
    if (evFeatures.fsd) features.push("✨ Full Self-Driving");
    if (evFeatures.unlimitedSupercharging) features.push("⚡ Free Supercharging");
    if (evFeatures.range) features.push(`🔋 ${evFeatures.range} mi range`);
    if (evFeatures.zeroToSixty) features.push(`🏃 0-60: ${evFeatures.zeroToSixty}`);
    
    // Add features if there's space
    if (features.length > 0) {
      tweet += '\n\n' + features.slice(0, 2).join('\n');
    }

    // Always include the link
    tweet += '\n\n🔎 More details: doskimotors.com';

    // Ensure we're within Twitter's limit (280 chars)
    if (tweet.length > 280) {
      // If too long, trim features and add ellipsis
      tweet = tweet.substring(0, 277) + '...';
    }

    return tweet;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Ensure we have all required fields
    const requiredFields = ['make', 'model', 'year', 'price', 'mileage']
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields)
      return
    }

    // Submit the form data
    onSubmit({
      ...formData,
      specifications: { ...formData.specifications, trim: selectedTrim },
      title: formData.title,
      images: images,
      image: images[0] || ''
    })

    // Handle social media posting separately
    if (socialPosts.twitter || socialPosts.facebook || socialPosts.instagram) {
      await handleSocialMediaPost();
    }
  }

  const handleSocialMediaPost = async () => {
    // Validate required fields before posting
    const requiredFields = ['make', 'model', 'year', 'price', 'mileage'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields before posting: ' + missingFields.join(', '));
      return;
    }

    // Post to Twitter
    if (socialPosts.twitter) {
      setSocialMediaStatus(prev => ({ ...prev, twitter: { status: 'posting' } }));
      try {
        // First check if we have an image to upload
        let mediaId = null;
        if (images[0]) {
          try {
            const mediaRes = await fetch('/api/social/twitter/upload-media', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imageUrl: images[0] }),
            });
            if (!mediaRes.ok) {
              throw new Error(`HTTP error! status: ${mediaRes.status}`);
            }
            const mediaData = await mediaRes.json();
            if (mediaData.success) {
              mediaId = mediaData.media_id;
            }
          } catch (mediaErr) {
            console.error('Failed to upload media:', mediaErr);
          }
        }

        // Now post the tweet
        const res = await fetch('/api/social/twitter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: composeTweet(),
            media_id: mediaId
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        if (data.success) {
          setSocialMediaStatus(prev => ({ 
            ...prev, 
            twitter: { 
              status: 'success',
              link: `https://twitter.com/DoskiMotors/status/${data.tweet.id}`
            }
          }));
        } else {
          throw new Error(data.error || 'Failed to post to Twitter');
        }
      } catch (err) {
        console.error('Twitter posting error:', err);
        setSocialMediaStatus(prev => ({ 
          ...prev, 
          twitter: { 
            status: 'error',
            error: err instanceof Error ? err.message : 'Failed to post to Twitter'
          }
        }));
      }
    }

    // Handle Facebook
    if (socialPosts.facebook) {
      try {
        const fbText = composeFacebookText();
        await navigator.clipboard.writeText(fbText);
        setSocialMediaStatus(prev => ({ 
          ...prev, 
          facebook: { status: 'copied' } 
        }));
        window.open('https://www.facebook.com/marketplace/create/vehicle', '_blank');
        
        // Reset copied status after 2 seconds
        setTimeout(() => {
          setSocialMediaStatus(prev => ({ 
            ...prev, 
            facebook: { status: 'idle' } 
          }));
        }, 2000);
      } catch (err) {
        setSocialMediaStatus(prev => ({ 
          ...prev, 
          facebook: { 
            status: 'error',
            error: 'Failed to copy text to clipboard.'
          }
        }));
      }
    }

    // Post to Instagram
    if (socialPosts.instagram) {
      setSocialMediaStatus(prev => ({ ...prev, instagram: { status: 'posting' } }));
      try {
        const res = await fetch('/api/social/instagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            caption: composeTweet(),
            image: images[0]
          }),
        });
        const data = await res.json();
        if (data.success) {
          setSocialMediaStatus(prev => ({ 
            ...prev, 
            instagram: { 
              status: 'success',
              link: data.post.permalink
            }
          }));
        } else {
          setSocialMediaStatus(prev => ({ 
            ...prev, 
            instagram: { 
              status: 'error',
              error: data.error || 'Failed to post to Instagram.'
            }
          }));
        }
      } catch (err) {
        setSocialMediaStatus(prev => ({ 
          ...prev, 
          instagram: { 
            status: 'error',
            error: 'Failed to post to Instagram.'
          }
        }));
      }
    }
  };

  const composeFacebookText = () => {
    const price = formData.price ? `$${formData.price.toLocaleString()}` : '';
    const year = formData.year || '';
    const make = formData.make || '';
    const model = formData.model || '';
    const mileage = formData.mileage ? `${formData.mileage.toLocaleString()} miles` : '';
    const trim = selectedTrim ? `\nTrim: ${selectedTrim}` : '';
    const condition = formData.condition ? `\nCondition: ${formData.condition}` : '';
    const transmission = formData.transmission ? `\nTransmission: ${formData.transmission}` : '';
    const fuelType = formData.fuelType ? `\nFuel Type: ${formData.fuelType}` : '';
    
    let fbText = `${year} ${make} ${model}\n${price} | ${mileage}${trim}${condition}${transmission}${fuelType}`;
    if (formData.location) fbText += `\nLocation: ${formData.location}`;
    if (formData.description) fbText += `\n\n${formData.description}`;
    return fbText;
  };

  const handlePrefillFromCarsForSale = async () => {
    setPrefillLoading(true);
    setPrefillError(null);
    try {
      const res = await fetch('/api/carsforsale-scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: carsForSaleLink }),
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        setPrefillError({ error: 'Failed to parse response from server.', debug: { status: res.status, message: 'Could not parse JSON.' } });
        setPrefillLoading(false);
        return;
      }
      if (!res.ok || data.error) {
        setPrefillError(data);
        setPrefillLoading(false);
        return;
      }
      setFormData(prev => ({
        ...prev,
        title: data.title || '',
        year: data.year || '',
        make: data.make || '',
        model: data.model || '',
        price: data.price || '',
        mileage: data.mileage || '',
        description: data.description || '',
      }));
      setImages(data.images || []);
      setPrefillLoading(false);
    } catch (err) {
      setPrefillError({ error: 'Failed to prefill from CarsForSale.com.', debug: String(err) });
      setPrefillLoading(false);
    }
  };

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)
  const conditions = ['New', 'Used', 'Certified Pre-Owned']
  const titleStatuses = ['Clean', 'Salvage', 'Rebuilt'] as const
  const transmissions = ['Automatic', 'Manual']
  const fuelTypes = ['Gasoline', 'Electric', 'Hybrid', 'Diesel']
  const bodyStyles = ['Sedan', 'SUV', 'Coupe', 'Truck', 'Van', 'Convertible']

  useEffect(() => {
    if ((formData.make || '').toLowerCase() === 'tesla' || formData.fuelType === 'Electric') {
      setIsEV(true);
      setFormData(prev => ({
        ...prev,
        features: prev.features && prev.features.length > 0 ? prev.features : ['Autopilot', 'Navigation', 'Heated Seats'],
        bodyStyle: prev.bodyStyle || 'Sedan',
        transmission: prev.transmission || 'Automatic',
        condition: prev.condition || 'Used',
      }));
    } else {
      setIsEV(false);
    }
  }, [formData.make, formData.fuelType]);

  const knownTrims = formData.make && formData.model && brandTrimLevels[formData.make]?.[formData.model] ? brandTrimLevels[formData.make][formData.model] : null;

  // Add useEffect to prefill specs when year/model/trim are selected
  useEffect(() => {
    if (
      formData.make?.toLowerCase() === 'tesla' &&
      formData.model &&
      formData.year &&
      selectedTrim &&
      teslaSpecs[formData.model]?.[formData.year]?.[selectedTrim]
    ) {
      const spec = teslaSpecs[formData.model][formData.year][selectedTrim];
      setEvFeatures(prev => ({
        ...prev,
        range: spec.range,
        batterySize: spec.battery,
        chargingSpeed: spec.chargingSpeed,
        zeroToSixty: spec.zeroToSixty || '',
        fsdHardware: spec.fsdHardware || '',
        cameras: spec.cameras || '',
        notes: spec.notes || '',
        trim: selectedTrim,
      }));
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          range: spec.range,
          battery: spec.battery,
          chargingSpeed: spec.chargingSpeed,
          zeroToSixty: spec.zeroToSixty || '',
          fsdHardware: spec.fsdHardware || '',
          cameras: spec.cameras || '',
          notes: spec.notes || '',
          trim: selectedTrim,
        },
      }));
    }
  }, [formData.make, formData.model, formData.year, selectedTrim]);

  const handleTwitterConnect = (e: React.MouseEvent) => {
    e.preventDefault();
    const width = 600;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popup = window.open(
      '/api/auth/twitter',
      'Connect with Twitter',
      `width=${width},height=${height},left=${left},top=${top},popup=true`
    );

    // Poll for popup closure and check for success
    const checkPopup = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopup);
        // Check if we have a success query param in the current URL
        const params = new URLSearchParams(window.location.search);
        if (params.get('twitter_success') === 'true') {
          // Update UI to show connected state
          setSocialMediaStatus(prev => ({
            ...prev,
            twitter: { status: 'success' }
          }));
        }
      }
    }, 1000);
  };

  const handleFacebookConnect = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Set status to connecting
    setSocialMediaStatus(prev => ({
      ...prev,
      facebook: { status: 'posting' }
    }));
    
    // Open popup window
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      '/api/auth/facebook',
      'facebook_auth',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
    );

    // Listen for messages from popup
    const messageHandler = (event: MessageEvent) => {
      // Verify origin
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'facebook_success') {
        setSocialMediaStatus(prev => ({
          ...prev,
          facebook: { status: 'success' }
        }));
        window.removeEventListener('message', messageHandler);
      } else if (event.data?.type === 'facebook_error') {
        setSocialMediaStatus(prev => ({
          ...prev,
          facebook: { 
            status: 'error', 
            error: event.data.error || 'Failed to connect to Facebook'
          }
        }));
        window.removeEventListener('message', messageHandler);
      }
    };

    window.addEventListener('message', messageHandler);

    // Check if popup was blocked or closed
    const checkPopup = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopup);
        window.removeEventListener('message', messageHandler);
        
        if (!popup) {
          setSocialMediaStatus(prev => ({
            ...prev,
            facebook: { 
              status: 'error', 
              error: 'Popup was blocked. Please allow popups and try again.' 
            }
          }));
        }
        // Only set error if we haven't received a success message
        else if (socialMediaStatus.facebook.status === 'posting') {
          setSocialMediaStatus(prev => ({
            ...prev,
            facebook: { 
              status: 'error', 
              error: 'Authentication window was closed before completion.' 
            }
          }));
        }
      }
    }, 1000);

    // Cleanup interval after 5 minutes (300000ms) to prevent memory leaks
    setTimeout(() => {
      clearInterval(checkPopup);
      window.removeEventListener('message', messageHandler);
      if (socialMediaStatus.facebook.status === 'posting') {
        setSocialMediaStatus(prev => ({
          ...prev,
          facebook: { 
            status: 'error', 
            error: 'Authentication timed out. Please try again.' 
          }
        }));
      }
    }, 300000);
  };

  const handleInstagramConnect = (e: React.MouseEvent) => {
    e.preventDefault();
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popup = window.open(
      '/api/auth/instagram',
      'Connect with Instagram',
      `width=${width},height=${height},left=${left},top=${top},popup=true`
    );

    // Poll for popup closure and check for success
    const checkPopup = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopup);
        const params = new URLSearchParams(window.location.search);
        if (params.get('instagram_success') === 'true') {
          setSocialMediaStatus(prev => ({
            ...prev,
            instagram: { status: 'success' }
          }));
        }
      }
    }, 1000);
  };

  // Update form data
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Add or Edit Vehicle</h1>
        <p className="text-gray-500">Fill out the details below to list your vehicle for sale.</p>
      </div>

      {/* Photo Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Vehicle Photos</h2>
          <span className="text-sm text-gray-500">
            {images.length} / 10 photos
          </span>
        </div>
        
        {images.length < 10 && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
          >
            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Click to upload photos</p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB each</p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          disabled={images.length >= 10}
        />
        
        {uploadError && (
          <div className="mt-2 p-2 bg-red-50 text-red-600 text-sm rounded">
            {uploadError}
          </div>
        )}
        
        {images.length > 0 && (
          <div className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((url, index) => (
                <div 
                  key={index} 
                  className="relative group aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={url}
                    alt={`Vehicle photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity" />
                  
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => reorderImages(index, index - 1)}
                        className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
                        title="Move left"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                    {index < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => reorderImages(index, index + 1)}
                        className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
                        title="Move right"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-1 bg-white text-red-500 rounded-full shadow hover:bg-red-50"
                      title="Remove photo"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                      Main Photo
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5L8 10H16L12 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 14H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8 17H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Basic Information
        </h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
          <div className="relative">
            <select
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 bg-white"
              value={formData.make?.toLowerCase() === 'tesla' ? 'Tesla' : 'Other'}
              onChange={e => {
                if (e.target.value === 'Tesla') {
                  setFormData(prev => ({
                    ...prev,
                    make: 'Tesla',
                    model: '',
                    year: undefined,
                    specifications: { ...prev.specifications, trim: '' },
                    fuelType: 'Electric',
                    features: ['Autopilot', 'Navigation', 'Heated Seats'],
                    bodyStyle: 'Sedan',
                    transmission: 'Automatic',
                    condition: 'Used'
                  }));
                  setSelectedTrim('');
                  setEvFeatures(prev => ({
                    ...prev,
                    range: '300',
                    batterySize: '75',
                    chargingSpeed: '250',
                    zeroToSixty: '',
                    fsdHardware: '',
                    cameras: '',
                    notes: '',
                    fsd: true,
                    enhancedAutopilot: true,
                    unlimitedSupercharging: true,
                    batteryWarranty: true,
                    evIncentiveEligible: true,
                    underWarranty: false,
                    trim: 'Standard Range',
                    premiumConnectivity: false,
                    accelerationBoost: false,
                    homeChargerIncluded: false,
                    keyCards: '2',
                    hasCCSAdapter: false,
                    processor: '',
                    hasMobileCharger: true,
                    hasAirCompressor: false,
                    hasRoadsideKit: false,
                  }));
                } else {
                  setFormData(prev => ({
                    ...prev,
                    make: '',
                    model: '',
                    year: undefined,
                    specifications: { ...prev.specifications, trim: '' }
                  }));
                  setSelectedTrim('');
                }
              }}
            >
              <option value="Tesla">Tesla</option>
              <option value="Other">Other</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formData.make?.toLowerCase() === 'tesla' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <div className="relative">
                  <select
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 bg-white"
                    value={formData.model || ''}
                    onChange={e => {
                      setFormData(prev => ({ ...prev, model: e.target.value }));
                      setSelectedTrim('');
                    }}
                    required
                  >
                    <option value="">Select Model</option>
                    {teslaModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <div className="relative">
                  <select
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 bg-white"
                    value={formData.year || ''}
                    onChange={e => {
                      setFormData(prev => ({ ...prev, year: Number(e.target.value) }));
                      setSelectedTrim('');
                    }}
                    required
                  >
                    <option value="">Select Year</option>
                    {formData.model && teslaTrimsByYear[formData.model] 
                      ? Object.keys(teslaTrimsByYear[formData.model])
                          .map(Number)
                          .sort((a, b) => b - a) // Sort years in descending order
                          .map((year: number) => (
                            <option key={year} value={year}>{year}</option>
                          ))
                      : teslaYears.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              {formData.model && formData.year && teslaTrimsByYear[formData.model]?.[formData.year] && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trim</label>
                  <div className="relative">
                    <select
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 bg-white"
                      value={selectedTrim}
                      onChange={e => setSelectedTrim(e.target.value)}
                      required
                    >
                      <option value="">Select Trim</option>
                      {teslaTrimsByYear[formData.model][formData.year].map(trim => (
                        <option key={trim} value={trim}>{trim}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                <input
                  type="text"
                  value={formData.make || ''}
                  onChange={e => setFormData({ ...formData, make: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 hover:border-blue-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input
                  type="text"
                  value={formData.model || ''}
                  onChange={e => setFormData({ ...formData, model: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 hover:border-blue-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <div className="relative">
                  <select
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 bg-white"
                    value={formData.year || ''}
                    onChange={e => setFormData({ ...formData, year: Number(e.target.value) })}
                    required
                  >
                    <option value="">Select Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trim</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 hover:border-blue-300"
                  value={selectedTrim}
                  onChange={e => setSelectedTrim(e.target.value)}
                  placeholder="Enter Trim (e.g. XLE, M3, Touring)"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 hover:border-blue-300"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={formData.purchasePrice || ''}
                onChange={(e) => setFormData({ ...formData, purchasePrice: parseInt(e.target.value) })}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 hover:border-blue-300"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500 italic">
              For internal analytics only - this information will not be shown publicly or shared with customers
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status || 'available'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Vehicle['status'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 hover:border-blue-300"
            >
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
            <input
              type="number"
              value={formData.mileage || ''}
              onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 hover:border-blue-300"
              required
            />
          </div>

          {/* KBB Estimate Button */}
          <div className="col-span-2 flex items-center gap-3 mt-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => {
                const kbbUrl = `https://www.kbb.com/whats-my-car-worth/?year=${formData.year || ''}&make=${formData.make || ''}&model=${formData.model || ''}`;
                window.open(kbbUrl, '_blank');
              }}
            >
              Get KBB Price Estimate
            </button>
            <span className="text-xs text-gray-500">(Opens Kelley Blue Book in a new tab)</span>
          </div>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Condition</label>
            <Listbox value={formData.condition} onChange={(value) => setFormData({ ...formData, condition: value })}>
              {({ open }) => (
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm">
                    <span className="block truncate">{formData.condition || 'Select Condition'}</span>
                  </Listbox.Button>
                  <Transition as={Fragment} show={open} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {conditions.map((condition) => (
                        <Listbox.Option key={condition} value={condition}>
                          {(props) => { const { selected, active } = props; return (
                            <div className={`relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}`}>
                              <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{condition}</span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">✓</span>
                              ) : null}
                            </div>
                          ); }}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              )}
            </Listbox>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Title Status</label>
            <Listbox value={formData.titleStatus} onChange={(value) => setFormData({ ...formData, titleStatus: value as Vehicle['titleStatus'] })}>
              {({ open }) => (
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm">
                    <span className="block truncate">{formData.titleStatus || 'Select Title Status'}</span>
                  </Listbox.Button>
                  <Transition as={Fragment} show={open} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {titleStatuses.map((status) => (
                        <Listbox.Option key={status} value={status}>
                          {(props) => { const { selected, active } = props; return (
                            <div className={`relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}`}>
                              <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{status}</span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">✓</span>
                              ) : null}
                            </div>
                          ); }}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              )}
            </Listbox>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Transmission</label>
            <Listbox value={formData.transmission} onChange={(value) => setFormData({ ...formData, transmission: value })}>
              {({ open }) => (
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm">
                    <span className="block truncate">{formData.transmission || 'Select Transmission'}</span>
                  </Listbox.Button>
                  <Transition as={Fragment} show={open} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {transmissions.map((transmission) => (
                        <Listbox.Option key={transmission} value={transmission}>
                          {(props) => { const { selected, active } = props; return (
                            <div className={`relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}`}>
                              <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{transmission}</span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">✓</span>
                              ) : null}
                            </div>
                          ); }}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              )}
            </Listbox>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
            <Listbox value={formData.fuelType} onChange={(value) => setFormData({ ...formData, fuelType: value })}>
              {({ open }) => (
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm">
                    <span className="block truncate">{formData.fuelType || 'Select Fuel Type'}</span>
                  </Listbox.Button>
                  <Transition as={Fragment} show={open} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {fuelTypes.map((fuelType) => (
                        <Listbox.Option key={fuelType} value={fuelType}>
                          {(props) => { const { selected, active } = props; return (
                            <div className={`relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}`}>
                              <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{fuelType}</span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">✓</span>
                              ) : null}
                            </div>
                          ); }}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              )}
            </Listbox>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Body Style</label>
            <Listbox value={formData.bodyStyle} onChange={(value) => setFormData({ ...formData, bodyStyle: value })}>
              {({ open }) => (
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm">
                    <span className="block truncate">{formData.bodyStyle || 'Select Body Style'}</span>
                  </Listbox.Button>
                  <Transition as={Fragment} show={open} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {bodyStyles.map((style) => (
                        <Listbox.Option key={style} value={style}>
                          {(props) => { const { selected, active } = props; return (
                            <div className={`relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}`}>
                              <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{style}</span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">✓</span>
                              ) : null}
                            </div>
                          ); }}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              )}
            </Listbox>
          </div>
        </div>
      </div>

      {/* EV-specific features */}
      {(formData.fuelType === 'Electric' || formData.make?.toLowerCase() === 'tesla') && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100 mb-8 hover:shadow-md transition-shadow duration-200"
        >
          <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 3L17 7V21H7V3H13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 7H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Electric Vehicle Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Range (miles)</label>
              <input
                type="text"
                value={evFeatures.range || ''}
                onChange={e => setEvFeatures({ ...evFeatures, range: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 hover:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Battery Size (kWh)</label>
              <input
                type="text"
                value={evFeatures.batterySize || ''}
                onChange={e => setEvFeatures({ ...evFeatures, batterySize: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 hover:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Charging Speed (kW)</label>
              <input
                type="text"
                value={evFeatures.chargingSpeed || ''}
                onChange={e => setEvFeatures({ ...evFeatures, chargingSpeed: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 hover:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">0-60 mph</label>
              <input
                type="text"
                value={evFeatures.zeroToSixty || ''}
                onChange={e => setEvFeatures({ ...evFeatures, zeroToSixty: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 hover:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">FSD Hardware</label>
              <input
                type="text"
                value={evFeatures.fsdHardware || ''}
                onChange={e => setEvFeatures({ ...evFeatures, fsdHardware: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 hover:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cameras</label>
              <input
                type="text"
                value={evFeatures.cameras || ''}
                onChange={e => setEvFeatures({ ...evFeatures, cameras: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 hover:border-blue-300"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input
                type="text"
                value={evFeatures.notes || ''}
                onChange={e => setEvFeatures({ ...evFeatures, notes: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 hover:border-blue-300"
              />
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Vehicle Features & Options
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-4">
                <label className="relative flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={evFeatures.fsd}
                    onChange={(e) => setEvFeatures({ ...evFeatures, fsd: e.target.checked })}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded transition-colors duration-200 ease-in-out focus:ring-blue-500 focus:ring-offset-0 cursor-pointer group-hover:border-blue-400"
                  />
                  <span className="ml-3 text-sm text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                    Full Self-Driving Capability
                  </span>
                </label>

                <label className="relative flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={evFeatures.enhancedAutopilot}
                    onChange={(e) => setEvFeatures({ ...evFeatures, enhancedAutopilot: e.target.checked })}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded transition-colors duration-200 ease-in-out focus:ring-blue-500 focus:ring-offset-0 cursor-pointer group-hover:border-blue-400"
                  />
                  <span className="ml-3 text-sm text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                    Enhanced Autopilot
                  </span>
                </label>

                <label className="relative flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={evFeatures.unlimitedSupercharging}
                    onChange={(e) => setEvFeatures({ ...evFeatures, unlimitedSupercharging: e.target.checked })}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded transition-colors duration-200 ease-in-out focus:ring-blue-500 focus:ring-offset-0 cursor-pointer group-hover:border-blue-400"
                  />
                  <span className="ml-3 text-sm text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                    Unlimited Free Supercharging
                  </span>
                </label>

                <label className="relative flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={evFeatures.batteryWarranty}
                    onChange={(e) => setEvFeatures({ ...evFeatures, batteryWarranty: e.target.checked })}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded transition-colors duration-200 ease-in-out focus:ring-blue-500 focus:ring-offset-0 cursor-pointer group-hover:border-blue-400"
                  />
                  <span className="ml-3 text-sm text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                    Battery Warranty Active
                  </span>
                </label>

                <label className="relative flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={evFeatures.premiumConnectivity}
                    onChange={(e) => setEvFeatures({ ...evFeatures, premiumConnectivity: e.target.checked })}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded transition-colors duration-200 ease-in-out focus:ring-blue-500 focus:ring-offset-0 cursor-pointer group-hover:border-blue-400"
                  />
                  <span className="ml-3 text-sm text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                    Premium Connectivity
                  </span>
                </label>

                <label className="relative flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={evFeatures.accelerationBoost}
                    onChange={(e) => setEvFeatures({ ...evFeatures, accelerationBoost: e.target.checked })}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded transition-colors duration-200 ease-in-out focus:ring-blue-500 focus:ring-offset-0 cursor-pointer group-hover:border-blue-400"
                  />
                  <span className="ml-3 text-sm text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                    Acceleration Boost
                  </span>
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Cards/Fob</label>
                  <div className="relative">
                    <select
                      value={evFeatures.keyCards}
                      onChange={(e) => setEvFeatures({ ...evFeatures, keyCards: e.target.value })}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 bg-white"
                    >
                      <option value="1">1 Key Card</option>
                      <option value="2">2 Key Cards</option>
                      <option value="2+fob">2 Key Cards + Key Fob</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Processor Type</label>
                  <div className="relative">
                    <select
                      value={evFeatures.processor}
                      onChange={(e) => setEvFeatures({ ...evFeatures, processor: e.target.value })}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 bg-white"
                    >
                      <option value="">Select Processor</option>
                      <option value="Intel Atom">Intel Atom</option>
                      <option value="AMD Ryzen">AMD Ryzen</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <label className="relative flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={evFeatures.hasCCSAdapter}
                    onChange={(e) => setEvFeatures({ ...evFeatures, hasCCSAdapter: e.target.checked })}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded transition-colors duration-200 ease-in-out focus:ring-blue-500 focus:ring-offset-0 cursor-pointer group-hover:border-blue-400"
                  />
                  <span className="ml-3 text-sm text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                    CCS Adapter Included
                  </span>
                </label>

                <label className="relative flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={evFeatures.hasMobileCharger}
                    onChange={(e) => setEvFeatures({ ...evFeatures, hasMobileCharger: e.target.checked })}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded transition-colors duration-200 ease-in-out focus:ring-blue-500 focus:ring-offset-0 cursor-pointer group-hover:border-blue-400"
                  />
                  <span className="ml-3 text-sm text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                    Tesla Mobile Charger
                  </span>
                </label>

                <label className="relative flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={evFeatures.hasAirCompressor}
                    onChange={(e) => setEvFeatures({ ...evFeatures, hasAirCompressor: e.target.checked })}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded transition-colors duration-200 ease-in-out focus:ring-blue-500 focus:ring-offset-0 cursor-pointer group-hover:border-blue-400"
                  />
                  <span className="ml-3 text-sm text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                    Tesla Air Compressor
                  </span>
                </label>

                <label className="relative flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={evFeatures.hasRoadsideKit}
                    onChange={(e) => setEvFeatures({ ...evFeatures, hasRoadsideKit: e.target.checked })}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded transition-colors duration-200 ease-in-out focus:ring-blue-500 focus:ring-offset-0 cursor-pointer group-hover:border-blue-400"
                  />
                  <span className="ml-3 text-sm text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                    Tesla Roadside Kit
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <label className="relative flex items-center group cursor-pointer">
              <input
                type="checkbox"
                id="evCreditEligible"
                checked={evCreditEligible}
                onChange={e => setEvCreditEligible(e.target.checked)}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded transition-colors duration-200 ease-in-out focus:ring-blue-500 focus:ring-offset-0 cursor-pointer group-hover:border-blue-400"
              />
              <span className="ml-3 text-sm text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                Qualifies for EV Credit
              </span>
              {evCreditEligible && (
                <select
                  className="ml-4 border rounded px-3 py-1 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
                  value={evCreditAmount}
                  onChange={e => setEvCreditAmount(Number(e.target.value))}
                >
                  <option value={4000}>$4,000</option>
                  <option value={2000}>$2,000</option>
                </select>
              )}
            </label>
          </div>
        </motion.div>
      )}

      {/* Description section with enhanced styling */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 5h16v16H4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 9h16M8 5v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Description
        </h2>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={12}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300 resize-y"
          placeholder="Describe the vehicle's condition, history, and special features..."
        />
      </motion.div>

      {/* Social Media Posting */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Media Posting</h2>
        
        {/* Social Media Connections */}
        <div className="mb-6 space-y-4">
          <button
            type="button"
            onClick={handleTwitterConnect}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Connect with X
          </button>

          <button
            type="button"
            onClick={handleFacebookConnect}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold bg-[#1877f2] text-white hover:bg-[#1664cf] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v9.07C24.16 27.87 29 22.5 29 16z"/>
            </svg>
            Connect with Facebook
          </button>

          <button
            type="button"
            onClick={handleInstagramConnect}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#405DE6] via-[#5B51D8] to-[#833AB4] text-white hover:opacity-90 transition-opacity"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Connect with Instagram
          </button>
        </div>

        {/* Connected Accounts Status */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Connected Accounts</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X (Twitter)</span>
              </div>
              <span className="text-sm text-gray-500">Not Connected</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H9.9V16h4.23v-2.36c0-4.18 2.49-6.48 6.3-6.48 1.83 0 3.74.33 3.74.33v4.11h-2.11c-2.08 0-2.73 1.29-2.73 2.62V16h4.66l-.75 3.75h-3.91v9.07C24.16 27.87 29 22.5 29 16z"/>
                </svg>
                <span>Facebook</span>
              </div>
              <span className="text-sm text-gray-500">Not Connected</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </div>
              <span className="text-sm text-gray-500">Not Connected</span>
            </div>
          </div>
        </div>

        {/* Post to Social Media button - only enabled when accounts are connected */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
          disabled={true}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Connect an account to post
        </button>
      </div>

      {/* Show a notice when EV prefill is applied */}
      {(formData.make?.toLowerCase() === 'tesla' || formData.fuelType?.toLowerCase() === 'electric') && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-900 rounded shadow-sm text-sm">
          EV features and description have been smart-prefilled. You can edit them below.
        </div>
      )}

      {/* CA tax/registration calculator button */}
      <div className="mt-2">
        <button
          type="button"
          className="px-3 py-1 rounded bg-blue-100 text-blue-900 font-semibold hover:bg-blue-200 text-sm"
          onClick={() => alert('CA Tax/Registration calculator coming soon!')}
        >
          Calculate CA Taxes & Registration
        </button>
      </div>

      {/* Action Buttons with enhanced styling */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex justify-end space-x-4 mt-8"
      >
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-8 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          Save Vehicle
        </button>
      </motion.div>
    </form>
  )
}