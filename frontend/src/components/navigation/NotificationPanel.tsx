import { motion, AnimatePresence } from 'framer-motion';
import { HiBell, HiCheck, HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiXMark } from 'react-icons/hi2';
import { formatRelativeTime } from '../../utils/format';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  // Mock notifications
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'New Milk Collection',
      message: 'Ramesh Kumar submitted morning collection of 50 liters',
      type: 'success',
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
      link: '/dashboard/milk-collection',
    },
    {
      id: '2',
      title: 'Payment Approved',
      message: 'Monthly payment of KSh 45,000 has been approved for processing',
      type: 'success',
      isRead: false,
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
      link: '/dashboard/payments',
    },
    {
      id: '3',
      title: 'Low Stock Alert',
      message: 'Cattle feed inventory is running low. Current stock: 50kg',
      type: 'warning',
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
      link: '/dashboard/inventory/feed-store',
    },
    {
      id: '4',
      title: 'Quality Test Failed',
      message: 'Milk sample from Suresh Patel failed quality standards',
      type: 'error',
      isRead: true,
      createdAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
      link: '/dashboard/quality',
    },
    {
      id: '5',
      title: 'New Farmer Registered',
      message: 'Dinesh Yadav has been successfully registered',
      type: 'info',
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
      link: '/dashboard/farmers',
    },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <HiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <HiExclamationCircle className="w-5 h-5 text-amber-500" />;
      case 'error':
        return <HiExclamationCircle className="w-5 h-5 text-red-500" />;
      default:
        return <HiInformationCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const markAllAsRead = () => {
    // Mock function
    console.log('Mark all as read');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-white dark:bg-slate-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <HiBell className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Notifications
                  </h2>
                  {unreadCount > 0 && (
                    <span className="bg-primary-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center gap-1"
                >
                  <HiCheck className="w-4 h-4" />
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <HiBell className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    No notifications
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${
                        !notification.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">{getIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            {notification.message}
                          </p>
                          <span className="text-xs text-slate-500 dark:text-slate-500">
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
