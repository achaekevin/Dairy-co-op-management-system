import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCheck, HiChevronDown, HiXMark } from 'react-icons/hi2';
import { cn } from '../../utils/cn';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  maxDisplay?: number;
}

const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  label,
  error,
  disabled = false,
  className,
  maxDisplay = 2,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = options.filter((option) => value.includes(option.value));

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeOption = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}

      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'min-h-[44px] w-full px-4 py-2 rounded-xl border-2 transition-all duration-200 cursor-pointer',
          'bg-white dark:bg-slate-800',
          disabled
            ? 'bg-slate-100 dark:bg-slate-700 cursor-not-allowed opacity-50'
            : 'hover:border-primary-400 dark:hover:border-primary-500',
          error
            ? 'border-red-500 focus:ring-red-500'
            : isOpen
            ? 'border-primary-500 ring-2 ring-primary-500/20'
            : 'border-slate-200 dark:border-slate-600'
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
            {selectedOptions.length === 0 ? (
              <span className="text-slate-500 dark:text-slate-400 text-sm">
                {placeholder}
              </span>
            ) : (
              <>
                {selectedOptions.slice(0, maxDisplay).map((option) => (
                  <span
                    key={option.value}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium"
                  >
                    {option.label}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOption(option.value);
                      }}
                      className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded p-0.5 transition-colors"
                    >
                      <HiXMark className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selectedOptions.length > maxDisplay && (
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-medium">
                    +{selectedOptions.length - maxDisplay} more
                  </span>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {selectedOptions.length > 0 && !disabled && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearAll();
                }}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
              >
                <HiXMark className="w-4 h-4 text-slate-500" />
              </button>
            )}
            <HiChevronDown
              className={cn(
                'w-5 h-5 text-slate-500 transition-transform',
                isOpen && 'transform rotate-180'
              )}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="p-2 border-b border-slate-200 dark:border-slate-700">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="max-h-60 overflow-y-auto p-2">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400 text-center">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!option.disabled) {
                          toggleOption(option.value);
                        }
                      }}
                      disabled={option.disabled}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                        option.disabled
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700',
                        isSelected &&
                          'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      )}
                    >
                      <span className="font-medium">{option.label}</span>
                      {isSelected && <HiCheck className="w-5 h-5 text-primary-600 dark:text-primary-400" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>}
    </div>
  );
};

export default MultiSelect;
