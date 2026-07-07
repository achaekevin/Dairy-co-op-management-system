import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import Card from '../ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  trend,
  color = 'primary',
  className,
}: StatsCardProps) => {
  const colors = {
    primary: 'from-primary-500 to-primary-700',
    secondary: 'from-secondary-500 to-secondary-700',
    success: 'from-green-500 to-green-700',
    warning: 'from-amber-500 to-amber-700',
    error: 'from-red-500 to-red-700',
    info: 'from-blue-500 to-blue-700',
  };

  return (
    <Card hover className={cn('p-6', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            {title}
          </p>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-slate-900 dark:text-white mb-2"
          >
            {value}
          </motion.h3>
          {trend && (
            <div className="flex items-center gap-1">
              <motion.svg
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  'w-4 h-4',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {trend.isPositive ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                )}
              </motion.svg>
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                vs last month
              </span>
            </div>
          )}
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className={cn(
            'w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shadow-lg',
            colors[color]
          )}
        >
          {icon}
        </motion.div>
      </div>
    </Card>
  );
};

export default StatsCard;
