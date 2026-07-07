import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { HiCheck } from 'react-icons/hi2';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <div className="relative flex items-center">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className={cn(
                'peer w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600',
                'text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all duration-200 cursor-pointer',
                'appearance-none checked:bg-primary-600 checked:border-primary-600',
                error && 'border-red-500',
                className
              )}
              {...props}
            />
            <HiCheck className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity left-0.5" />
          </div>
          {(label || description) && (
            <div className="flex-1">
              {label && (
                <label
                  htmlFor={checkboxId}
                  className="text-sm font-medium text-slate-900 dark:text-white cursor-pointer"
                >
                  {label}
                </label>
              )}
              {description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
