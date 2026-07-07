import { motion } from 'framer-motion';
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiExclamationTriangle,
  HiInformationCircle,
  HiXMark,
} from 'react-icons/hi2';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { cn } from '../../utils/cn';
import Badge from '../ui/Badge';

dayjs.extend(relativeTime);

export interface NotificationCardProps {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  createdAt: string;
  link?: string;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: () => void;
  className?: string;
}

const NotificationCard = ({
  id,
  title,
  message,
  type,
  isRead,
  createdAt,
  link,
  onMarkAsRead,
  onDelete,
  onClick,
  className,
}: NotificationCardProps) => {
  const typeConfig = {
    INFO: {
      icon: HiInformationCircle,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      badgeVariant: 'info' as const,
    },
    SUCCESS: {
      icon: HiCheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      badgeVariant: 'success' as const,
    },
    WARNING: {
      icon: HiExclamationTriangle,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      badgeVariant: 'warning' as const,
    },
    ERROR: {
      icon: HiExclamationCircle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      badgeVariant: 'error' as const,
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  const handleClick = () => {
    if (!isRead && onMarkAsRead) {
      onMarkAsRead(id);
    }
    onClick?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        'relative flex gap-3 p-4 rounded-lg border transition-colors',
        'hover:shadow-md',
        isRead
          ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
          : 'bg-primary-50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={handleClick}
    >
      {/* Unread indicator */}
      {!isRead && (
        <div className="absolute top-4 left-0 w-1 h-12 bg-primary-600 rounded-r" />
      )}

      {/* Icon */}
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
          config.bgColor
        )}
      >
        <Icon className={cn('w-5 h-5', config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </h4>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
            {dayjs(createdAt).fromNow()}
          </span>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
          {message}
        </p>

        <div className="flex items-center gap-2">
          <Badge variant={config.badgeVariant} size="sm">
            {type}
          </Badge>
          {link && (
            <a
              href={link}
              className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              View details
            </a>
          )}
        </div>
      </div>

      {/* Delete button */}
      {onDelete && (
        <button
          onClick={handleDelete}
          className={cn(
            'flex-shrink-0 p-1 rounded-md transition-colors',
            'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300',
            'hover:bg-slate-100 dark:hover:bg-slate-700',
            'focus:outline-none focus:ring-2 focus:ring-primary-500'
          )}
          aria-label="Delete notification"
        >
          <HiXMark className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};

export default NotificationCard;
