import { useState, useCallback } from 'react';
import type { ToastProps, ToastType } from '../components/ui/Toast';

interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
  type?: ToastType;
}

interface Toast extends Omit<ToastProps, 'onClose'> {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, options: ToastOptions) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const duration = options.duration ?? 5000;

      const newToast: Toast = {
        id,
        type,
        title: options.title,
        message: options.message,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (options: ToastOptions) => addToast('success', options),
    [addToast]
  );

  const error = useCallback(
    (options: ToastOptions) => addToast('error', options),
    [addToast]
  );

  const warning = useCallback(
    (options: ToastOptions) => addToast('warning', options),
    [addToast]
  );

  const info = useCallback(
    (options: ToastOptions) => addToast('info', options),
    [addToast]
  );

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts: toasts.map((toast) => ({
      ...toast,
      onClose: removeToast,
    })),
    success,
    error,
    warning,
    info,
    clearAll,
    removeToast,
  };
};
