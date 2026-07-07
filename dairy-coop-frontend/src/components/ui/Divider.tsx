import { type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  children?: ReactNode;
  className?: string;
}

const Divider = ({
  orientation = 'horizontal',
  children,
  className,
}: DividerProps) => {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn(
          'w-px bg-slate-200 dark:bg-slate-700',
          className
        )}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  if (children) {
    return (
      <div
        className={cn('flex items-center gap-3', className)}
        role="separator"
        aria-orientation="horizontal"
      >
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {children}
        </span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'h-px bg-slate-200 dark:bg-slate-700',
        className
      )}
      role="separator"
      aria-orientation="horizontal"
    />
  );
};

export default Divider;
