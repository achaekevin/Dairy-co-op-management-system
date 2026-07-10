import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiShoppingBag,
  HiClock,
  HiCurrencyDollar,
  HiStar,
  HiArrowRight,
} from 'react-icons/hi2';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { customerPortalService, type DashboardStats } from '../../services/customerPortalService';
import toast from 'react-hot-toast';

const CustomerDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalSpending: 0,
    loyaltyPoints: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const response = await customerPortalService.getDashboard();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = [
    {
      label: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: HiShoppingBag,
      color: 'blue',
      change: '+12%',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders.toString(),
      icon: HiClock,
      color: 'yellow',
    },
    {
      label: 'Total Spending',
      value: `KSh ${stats.totalSpending.toLocaleString()}`,
      icon: HiCurrencyDollar,
      color: 'green',
    },
    {
      label: 'Loyalty Points',
      value: stats.loyaltyPoints.toString(),
      icon: HiStar,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Customer Portal
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Welcome back! Browse products and manage your orders
        </p>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                    {stat.change && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">{stat.change}</p>
                    )}
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20 flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Browse Products
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Explore our dairy products and add them to your cart
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/dashboard/customer-portal/products')}
          >
            View Products
            <HiArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Order History
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Track your orders and view past purchases
          </p>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/customer-portal/orders')}
          >
            View Orders
            <HiArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
