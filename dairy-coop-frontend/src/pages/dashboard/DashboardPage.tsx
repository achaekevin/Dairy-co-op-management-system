import { motion } from 'framer-motion';
import { useState } from 'react';
import StatsCard from '../../components/cards/StatsCard';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import WeatherWidget from '../../components/dashboard/WeatherWidget';
import QuickActionsWidget from '../../components/dashboard/QuickActionsWidget';
import UpcomingEventsWidget from '../../components/dashboard/UpcomingEventsWidget';
import TasksWidget from '../../components/dashboard/TasksWidget';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import {
  HiUsers,
  HiBeaker,
  HiCurrencyRupee,
  HiBanknotes,
  HiChartBar,
  HiExclamationTriangle,
  HiArrowDownTray,
  HiArrowPath,
  HiEllipsisVertical,
} from 'react-icons/hi2';

const DashboardPage = () => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleExport = () => {
    // Export logic here
  };
  // Mock data
  const stats = [
    {
      title: 'Total Farmers',
      value: '1,234',
      icon: <HiUsers className="w-6 h-6" />,
      trend: { value: 8.2, isPositive: true },
      color: 'primary' as const,
    },
    {
      title: 'Milk Collected Today',
      value: '8,456 L',
      icon: <HiBeaker className="w-6 h-6" />,
      trend: { value: 5.4, isPositive: true },
      color: 'secondary' as const,
    },
    {
      title: 'Revenue Today',
      value: '₹4,23,890',
      icon: <HiCurrencyRupee className="w-6 h-6" />,
      trend: { value: 12.5, isPositive: true },
      color: 'success' as const,
    },
    {
      title: 'Outstanding Loans',
      value: '₹28,45,000',
      icon: <HiBanknotes className="w-6 h-6" />,
      trend: { value: 3.2, isPositive: false },
      color: 'warning' as const,
    },
    {
      title: 'Quality Score',
      value: '94.5%',
      icon: <HiChartBar className="w-6 h-6" />,
      trend: { value: 2.1, isPositive: true },
      color: 'info' as const,
    },
    {
      title: 'Rejected Milk',
      value: '45 L',
      icon: <HiExclamationTriangle className="w-6 h-6" />,
      trend: { value: 15.3, isPositive: false },
      color: 'error' as const,
    },
  ];

  const milkCollectionDataChart = [
    { date: 'Mon', Morning: 4200, Evening: 3800 },
    { date: 'Tue', Morning: 4500, Evening: 4100 },
    { date: 'Wed', Morning: 4300, Evening: 3900 },
    { date: 'Thu', Morning: 4700, Evening: 4300 },
    { date: 'Fri', Morning: 4400, Evening: 4000 },
    { date: 'Sat', Morning: 4600, Evening: 4200 },
    { date: 'Sun', Morning: 4100, Evening: 3700 },
  ];

  const revenueDataChart = [
    { month: 'Jan', Revenue: 425000 },
    { month: 'Feb', Revenue: 398000 },
    { month: 'Mar', Revenue: 467000 },
    { month: 'Apr', Revenue: 512000 },
    { month: 'May', Revenue: 489000 },
    { month: 'Jun', Revenue: 534000 },
  ];

  const qualityDataChart = [
    { name: 'Excellent', value: 65, color: '#22c55e' },
    { name: 'Good', value: 25, color: '#3b82f6' },
    { name: 'Average', value: 8, color: '#f59e0b' },
    { name: 'Poor', value: 2, color: '#ef4444' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Welcome back! Here's what's happening with your cooperative today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <HiArrowPath
              className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={handleExport}>
            <HiArrowDownTray className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Milk Collection Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Weekly Milk Collection</CardTitle>
                <Button variant="ghost" size="sm">
                  <HiEllipsisVertical className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <LineChart
                data={milkCollectionDataChart}
                lines={[
                  {
                    dataKey: 'Morning',
                    name: 'Morning',
                    color: '#22c55e',
                    strokeWidth: 3,
                  },
                  {
                    dataKey: 'Evening',
                    name: 'Evening',
                    color: '#3b82f6',
                    strokeWidth: 3,
                  },
                ]}
                xAxisKey="date"
                height={300}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <Button variant="ghost" size="sm">
                  <HiEllipsisVertical className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <BarChart
                data={revenueDataChart}
                bars={[
                  {
                    dataKey: 'Revenue',
                    name: 'Revenue',
                    color: '#22c55e',
                  },
                ]}
                xAxisKey="month"
                height={300}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row - Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quality Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Milk Quality Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                data={qualityDataChart}
                height={250}
                innerRadius={60}
                outerRadius={80}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activities</CardTitle>
                <Badge variant="primary">Live</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: 'Milk collection completed',
                    user: 'Ramesh Kumar',
                    time: '5 minutes ago',
                    type: 'success',
                  },
                  {
                    action: 'Payment processed',
                    user: 'Suresh Patel',
                    time: '15 minutes ago',
                    type: 'info',
                  },
                  {
                    action: 'Quality test rejected',
                    user: 'Mahesh Singh',
                    time: '1 hour ago',
                    type: 'error',
                  },
                  {
                    action: 'New farmer registered',
                    user: 'Dinesh Yadav',
                    time: '2 hours ago',
                    type: 'success',
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-4 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'success'
                          ? 'bg-green-500'
                          : activity.type === 'error'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Additional Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <WeatherWidget />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <TasksWidget />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <QuickActionsWidget />
        </motion.div>
      </div>

      {/* Last Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        <UpcomingEventsWidget />
      </motion.div>
    </div>
  );
};

export default DashboardPage;
