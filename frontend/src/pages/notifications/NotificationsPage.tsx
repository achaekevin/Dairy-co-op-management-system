import { useState } from 'react';
import { HiCheckCircle, HiTrash, HiBell } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import NotificationCard from '../../components/common/NotificationCard';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import type { NotificationItem } from '../../types';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'New Milk Collection',
      message: 'Farmer John Doe submitted 25L morning collection',
      type: 'INFO',
      isRead: false,
      createdAt: new Date().toISOString(),
      link: '/milk-collection/123',
    },
    {
      id: '2',
      title: 'Payment Processed',
      message: 'Monthly payment of KSh 45,000 has been processed successfully',
      type: 'SUCCESS',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '3',
      title: 'Low Inventory Alert',
      message: 'Cattle feed stock is running low. Only 50kg remaining',
      type: 'WARNING',
      isRead: true,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      link: '/inventory',
    },
    {
      id: '4',
      title: 'Quality Test Failed',
      message: 'Milk sample from Farmer Jane failed quality standards',
      type: 'ERROR',
      isRead: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      link: '/quality/456',
    },
  ]);

  const [activeTab, setActiveTab] = useState('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead;
    if (activeTab === 'read') return n.isRead;
    return true;
  });

  const tabs = [
    {
      id: 'all',
      label: 'All',
      content: null,
    },
    {
      id: 'unread',
      label: (
        <div className="flex items-center gap-2">
          <span>Unread</span>
          {unreadCount > 0 && <Badge variant="primary">{unreadCount}</Badge>}
        </div>
      ),
      content: null,
    },
    {
      id: 'read',
      label: 'Read',
      content: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Stay updated with all your activities
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <HiCheckCircle className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            disabled={notifications.length === 0}
          >
            <HiTrash className="w-4 h-4 mr-2" />
            Clear all
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700"
        >
          <p className="text-sm text-slate-600 dark:text-slate-400">Total</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {notifications.length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700"
        >
          <p className="text-sm text-slate-600 dark:text-slate-400">Unread</p>
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">
            {unreadCount}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700"
        >
          <p className="text-sm text-slate-600 dark:text-slate-400">Read</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {notifications.length - unreadCount}
          </p>
        </motion.div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {filteredNotifications.length === 0 ? (
            <EmptyState
              icon={<HiBell className="w-16 h-16" />}
              title="No notifications"
              description={
                activeTab === 'unread'
                  ? "You're all caught up! No unread notifications."
                  : 'You have no notifications at this time.'
              }
            />
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  {...notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
