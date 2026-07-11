import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import {
  HiBell,
  HiCheckCircle,
  HiCurrencyRupee,
  HiBanknotes,
  HiCalendar,
  HiInformationCircle,
  HiArrowPath,
} from 'react-icons/hi2';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'PAYMENT' | 'LOAN' | 'MEETING' | 'VACCINATION' | 'GENERAL';
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionUrl?: string;
}

const FarmerNotificationsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/farmer-portal/notifications');
      if (response.data.success) {
        setNotifications(response.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await api.patch(`/farmer-portal/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/farmer-portal/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'PAYMENT':
        return HiCurrencyRupee;
      case 'LOAN':
        return HiBanknotes;
      case 'MEETING':
      case 'VACCINATION':
        return HiCalendar;
      default:
        return HiInformationCircle;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'PAYMENT':
        return 'success';
      case 'LOAN':
        return 'warning';
      case 'MEETING':
        return 'info';
      case 'VACCINATION':
        return 'error';
      default:
        return 'secondary';
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesType = filterType === 'ALL' || notification.type === filterType;
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'READ' && notification.read) ||
      (filterStatus === 'UNREAD' && !notification.read);
    return matchesType && matchesStatus;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Stay updated with important information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchNotifications}>
            <HiArrowPath className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          {unreadCount > 0 && (
            <Button variant="primary" size="sm" onClick={handleMarkAllAsRead}>
              <HiCheckCircle className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {notifications.length}
              </p>
            </div>
            <div className="rounded-full p-3 bg-primary-100 dark:bg-primary-900/20">
              <HiBell className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Unread</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{unreadCount}</p>
            </div>
            <div className="rounded-full p-3 bg-error-100 dark:bg-error-900/20">
              <HiBell className="w-6 h-6 text-error-600 dark:text-error-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Read</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {notifications.length - unreadCount}
              </p>
            </div>
            <div className="rounded-full p-3 bg-success-100 dark:bg-success-900/20">
              <HiCheckCircle className="w-6 h-6 text-success-600 dark:text-success-400" />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Types' },
                { value: 'PAYMENT', label: 'Payment' },
                { value: 'LOAN', label: 'Loan' },
                { value: 'MEETING', label: 'Meeting' },
                { value: 'VACCINATION', label: 'Vaccination' },
                { value: 'GENERAL', label: 'General' },
              ]}
            />
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Status' },
                { value: 'UNREAD', label: 'Unread' },
                { value: 'READ', label: 'Read' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Notifications ({filteredNotifications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notification, index) => {
                const Icon = getNotificationIcon(notification.type);
                const color = getNotificationColor(notification.type);

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                      notification.read
                        ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`rounded-full p-3 bg-${color}-100 dark:bg-${color}-900/20 flex-shrink-0`}>
                        <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant={color} size="sm">
                              {notification.type}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          {new Date(notification.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <HiBell className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">No notifications found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerNotificationsPage;
