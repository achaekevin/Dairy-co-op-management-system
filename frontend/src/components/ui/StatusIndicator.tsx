import { cn } from '../../utils/cn';

export interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'away' | 'busy' | 'active' | 'inactive';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  pulse?: boolean;
  className?: string;
}

const StatusIndicator = ({
  status,
  size = 'md',
  showLabel = false,
  label,
  pulse = false,
  className,
}: StatusIndicatorProps) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const statusConfig = {
    online: {
      color: 'bg-green-500',
      label: 'Online',
    },
    offline: {
      color: 'bg-slate-400',
      label: 'Offline',
    },
    away: {
      color: 'bg-amber-500',
      label: 'Away',
    },
    busy: {
      color: 'bg-red-500',
      label: 'Busy',
    },
    active: {
      color: 'bg-green-500',
      label: 'Active',
    },
    inactive: {
      color: 'bg-slate-400',
      label: 'Inactive',
    },
  };

  const config = statusConfig[status];
  const displayLabel = label || config.label;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <span
          className={cn(
            'block rounded-full',
            sizeClasses[size],
            config.color
          )}
        />
        {pulse && (
          <span
            className={cn(
              'absolute inset-0 rounded-full animate-ping',
              sizeClasses[size],
              config.color
            )}
          />
        )}
      </div>
      {showLabel && (
        <span className="text-sm text-slate-600 dark:text-slate-300">
          {displayLabel}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;
