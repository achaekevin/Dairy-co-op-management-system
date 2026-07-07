import { useState, useRef, useEffect, type ReactNode } from 'react';
import { HiCheck, HiChevronDown, HiMagnifyingGlass } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface AutocompleteOption {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface AutocompleteProps {
  options: AutocompleteOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  error?: boolean;
  loading?: boolean;
  className?: string;
}

const Autocomplete = ({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  searchPlaceholder = 'Search...',
  disabled = false,
  error = false,
  loading = false,
  className,
}: AutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 text-left',
          'bg-white dark:bg-slate-800 border rounded-lg',
          'text-sm text-slate-900 dark:text-white',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          error
            ? 'border-red-500 dark:border-red-400'
            : 'border-slate-300 dark:border-slate-600',
          disabled
            ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900'
            : 'hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer'
        )}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {selectedOption?.icon && (
            <span className="flex-shrink-0">{selectedOption.icon}</span>
          )}
          <span
            className={cn(
              'truncate',
              !selectedOption && 'text-slate-500 dark:text-slate-400'
            )}
          >
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <HiChevronDown
          className={cn(
            'w-5 h-5 text-slate-400 transition-transform flex-shrink-0',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-2 border-b border-slate-200 dark:border-slate-700">
              <div className="relative">
                <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={cn(
                    'w-full pl-9 pr-3 py-2 text-sm',
                    'bg-slate-50 dark:bg-slate-900',
                    'border border-slate-200 dark:border-slate-700 rounded-md',
                    'text-slate-900 dark:text-white',
                    'placeholder:text-slate-500 dark:placeholder:text-slate-400',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                  )}
                />
              </div>
            </div>

            {/* Options */}
            <div className="max-h-60 overflow-y-auto scrollbar-thin">
              {loading ? (
                <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                  Loading...
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = option.value === value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      disabled={option.disabled}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 text-left',
                        'text-sm transition-colors',
                        'focus:outline-none',
                        isSelected &&
                          'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400',
                        !isSelected &&
                          !option.disabled &&
                          'hover:bg-slate-100 dark:hover:bg-slate-700',
                        option.disabled &&
                          'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {option.icon && (
                          <span className="flex-shrink-0">{option.icon}</span>
                        )}
                        <span className="truncate">{option.label}</span>
                      </div>
                      {isSelected && (
                        <HiCheck className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Autocomplete;
