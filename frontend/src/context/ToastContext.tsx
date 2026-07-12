import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';

interface ToastContextValue {
  success: (options: { title: string; message?: string; duration?: number }) => void;
  error: (options: { title: string; message?: string; duration?: number }) => void;
  warning: (options: { title: string; message?: string; duration?: number }) => void;
  info: (options: { title: string; message?: string; duration?: number }) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const { toasts, success, error, warning, info, clearAll } = useToast();

  return (
    <ToastContext.Provider value={{ success, error, warning, info, clearAll }}>
      {children}
      <ToastContainer toasts={toasts} position="top-right" />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
};
