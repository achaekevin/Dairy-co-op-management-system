import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  thickness?: number;
  className?: string;
}

const CircularProgress = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = true,
  thickness = 8,
  className,
}: CircularProgressProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeMap = {
    sm: 60,
    md: 80,
    lg: 120,
    xl: 160,
  };

  const dimension = sizeMap[size];
  const radius = (dimension - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const variantColors = {
    primary: 'stroke-primary-600',
    secondary: 'stroke-secondary-600',
    success: 'stroke-green-600',
    warning: 'stroke-amber-600',
    error: 'stroke-red-600',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  return (
    <div className={cn('relative inline-flex', className)}>
      <svg
        width={dimension}
        height={dimension}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={thickness}
          className="text-slate-200 dark:text-slate-700"
        />

        {/* Progress circle */}
        <motion.circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          className={variantColors[variant]}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>

      {/* Label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              'font-semibold text-slate-900 dark:text-white',
              textSizes[size]
            )}
          >
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
