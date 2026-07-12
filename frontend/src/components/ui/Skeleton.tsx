import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

const Skeleton = ({
  className = '',
  variant = 'text',
  width,
  height,
  animate = true,
}: SkeletonProps) => {
  const baseClasses = 'bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1em' : undefined),
  };

  if (animate) {
    return (
      <motion.div
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        style={style}
        animate={{
          backgroundPosition: ['200% 0', '-200% 0'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height={16} />
            <Skeleton width="40%" height={12} />
          </div>
          <Skeleton width={80} height={32} variant="rectangular" />
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton width="60%" height={24} />
          <Skeleton width="40%" height={16} />
        </div>
        <Skeleton variant="circular" width={48} height={48} />
      </div>
      <Skeleton width="100%" height={100} variant="rectangular" />
      <div className="flex gap-3">
        <Skeleton width="30%" height={36} variant="rectangular" />
        <Skeleton width="30%" height={36} variant="rectangular" />
      </div>
    </div>
  );
};

export const StatCardSkeleton = () => {
  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton width="50%" height={16} />
        <Skeleton variant="circular" width={40} height={40} />
      </div>
      <Skeleton width="70%" height={32} />
      <Skeleton width="40%" height={14} />
    </div>
  );
};

export default Skeleton;
