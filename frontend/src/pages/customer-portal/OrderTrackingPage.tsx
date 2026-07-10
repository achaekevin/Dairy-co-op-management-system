import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiCheckCircle,
  HiClock,
  HiTruck,
  HiArrowLeft,
  HiXCircle,
} from 'react-icons/hi2';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { customerPortalService } from '../../services/customerPortalService';
import toast from 'react-hot-toast';

interface OrderTracking {
  orderNumber: string;
  orderDate: string;
  status: string;
  paymentStatus: string;
  estimatedDelivery?: string;
  timeline: {
    status: string;
    date: string;
    description: string;
  }[];
}

const OrderTrackingPage = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      fetchTracking();
    }
  }, [orderNumber]);

  const fetchTracking = async () => {
    if (!orderNumber) return;

    setIsLoading(true);
    try {
      const response = await customerPortalService.trackOrder(orderNumber);
      if (response.success && response.data) {
        setTracking(response.data);
      }
    } catch (error) {
      toast.error('Failed to load tracking information');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return HiCheckCircle;
      case 'SHIPPED':
        return HiTruck;
      case 'CANCELLED':
        return HiXCircle;
      default:
        return HiClock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return 'text-green-600';
      case 'SHIPPED':
        return 'text-blue-600';
      case 'CANCELLED':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Loading tracking information...</p>
      </div>
    );
  }

  if (!tracking) {
    return (
      <Card className="p-12 text-center">
        <p className="text-slate-600 dark:text-slate-400 mb-4">Order not found</p>
        <Button
          variant="primary"
          onClick={() => navigate('/dashboard/customer-portal/orders')}
        >
          Back to Orders
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/customer-portal/orders')}
        >
          <HiArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Track Order
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Order #{tracking.orderNumber}
          </p>
        </div>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Order Date</p>
            <p className="font-semibold text-slate-900 dark:text-white">
              {new Date(tracking.orderDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Order Status</p>
            <Badge variant={tracking.status === 'DELIVERED' ? 'success' : 'info'}>
              {tracking.status}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Payment Status</p>
            <Badge variant={tracking.paymentStatus === 'PAID' ? 'success' : 'warning'}>
              {tracking.paymentStatus}
            </Badge>
          </div>
        </div>

        {tracking.estimatedDelivery && (
          <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <HiTruck className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
                  Estimated Delivery
                </p>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  {new Date(tracking.estimatedDelivery).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
          Order Timeline
        </h2>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
          <div className="space-y-6">
            {tracking.timeline.map((event, index) => {
              const Icon = getStatusIcon(event.status);
              const colorClass = getStatusColor(event.status);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4"
                >
                  <div className={`relative z-10 w-12 h-12 rounded-full bg-white dark:bg-slate-800 border-2 flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {event.status}
                      </h3>
                      <span className="text-sm text-slate-500">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/customer-portal/orders')}
          className="flex-1"
        >
          Back to Orders
        </Button>
        <Button
          variant="primary"
          onClick={() => navigate(`/dashboard/customer-portal/invoices/${tracking.orderNumber}`)}
          className="flex-1"
        >
          View Invoice
        </Button>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
