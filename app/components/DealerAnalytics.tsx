import { useVehicleStore } from '../store/vehicleStore'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import RecentActivityLog from './RecentActivityLog'
import MostViewedVehicles from './MostViewedVehicles'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function DealerAnalytics() {
  const { vehicles, salesMetrics, inventoryMetrics } = useVehicleStore()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  // Ensure we have valid data for the chart
  const chartData = {
    labels: (inventoryMetrics.peakSalesDays || []).map(d => d?.day || '').filter(Boolean),
    datasets: [{
      label: 'Sales Count',
      data: (inventoryMetrics.peakSalesDays || []).map(d => d?.count || 0),
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    }]
  }

  return (
    <div className="space-y-6">
      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Financial Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(salesMetrics.totalRevenue || 0)}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Profit</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(salesMetrics.totalProfit || 0)}</p>
            </div>
            <div>
              <p className="text-gray-600">Average Time to Sell</p>
              <p className="text-2xl font-bold">{(salesMetrics.averageTimeToSell || 0).toFixed(1)} days</p>
            </div>
          </div>
        </div>

        {/* EV Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">EV Performance</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Total EV Incentives Claimed</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(salesMetrics.evIncentivesTotal || 0)}</p>
            </div>
            <div>
              <p className="text-gray-600">EV Sales Percentage</p>
              <p className="text-2xl font-bold">{formatPercent(salesMetrics.evSalesPercentage || 0)}</p>
            </div>
            <div>
              <p className="text-gray-600">Average EV Incentive</p>
              <p className="text-2xl font-bold">{formatCurrency(inventoryMetrics.averageEvIncentive || 0)}</p>
            </div>
          </div>
        </div>

        {/* Inventory Health */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Inventory Health</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Average Vehicle Age</p>
              <p className="text-2xl font-bold">{(inventoryMetrics.averageAge || 0).toFixed(1)} days</p>
            </div>
            <div>
              <p className="text-gray-600">EV Inventory Percentage</p>
              <p className="text-2xl font-bold">{formatPercent(inventoryMetrics.evInventoryPercentage || 0)}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Available Vehicles</p>
              <p className="text-2xl font-bold">{vehicles.filter(v => v.status === 'available').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Viewed Vehicles */}
        <MostViewedVehicles />

        {/* Recent Activity Log */}
        <RecentActivityLog />
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Performing Models */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing Models</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Model</th>
                  <th className="text-right py-2">Avg. Time to Sell</th>
                  <th className="text-right py-2">Avg. Profit</th>
                  <th className="text-right py-2">Views</th>
                </tr>
              </thead>
              <tbody>
                {(inventoryMetrics.bestPerformingModels || []).map((model, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{model.model}</td>
                    <td className="text-right">{model.averageTimeToSell.toFixed(1)} days</td>
                    <td className="text-right">{formatCurrency(model.profit)}</td>
                    <td className="text-right">{model.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Features */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Most Popular Features</h3>
          <div className="space-y-2">
            {(inventoryMetrics.popularFeatures || []).slice(0, 5).map((feature, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600">{feature.feature}</span>
                <span className="font-semibold">{feature.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Performance Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Sales Performance by Day</h3>
        <div className="h-64">
          {chartData.labels.length > 0 ? (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  title: {
                    display: false
                  }
                }
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No sales data available
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 