import { HiExclamationTriangle } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import Button from './Button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) => {
  const variantConfig = {
    danger: {
      iconColor: 'text-red-600 dark:text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-900/20',
      buttonVariant: 'danger' as const,
    },
    warning: {
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/20',
      buttonVariant: 'danger' as const,
    },
    info: {
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/20',
      buttonVariant: 'primary' as const,
    },
  };

  const config = variantConfig[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={cn(
                'w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-xl',
                'border border-slate-200 dark:border-slate-700'
              )}
              role="dialog"
              aria-modal="true"
            >
              <div className="p-6">
                {/* Icon */}
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
                      config.iconBg
                    )}
                  >
                    <HiExclamationTriangle
                      className={cn('w-6 h-6', config.iconColor)}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 mt-6">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    disabled={loading}
                  >
                    {cancelText}
                  </Button>
                  <Button
                    onClick={onConfirm}
                    variant={config.buttonVariant}
                    isLoading={loading}
                  >
                    {confirmText}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
