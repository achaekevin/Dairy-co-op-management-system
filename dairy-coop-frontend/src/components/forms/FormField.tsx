import { type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}

const FormField = ({
  label,
  error,
  helperText,
  required,
  children,
  htmlFor,
  className,
}: FormFieldProps) => {
  return (
    <div className={cn('w-full', className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input/Component */}
      {children}

      {/* Helper Text or Error */}
      {(error || helperText) && (
        <p
          className={cn(
            'mt-1.5 text-sm',
            error
              ? 'text-red-600 dark:text-red-400'
              : 'text-slate-500 dark:text-slate-400'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default FormField;
