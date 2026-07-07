import { useState, useRef, useEffect } from 'react';
import { HiCalendar, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs, { Dayjs } from 'dayjs';
import { cn } from '../../utils/cn';

export interface DatePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

const DatePicker = ({
  value,
  onChange,
  placeholder = 'Select date',
  format = 'DD/MM/YYYY',
  minDate,
  maxDate,
  disabled = false,
  error = false,
  className,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(
    value ? dayjs(value) : dayjs()
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? dayjs(value) : null;

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

  const getDaysInMonth = () => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const daysInMonth = endOfMonth.date();
    const startDay = startOfMonth.day();

    const days: (Dayjs | null)[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(currentMonth.date(i));
    }

    return days;
  };

  const handleDateSelect = (date: Dayjs) => {
    onChange(date.toDate());
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  const isDateDisabled = (date: Dayjs) => {
    if (minDate && date.isBefore(dayjs(minDate), 'day')) return true;
    if (maxDate && date.isAfter(dayjs(maxDate), 'day')) return true;
    return false;
  };

  const days = getDaysInMonth();
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Input */}
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
        <span className={cn(!value && 'text-slate-500 dark:text-slate-400')}>
          {value ? dayjs(value).format(format) : placeholder}
        </span>
        <HiCalendar className="w-5 h-5 text-slate-400" />
      </button>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg"
          >
            {/* Month/Year Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
              >
                <HiChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-sm font-medium">
                {currentMonth.format('MMMM YYYY')}
              </span>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
              >
                <HiChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Week days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="p-2" />;
                }

                const isSelected =
                  selectedDate && day.isSame(selectedDate, 'day');
                const isToday = day.isSame(dayjs(), 'day');
                const isDisabled = isDateDisabled(day);

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => !isDisabled && handleDateSelect(day)}
                    disabled={isDisabled}
                    className={cn(
                      'p-2 text-sm rounded-md transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500',
                      isSelected &&
                        'bg-primary-600 text-white font-medium hover:bg-primary-700',
                      !isSelected &&
                        isToday &&
                        'border-2 border-primary-600 text-primary-600 font-medium',
                      !isSelected &&
                        !isToday &&
                        !isDisabled &&
                        'hover:bg-slate-100 dark:hover:bg-slate-700',
                      isDisabled &&
                        'opacity-30 cursor-not-allowed hover:bg-transparent'
                    )}
                  >
                    {day.date()}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatePicker;
