import { useState, useRef, useEffect, type ReactNode } from 'react';
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  category?: string;
  onClick?: () => void;
}

export interface SearchBoxProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  results?: SearchResult[];
  loading?: boolean;
  showResults?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SearchBox = ({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search...',
  results = [],
  loading = false,
  showResults = false,
  size = 'md',
  className,
}: SearchBoxProps) => {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange?.(newValue);
    setIsOpen(true);
  };

  const handleSearch = () => {
    onSearch?.(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery('');
    onChange?.('');
    inputRef.current?.focus();
  };

  const handleResultClick = (result: SearchResult) => {
    result.onClick?.();
    setIsOpen(false);
  };

  const sizeClasses = {
    sm: 'text-sm py-1.5 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-3 px-5',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const groupedResults = results.reduce((acc, result) => {
    const category = result.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Search Input */}
      <div className="relative">
        <HiMagnifyingGlass
          className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 text-slate-400',
            iconSizes[size]
          )}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-10 rounded-lg',
            'bg-white dark:bg-slate-800',
            'border border-slate-300 dark:border-slate-600',
            'text-slate-900 dark:text-white',
            'placeholder:text-slate-500 dark:placeholder:text-slate-400',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            sizeClasses[size]
          )}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <HiXMark className={iconSizes[size]} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && showResults && query.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              {loading ? (
                <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                  Searching...
                </div>
              ) : results.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                  No results found
                </div>
              ) : (
                Object.entries(groupedResults).map(([category, categoryResults]) => (
                  <div key={category}>
                    <div className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900">
                      {category}
                    </div>
                    {categoryResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => handleResultClick(result)}
                        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        {result.icon && (
                          <div className="flex-shrink-0 text-slate-500 dark:text-slate-400">
                            {result.icon}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {result.title}
                          </p>
                          {result.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {result.description}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBox;
