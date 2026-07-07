import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import Spinner from './Spinner';

export interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  blur?: boolean;
  className?: string;
}

const LoadingOverlay = ({
  isLoading,
  message = 'Loading...',
  blur = true,
  className,
}: LoadingOverlayProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center',
            'bg-slate-900/50',
            blur && 'backdrop-blur-sm',
            className
          )}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl flex flex-col items-center gap-4"
          >
            <Spinner size="lg" />
            {message && (
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {message}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
