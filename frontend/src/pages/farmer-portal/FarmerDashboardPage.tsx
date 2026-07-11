import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import {
  HiBeaker,
  HiCurrencyRupee,
  HiBanknotes,
  HiChartBar,
  HiBell,
  HiArrowPath,
  HiDocumentText,
  HiUser,
  HiCalendar,
  HiCreditCard,
} from 'react-icons/hi2';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface DashboardStats {
  todaysMilkDelivery: number;
  monthlyMilkDelivered: number;
  currentBalance: number;
  activeLoans: number;
  sharesOwned: number;
  unreadNotifications: number;
}

interface RecentActivity {
  id: string;
  type: string;
  message: string;
  date: string;
  amount?: number;
}

const FarmerDashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/farmer-portal/dashboard');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
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

  const statsCards = [
    {
      title: "Today's Milk Delivery",
      value: `${stats?.todaysMilkDelivery || 0} L`,
      icon: HiBeaker,
      color: 'primary',
      onClick: () => navigate('/farmer-portal/deliveries'),
    },
    {
      title: 'Monthly Total',
      value: `${stats?.monthlyMilkDelivered || 0} L`,
      icon: HiChartBar,
      color: 'secondary',
      onClick: () => navigate('/farmer-portal/deliveries'),
    },
    {
      title: 'Current Balance',
      value: `KSh ${(stats?.currentBalance || 0).toLocaleString()}`,
      icon: HiCurrencyRupee,
      color: 'success',
      onClick: () => navigate('/farmer-portal/payments'),
    },
    {
      title: 'Active Loans',
      value: stats?.activeLoans || 0,
      icon: HiBanknotes,
      color: 'warning',
      onClick: () => navigate('/farmer-portal/loans'),
    },
    {
      title: 'Shares Owned',
      value: stats?.sharesOwned || 0,
      icon: HiCreditCard,
      color: 'info',
      onClick: () => navigate('/farmer-portal/shares'),
    },
    {
      title: 'Notifications',
      value: stats?.unreadNotifications || 0,
      icon: HiBell,
      color: 'error',
      onClick: () => navigate('/farmer-portal/notifications'),
    },
  ];

  const quickActions = [
    {
      label: 'View Deliveries',
      icon: HiBeaker,
      color: 'primary',
      onClick: () => navigate('/farmer-portal/deliveries'),
    },
    {
      label: 'Payment History',
      icon: HiCurrencyRupee,
      color: 'success',
      onClick: () => navigate('/farmer-portal/payments'),
    },
    {
      label: 'Apply for Loan',
      icon: HiBanknotes,
      color: 'warning',
      onClick: () => navigate('/farmer-portal/loans/apply'),
    },
    {
      label: 'My Livestock',
      icon: HiDocumentText,
      color: 'secondary',
      onClick: () => navigate('/farmer-portal/animals'),
    },
    {
      label: 'Book Vet Visit',
      icon: HiCalendar,
      color: 'info',
      onClick: () => navigate('/veterinary/book-service'),
    },
    {
      label: 'Update Profile',
      icon: HiUser,
      color: 'error',
      onClick: () => navigate('/farmer-portal/profile'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Farmer Portal</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Welcome back! Here's your farm overview
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <HiArrowPath className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <div className="animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200"
                  onClick={stat.onClick}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {stat.title}
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`rounded-full p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    onClick={action.onClick}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className={`rounded-full p-3 bg-${action.color}-100 dark:bg-${action.color}-900/20 group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className={`w-6 h-6 text-${action.color}-600 dark:text-${action.color}-400`} />
                    </div>
                    <span className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-300 text-center">
                      {action.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Morning Shift</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Today, 6:30 AM</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">25 L</p>
                      <Badge variant="success">Accepted</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Evening Shift</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Yesterday, 6:00 PM</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">22 L</p>
                      <Badge variant="success">Accepted</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/farmer-portal/deliveries')}>
                    View All Deliveries
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <HiCalendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Vaccination Due</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cow #A234 - In 3 days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <HiCurrencyRupee className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Payment Due</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">December Payment - In 5 days</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/farmer-portal/notifications')}>
                    View All Events
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default FarmerDashboardPage;
