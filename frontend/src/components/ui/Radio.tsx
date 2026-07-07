import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, error, id, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <div className="relative flex items-center">
            <input
              ref={ref}
              type="radio"
              id={radioId}
              className={cn(
                'peer w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600',
                'text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all duration-200 cursor-pointer',
                'appearance-none checked:border-primary-600',
                'checked:before:content-[""] checked:before:block checked:before:w-2.5 checked:before:h-2.5',
                'checked:before:rounded-full checked:before:bg-primary-600',
                'checked:before:absolute checked:before:left-1/2 checked:before:top-1/2',
                'checked:before:-translate-x-1/2 checked:before:-translate-y-1/2',
                error && 'border-red-500',
                className
              )}
              {...props}
            />
          </div>
          {(label || description) && (
            <div className="flex-1">
              {label && (
                <label
                  htmlFor={radioId}
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

Radio.displayName = 'Radio';

export default Radio;
