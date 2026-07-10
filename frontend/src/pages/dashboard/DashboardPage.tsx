import { motion } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { exportToExcel } from '../../utils/export';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types';
import toast from 'react-hot-toast';
import api from '../../services/api';
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
  HiCheckCircle,
  HiClock,
  HiShoppingCart,
} from 'react-icons/hi2';

interface DashboardData {
  farmers: {
    totalFarmers: number;
    activeFarmers: number;
  };
  milkCollection: {
    totalQuantity: number;
    totalCollections: number;
    avgFat: number;
    avgSnf: number;
  };
  quality: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
  };
  payments: {
    totalPending: number;
    totalPaid: number;
  };
  loans: {
    totalOutstanding: number;
    activeLoans: number;
  };
  customers: {
    totalCustomers: number;
    activeCustomers: number;
  };
  employees: {
    totalEmployees: number;
    activeEmployees: number;
  };
}

const DashboardPage = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const userRole = user?.role || UserRole.VIEWER;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/overview');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleExport = () => {
    try {
      const exportStats = filteredStats.map(stat => ({
        Metric: stat.title,
        Value: stat.value,
        Trend: `${stat.trend.isPositive ? '+' : '-'}${stat.trend.value}%`,
        Status: stat.color,
      }));

      exportToExcel(exportStats, 'dashboard_stats');
      toast.success('Dashboard data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
      console.error('Export error:', error);
    }
  };

  // All available stats
  const allStats: Array<{
    title: string;
    value: string;
    icon: React.ReactNode;
    trend: { value: number; isPositive: boolean };
    color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
    roles: UserRole[];
    onClick: () => void;
  }> = [
    {
      title: 'Total Farmers',
      value: loading ? '...' : dashboardData?.farmers?.totalFarmers?.toString() || '0',
      icon: <HiUsers className="w-6 h-6" />,
      trend: { value: 8.2, isPositive: true },
      color: 'primary' as const,
      roles: [UserRole.ADMIN, UserRole.MANAGER],
      onClick: () => navigate('/dashboard/farmers'),
    },
    {
      title: 'Active Farmers',
      value: loading ? '...' : dashboardData?.farmers?.activeFarmers?.toString() || '0',
      icon: <HiUsers className="w-6 h-6" />,
      trend: { value: 5.1, isPositive: true },
      color: 'success' as const,
      roles: [UserRole.ADMIN, UserRole.MANAGER],
      onClick: () => navigate('/dashboard/farmers'),
    },
    {
      title: 'Total Customers',
      value: loading ? '...' : dashboardData?.customers?.totalCustomers?.toString() || '0',
      icon: <HiShoppingCart className="w-6 h-6" />,
      trend: { value: 12.3, isPositive: true },
      color: 'info' as const,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STORE_MANAGER],
      onClick: () => navigate('/dashboard/customers'),
    },
    {
      title: 'Milk Collected Today',
      value: loading ? '...' : `${dashboardData?.milkCollection?.totalQuantity?.toFixed(0) || '0'} L`,
      icon: <HiBeaker className="w-6 h-6" />,
      trend: { value: 5.4, isPositive: true },
      color: 'secondary' as const,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR],
      onClick: () => navigate('/dashboard/milk-collection'),
    },
    {
      title: 'Total Collections',
      value: loading ? '...' : dashboardData?.milkCollection?.totalCollections?.toString() || '0',
      icon: <HiBeaker className="w-6 h-6" />,
      trend: { value: 3.2, isPositive: true },
      color: 'secondary' as const,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR],
      onClick: () => navigate('/dashboard/milk-collection'),
    },
    {
      title: 'Payments Pending',
      value: loading ? '...' : `KSh ${dashboardData?.payments?.totalPending?.toLocaleString() || '0'}`,
      icon: <HiCurrencyRupee className="w-6 h-6" />,
      trend: { value: 2.1, isPositive: false },
      color: 'warning' as const,
      roles: [UserRole.ADMIN, UserRole.ACCOUNTANT],
      onClick: () => navigate('/dashboard/payments'),
    },
    {
      title: 'Payments Completed',
      value: loading ? '...' : `KSh ${dashboardData?.payments?.totalPaid?.toLocaleString() || '0'}`,
      icon: <HiCurrencyRupee className="w-6 h-6" />,
      trend: { value: 12.5, isPositive: true },
      color: 'success' as const,
      roles: [UserRole.ADMIN, UserRole.ACCOUNTANT],
      onClick: () => navigate('/dashboard/payments'),
    },
    {
      title: 'Outstanding Loans',
      value: loading ? '...' : `KSh ${dashboardData?.loans?.totalOutstanding?.toLocaleString() || '0'}`,
      icon: <HiBanknotes className="w-6 h-6" />,
      trend: { value: 3.2, isPositive: false },
      color: 'warning' as const,
      roles: [UserRole.ADMIN, UserRole.ACCOUNTANT],
      onClick: () => navigate('/dashboard/loans'),
    },
    {
      title: 'Quality Tests Passed',
      value: loading ? '...' : `${dashboardData?.quality?.passedTests || '0'}/${dashboardData?.quality?.totalTests || '0'}`,
      icon: <HiChartBar className="w-6 h-6" />,
      trend: { value: 2.1, isPositive: true },
      color: 'info' as const,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR],
      onClick: () => navigate('/dashboard/quality'),
    },
    {
      title: 'Quality Tests Failed',
      value: loading ? '...' : dashboardData?.quality?.failedTests?.toString() || '0',
      icon: <HiExclamationTriangle className="w-6 h-6" />,
      trend: { value: 15.3, isPositive: false },
      color: 'error' as const,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR],
      onClick: () => navigate('/dashboard/quality'),
    },
    {
      title: 'Total Employees',
      value: loading ? '...' : dashboardData?.employees?.totalEmployees?.toString() || '0',
      icon: <HiUsers className="w-6 h-6" />,
      trend: { value: 1.2, isPositive: true },
      color: 'primary' as const,
      roles: [UserRole.ADMIN, UserRole.MANAGER],
      onClick: () => navigate('/dashboard/employees'),
    },
    {
      title: 'Active Employees',
      value: loading ? '...' : dashboardData?.employees?.activeEmployees?.toString() || '0',
      icon: <HiCheckCircle className="w-6 h-6" />,
      trend: { value: 0.8, isPositive: true },
      color: 'success' as const,
      roles: [UserRole.ADMIN, UserRole.MANAGER],
      onClick: () => navigate('/dashboard/employees'),
    },
    {
      title: 'My Collections',
      value: '342 L',
      icon: <HiCheckCircle className="w-6 h-6" />,
      trend: { value: 4.2, isPositive: true },
      color: 'primary' as const,
      roles: [UserRole.OPERATOR],
      onClick: () => navigate('/dashboard/milk-collection'),
    },
    {
      title: 'Pending Tasks',
      value: '12',
      icon: <HiClock className="w-6 h-6" />,
      trend: { value: 2, isPositive: false },
      color: 'warning' as const,
      roles: [UserRole.OPERATOR, UserRole.MANAGER],
      onClick: () => navigate('/dashboard/notifications'),
    },
  ];

  // Filter stats based on user role
  const filteredStats = useMemo(() => {
    return allStats.filter(stat => stat.roles.includes(userRole));
  }, [userRole]);

  // Check if user can see financial data
  const canSeeFinancials = ([UserRole.ADMIN, UserRole.ACCOUNTANT] as UserRole[]).includes(userRole);
  
  // Check if user can see operational data
  const canSeeOperations = ([UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR] as UserRole[]).includes(userRole);
  
  // Check if user can export
  const canExport = ([UserRole.ADMIN, UserRole.MANAGER, UserRole.ACCOUNTANT] as UserRole[]).includes(userRole);

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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
      >
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2 truncate">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Welcome back! Here's what's happening with your cooperative today.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex-1 sm:flex-none"
          >
            <HiArrowPath
              className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${refreshing ? 'animate-spin' : ''}`}
            />
            <span className="text-xs sm:text-sm">Refresh</span>
          </Button>
          {canExport && (
            <Button variant="primary" size="sm" onClick={handleExport} className="flex-1 sm:flex-none">
              <HiArrowDownTray className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Export</span>
            </Button>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6"
      >
        {loading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card>
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : filteredStats.length > 0 ? (
          filteredStats.map((stat) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <StatsCard {...stat} />
            </motion.div>
          ))
        ) : (
          <motion.div variants={itemVariants} className="col-span-full">
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  Your account has limited access. Contact your administrator for more information.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Charts Grid - Only for users with operational access */}
      {canSeeOperations && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                    strokeWidth: 2,
                  },
                  {
                    dataKey: 'Evening',
                    name: 'Evening',
                    color: '#3b82f6',
                    strokeWidth: 2,
                  },
                ]}
                xAxisKey="date"
                height={250}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue Chart - Only for financial access */}
        {canSeeFinancials && (
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
                height={250}
              />
            </CardContent>
          </Card>
        </motion.div>
        )}
      </div>
      )}

      {/* Bottom Row - Widgets - Only operational data */}
      {canSeeOperations && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Quality Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Milk Quality Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                data={qualityDataChart}
                height={220}
                innerRadius={50}
                outerRadius={70}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="md:col-span-2 lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-sm sm:text-base">Recent Activities</CardTitle>
                <Badge variant="primary" className="text-xs">Live</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
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
                    className="flex items-start gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 sm:mt-2 flex-shrink-0 ${
                        activity.type === 'success'
                          ? 'bg-green-500'
                          : activity.type === 'error'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white truncate">
                        {activity.action}
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 truncate">
                        {activity.user} � {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      )}

      {/* Additional Widgets Row - Role-based */}
      {(canSeeOperations || canSeeFinancials) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Weather Widget - All authenticated users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <WeatherWidget />
          </motion.div>

          {/* Tasks Widget - Only for users with operational or managerial access */}
          {(userRole === UserRole.ADMIN || 
            userRole === UserRole.MANAGER || 
            userRole === UserRole.OPERATOR) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <TasksWidget />
            </motion.div>
          )}

          {/* Quick Actions Widget - Only for admins and managers */}
          {(userRole === UserRole.ADMIN || 
            userRole === UserRole.MANAGER) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <QuickActionsWidget />
            </motion.div>
          )}
        </div>
      )}

      {/* Upcoming Events - Only for users with operational or financial access */}
      {(canSeeOperations || canSeeFinancials) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          <UpcomingEventsWidget />
        </motion.div>
      )}
    </div>
  );
};

export default DashboardPage;
