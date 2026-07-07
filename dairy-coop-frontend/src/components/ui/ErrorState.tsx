import { type ReactNode } from 'react';
import { HiExclamationTriangle } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import Button from './Button';

export interface ErrorStateProps {
  icon?: ReactNode;
  title?: string;
  message: string;
  error?: Error;
  showDetails?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const ErrorState = ({
  icon,
  title = 'Something went wrong',
  message,
  error,
  showDetails = false,
  action,
  secondaryAction,
  className,
}: ErrorStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center',
        className
      )}
    >
      {/* Icon */}
      <div className="mb-4 text-red-500 dark:text-red-400">
        {icon || <HiExclamationTriangle className="w-16 h-16" />}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Message */}
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 max-w-md">
        {message}
      </p>

      {/* Error Details */}
      {showDetails && error && (
        <details className="mb-6 w-full max-w-md">
          <summary className="text-xs text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200">
            Show error details
          </summary>
          <pre className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-left overflow-x-auto">
            {error.stack || error.message}
          </pre>
        </details>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button onClick={action.onClick} variant="primary">
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button onClick={secondaryAction.onClick} variant="outline">
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ErrorState;
