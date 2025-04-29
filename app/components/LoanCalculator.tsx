'use client'

import React, { useState, useEffect } from 'react'

interface LoanCalculatorProps {
  vehiclePrice: number
}

export default function LoanCalculator({ vehiclePrice }: LoanCalculatorProps) {
  const [downPayment, setDownPayment] = useState(vehiclePrice * 0.2) // 20% default down payment
  const [loanTerm, setLoanTerm] = useState(60) // 60 months default
  const [interestRate, setInterestRate] = useState(4.5) // 4.5% default APR
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)

  useEffect(() => {
    calculateLoan()
  }, [downPayment, loanTerm, interestRate, vehiclePrice])

  const calculateLoan = () => {
    const principal = vehiclePrice - downPayment
    const monthlyRate = interestRate / 100 / 12
    const monthlyPaymentCalc = 
      (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
      (Math.pow(1 + monthlyRate, loanTerm) - 1)
    
    const totalPayments = monthlyPaymentCalc * loanTerm
    const totalInterestCalc = totalPayments - principal

    setMonthlyPayment(monthlyPaymentCalc)
    setTotalInterest(totalInterestCalc)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Loan Calculator</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Down Payment: {formatCurrency(downPayment)}
          </label>
          <input
            type="range"
            min={0}
            max={vehiclePrice}
            step={100}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatCurrency(0)}</span>
            <span>{formatCurrency(vehiclePrice)}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Term: {loanTerm} months
          </label>
          <input
            type="range"
            min={12}
            max={84}
            step={12}
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>12 months</span>
            <span>84 months</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate (APR): {interestRate}%
          </label>
          <input
            type="range"
            min={0}
            max={20}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>20%</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Monthly Payment</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(monthlyPayment)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Interest</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(totalInterest)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Principal</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(vehiclePrice - downPayment)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Cost</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(vehiclePrice + totalInterest)}
              </p>
            </div>
          </div>
        </div>

        <button
          className="w-full py-3 px-4 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => window.open('/financing', '_self')}
        >
          Financing Options
        </button>
      </div>
    </div>
  )
} 