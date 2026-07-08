import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowDownTray, HiChevronDown } from 'react-icons/hi2';
import { exportToCSV, exportToExcel, exportToPDF, ExportFormat } from '../../utils/export';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

export interface ExportMenuProps {
  data: any[];
  filename: string;
  title?: string;
  columns?: { header: string; dataKey: string }[];
  className?: string;
  buttonSize?: 'sm' | 'md' | 'lg';
}

const ExportMenu = ({
  data,
  filename,
  title,
  columns,
  className,
  buttonSize = 'sm',
}: ExportMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (format: ExportFormat) => {
    try {
      if (data.length === 0) {
        toast.error('No data to export');
        return;
      }

      const timestamp = new Date().toISOString().split('T')[0];
      const fullFilename = `${filename}_${timestamp}`;

      switch (format) {
        case 'csv':
          exportToCSV(data, fullFilename);
          break;
        case 'excel':
          exportToExcel(data, fullFilename);
          break;
        case 'pdf':
          exportToPDF(data, fullFilename, title || filename, columns);
          break;
      }

      toast.success(`Exported as ${format.toUpperCase()}`);
      setIsOpen(false);
    } catch (error) {
      toast.error('Export failed');
      console.error('Export error:', error);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
  };

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
          'border border-slate-300 dark:border-slate-600',
          'bg-white dark:bg-slate-800',
          'text-slate-700 dark:text-slate-300',
          'hover:bg-slate-50 dark:hover:bg-slate-700',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'transition-colors duration-200',
          sizeClasses[buttonSize]
        )}
      >
        <HiArrowDownTray className="w-4 h-4" />
        <span>Export</span>
        <HiChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-20 overflow-hidden"
            >
              <div className="py-1">
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L13 1.586A2 2 0 0011.586 1H9z" />
                    <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  </svg>
                  <span>Export as Excel</span>
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L13 1.586A2 2 0 0011.586 1H9z" />
                  </svg>
                  <span>Export as CSV</span>
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  <span>Export as PDF</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportMenu;
