import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import AreaChart from '../../components/charts/AreaChart';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30d');

  // Mock analytics data
  const revenueData = [
    { name: 'Week 1', value: 450000 },
    { name: 'Week 2', value: 520000 },
    { name: 'Week 3', value: 480000 },
    { name: 'Week 4', value: 590000 },
  ];

  const collectionData = [
    { name: 'Mon', value: 12500 },
    { name: 'Tue', value: 13200 },
    { name: 'Wed', value: 12800 },
    { name: 'Thu', value: 13500 },
    { name: 'Fri', value: 13100 },
    { name: 'Sat', value: 14200 },
    { name: 'Sun', value: 11800 },
  ];

  const categoryData = [
    { name: 'Cattle Feed', value: 125000, color: '#3B82F6' },
    { name: 'Medicine', value: 45000, color: '#10B981' },
    { name: 'Equipment', value: 180000, color: '#F59E0B' },
    { name: 'Packaging', value: 85000, color: '#EF4444' },
    { name: 'Other', value: 35000, color: '#8B5CF6' },
  ];

  const performanceData = [
    { name: 'Jan', value: 850 },
    { name: 'Feb', value: 920 },
    { name: 'Mar', value: 880 },
    { name: 'Apr', value: 950 },
    { name: 'May', value: 1020 },
    { name: 'Jun', value: 980 },
  ];

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: '₹20.4L',
      change: '+12.5%',
      trend: 'up' as const,
      description: 'vs last month',
    },
    {
      title: 'Avg Daily Collection',
      value: '13,012 L',
      change: '+8.3%',
      trend: 'up' as const,
      description: 'vs last month',
    },
    {
      title: 'Active Farmers',
      value: '1,247',
      change: '+3.2%',
      trend: 'up' as const,
      description: 'vs last month',
    },
    {
      title: 'Quality Score',
      value: '94.2%',
      change: '-1.1%',
      trend: 'down' as const,
      description: 'vs last month',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard/reports')}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Business intelligence and performance metrics
            </p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={[
              { value: '7d', label: 'Last 7 Days' },
              { value: '30d', label: 'Last 30 Days' },
              { value: '90d', label: 'Last 90 Days' },
              { value: '1y', label: 'Last Year' },
            ]}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {kpi.title}
                </p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                    {kpi.value}
                  </p>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {kpi.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="h-4 w-4" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4" />
                    )}
                    {kpi.change}
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {kpi.description}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Revenue Trend
          </h3>
          <AreaChart
            data={revenueData}
            areas={[{ dataKey: 'value', name: 'Revenue', color: '#3B82F6', fillOpacity: 0.3 }]}
            xAxisKey="name"
            height={300}
          />
        </Card>

        {/* Daily Collection */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Daily Milk Collection
          </h3>
          <BarChart
            data={collectionData}
            bars={[{ dataKey: 'value', name: 'Collection (L)', color: '#10B981' }]}
            xAxisKey="name"
            height={300}
          />
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Expense Breakdown by Category
          </h3>
          <PieChart
            data={categoryData}
            height={300}
          />
        </Card>

        {/* Farmer Performance */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Active Farmers Trend
          </h3>
          <LineChart
            data={performanceData}
            lines={[{ dataKey: 'value', name: 'Active Farmers', color: '#8B5CF6' }]}
            xAxisKey="name"
            height={300}
          />
        </Card>
      </div>

      {/* Insights Section */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Key Insights
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="w-2 h-2 mt-2 rounded-full bg-green-600" />
            <div>
              <p className="font-medium text-green-900 dark:text-green-100">
                Revenue Growth
              </p>
              <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                Revenue increased by 12.5% this month, driven by higher milk collection and better pricing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="w-2 h-2 mt-2 rounded-full bg-blue-600" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Farmer Engagement
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                48 new farmers joined this month. Active farmer count reached 1,247, a 3.2% increase.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <div className="w-2 h-2 mt-2 rounded-full bg-yellow-600" />
            <div>
              <p className="font-medium text-yellow-900 dark:text-yellow-100">
                Quality Alert
              </p>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                Quality score decreased by 1.1%. Consider conducting quality training sessions for farmers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <div className="w-2 h-2 mt-2 rounded-full bg-purple-600" />
            <div>
              <p className="font-medium text-purple-900 dark:text-purple-100">
                Operational Efficiency
              </p>
              <p className="text-sm text-purple-800 dark:text-purple-200 mt-1">
                Average collection time reduced by 15 minutes per route, improving operational efficiency.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Collection Efficiency
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-900 dark:text-blue-100">
            87.5%
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
            Target: 90%
          </p>
          <div className="mt-3 h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 dark:bg-blue-400" style={{ width: '87.5%' }} />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <p className="text-sm font-medium text-green-900 dark:text-green-100">
            Payment Timelines
          </p>
          <p className="mt-2 text-3xl font-bold text-green-900 dark:text-green-100">
            95.2%
          </p>
          <p className="text-xs text-green-800 dark:text-green-200 mt-1">
            On-time payments
          </p>
          <div className="mt-3 h-2 bg-green-200 dark:bg-green-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 dark:bg-green-400" style={{ width: '95.2%' }} />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
            Farmer Satisfaction
          </p>
          <p className="mt-2 text-3xl font-bold text-purple-900 dark:text-purple-100">
            4.6/5
          </p>
          <p className="text-xs text-purple-800 dark:text-purple-200 mt-1">
            Based on 342 responses
          </p>
          <div className="mt-3 h-2 bg-purple-200 dark:bg-purple-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-600 dark:bg-purple-400" style={{ width: '92%' }} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
