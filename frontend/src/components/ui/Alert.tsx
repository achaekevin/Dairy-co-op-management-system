import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiExclamationTriangle,
  HiInformationCircle,
  HiXMark,
} from 'react-icons/hi2';
import { cn } from '../../utils/cn';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string | ReactNode;
  icon?: ReactNode;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
}

const Alert = ({
  variant = 'info',
  title,
  message,
  icon,
  closable = false,
  onClose,
  className,
}: AlertProps) => {
  const variantConfig = {
    info: {
      container:
        'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      icon: <HiInformationCircle className="w-5 h-5" />,
      iconColor: 'text-blue-600 dark:text-blue-400',
      titleColor: 'text-blue-900 dark:text-blue-200',
      messageColor: 'text-blue-800 dark:text-blue-300',
    },
    success: {
      container:
        'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      icon: <HiCheckCircle className="w-5 h-5" />,
      iconColor: 'text-green-600 dark:text-green-400',
      titleColor: 'text-green-900 dark:text-green-200',
      messageColor: 'text-green-800 dark:text-green-300',
    },
    warning: {
      container:
        'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
      icon: <HiExclamationTriangle className="w-5 h-5" />,
      iconColor: 'text-amber-600 dark:text-amber-400',
      titleColor: 'text-amber-900 dark:text-amber-200',
      messageColor: 'text-amber-800 dark:text-amber-300',
    },
    error: {
      container:
        'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      icon: <HiExclamationCircle className="w-5 h-5" />,
      iconColor: 'text-red-600 dark:text-red-400',
      titleColor: 'text-red-900 dark:text-red-200',
      messageColor: 'text-red-800 dark:text-red-300',
    },
  };

  const config = variantConfig[variant];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          'flex gap-3 p-4 rounded-lg border',
          config.container,
          className
        )}
        role="alert"
      >
        {/* Icon */}
        <div className={cn('flex-shrink-0', config.iconColor)}>
          {icon || config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={cn('text-sm font-medium mb-1', config.titleColor)}>
              {title}
            </h3>
          )}
          <div className={cn('text-sm', config.messageColor)}>{message}</div>
        </div>

        {/* Close button */}
        {closable && (
          <button
            onClick={onClose}
            className={cn(
              'flex-shrink-0 p-0.5 rounded-md transition-colors',
              'hover:bg-black/5 dark:hover:bg-white/10',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              config.iconColor
            )}
            aria-label="Close alert"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert;
