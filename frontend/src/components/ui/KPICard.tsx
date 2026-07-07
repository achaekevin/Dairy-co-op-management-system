import { type ReactNode } from 'react';
import { HiArrowTrendingUp, HiArrowTrendingDown } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: ReactNode;
  iconColor?: string;
  trend?: 'up' | 'down';
  description?: string;
  loading?: boolean;
  className?: string;
}

const KPICard = ({
  title,
  value,
  change,
  icon,
  iconColor = 'text-primary-600',
  trend,
  description,
  loading = false,
  className,
}: KPICardProps) => {
  const isPositiveTrend = trend === 'up';
  const isNegativeTrend = trend === 'down';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700',
        'p-6 hover:shadow-lg transition-shadow duration-200',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            {title}
          </p>
          {loading ? (
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
          ) : (
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {value}
            </p>
          )}
        </div>

        {icon && (
          <div
            className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center',
              'bg-slate-100 dark:bg-slate-700',
              iconColor
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {change !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium',
              isPositiveTrend && 'text-green-600 dark:text-green-400',
              isNegativeTrend && 'text-red-600 dark:text-red-400',
              !trend && 'text-slate-600 dark:text-slate-400'
            )}
          >
            {isPositiveTrend && <HiArrowTrendingUp className="w-4 h-4" />}
            {isNegativeTrend && <HiArrowTrendingDown className="w-4 h-4" />}
            <span>
              {change > 0 && '+'}
              {change}%
            </span>
          </div>
        )}

        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default KPICard;
