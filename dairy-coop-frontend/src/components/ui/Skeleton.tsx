import { cn } from '../../utils/cn';

export interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular' | 'card' | 'table';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

const Skeleton = ({
  variant = 'text',
  width,
  height,
  count = 1,
  className,
}: SkeletonProps) => {
  const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-700';

  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    card: 'h-64 rounded-lg',
    table: 'h-12 rounded',
  };

  const skeletonElement = (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={{
        width: width || (variant === 'circular' ? height : '100%'),
        height: height || undefined,
      }}
    />
  );

  if (count === 1) {
    return skeletonElement;
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="mb-2 last:mb-0">
          {skeletonElement}
        </div>
      ))}
    </>
  );
};

export default Skeleton;

// Preset skeleton loaders
export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn('p-4 border border-slate-200 dark:border-slate-700 rounded-lg', className)}>
    <Skeleton variant="rectangular" height={192} className="mb-4" />
    <Skeleton variant="text" className="mb-2" />
    <Skeleton variant="text" width="60%" />
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) => (
  <div className="space-y-2">
    {/* Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={`header-${i}`} variant="text" height={20} />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={`cell-${rowIndex}-${colIndex}`} variant="text" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonList = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
    ))}
  </div>
);
