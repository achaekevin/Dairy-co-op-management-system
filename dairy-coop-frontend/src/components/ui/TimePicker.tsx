import { useState, useRef, useEffect } from 'react';
import { HiClock } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface TimePickerProps {
  value?: string;
  onChange: (time: string) => void;
  placeholder?: string;
  format?: '12' | '24';
  step?: number;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

const TimePicker = ({
  value = '',
  onChange,
  placeholder = 'Select time',
  format = '12',
  step = 1,
  disabled = false,
  error = false,
  className,
}: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState('12');
  const [minutes, setMinutes] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const containerRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const [time, periodPart] = value.split(' ');
      const [h, m] = time.split(':');
      setHours(h);
      setMinutes(m);
      if (format === '12' && periodPart) {
        setPeriod(periodPart as 'AM' | 'PM');
      }
    }
  }, [value, format]);

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

  const generateHours = () => {
    const maxHours = format === '12' ? 12 : 23;
    const startHour = format === '12' ? 1 : 0;
    return Array.from({ length: maxHours + (format === '24' ? 1 : 0) }, (_, i) =>
      String(i + startHour).padStart(2, '0')
    );
  };

  const generateMinutes = () => {
    return Array.from({ length: Math.floor(60 / step) }, (_, i) =>
      String(i * step).padStart(2, '0')
    );
  };

  const handleTimeChange = (newHours: string, newMinutes: string, newPeriod: 'AM' | 'PM') => {
    setHours(newHours);
    setMinutes(newMinutes);
    setPeriod(newPeriod);

    const timeString =
      format === '12'
        ? `${newHours}:${newMinutes} ${newPeriod}`
        : `${newHours}:${newMinutes}`;
    onChange(timeString);
  };

  const scrollToSelected = (ref: React.RefObject<HTMLDivElement | null>, value: string) => {
    if (ref.current) {
      const selected = ref.current.querySelector(`[data-value="${value}"]`);
      if (selected) {
        selected.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToSelected(hoursRef, hours);
      scrollToSelected(minutesRef, minutes);
    }
  }, [isOpen, hours, minutes]);

  const displayValue =
    value ||
    (format === '12'
      ? `${hours}:${minutes} ${period}`
      : `${hours}:${minutes}`);

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
          {value ? displayValue : placeholder}
        </span>
        <HiClock className="w-5 h-5 text-slate-400" />
      </button>

      {/* Time Picker Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg"
          >
            <div className="flex gap-2">
              {/* Hours */}
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 text-center">
                  Hours
                </span>
                <div
                  ref={hoursRef}
                  className="h-40 w-16 overflow-y-auto scrollbar-thin"
                >
                  {generateHours().map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      data-value={hour}
                      onClick={() => handleTimeChange(hour, minutes, period)}
                      className={cn(
                        'w-full px-3 py-1.5 text-sm text-center rounded-md transition-colors',
                        'hover:bg-slate-100 dark:hover:bg-slate-700',
                        hour === hours &&
                          'bg-primary-600 text-white hover:bg-primary-700'
                      )}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>

              {/* Separator */}
              <div className="flex items-center justify-center pt-6">
                <span className="text-lg font-bold text-slate-600 dark:text-slate-400">
                  :
                </span>
              </div>

              {/* Minutes */}
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 text-center">
                  Minutes
                </span>
                <div
                  ref={minutesRef}
                  className="h-40 w-16 overflow-y-auto scrollbar-thin"
                >
                  {generateMinutes().map((minute) => (
                    <button
                      key={minute}
                      type="button"
                      data-value={minute}
                      onClick={() => handleTimeChange(hours, minute, period)}
                      className={cn(
                        'w-full px-3 py-1.5 text-sm text-center rounded-md transition-colors',
                        'hover:bg-slate-100 dark:hover:bg-slate-700',
                        minute === minutes &&
                          'bg-primary-600 text-white hover:bg-primary-700'
                      )}
                    >
                      {minute}
                    </button>
                  ))}
                </div>
              </div>

              {/* AM/PM */}
              {format === '12' && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 text-center">
                    Period
                  </span>
                  <div className="h-40 w-16 flex flex-col justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTimeChange(hours, minutes, 'AM')}
                      className={cn(
                        'px-3 py-1.5 text-sm text-center rounded-md transition-colors',
                        'hover:bg-slate-100 dark:hover:bg-slate-700',
                        period === 'AM' &&
                          'bg-primary-600 text-white hover:bg-primary-700'
                      )}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTimeChange(hours, minutes, 'PM')}
                      className={cn(
                        'px-3 py-1.5 text-sm text-center rounded-md transition-colors',
                        'hover:bg-slate-100 dark:hover:bg-slate-700',
                        period === 'PM' &&
                          'bg-primary-600 text-white hover:bg-primary-700'
                      )}
                    >
                      PM
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimePicker;
