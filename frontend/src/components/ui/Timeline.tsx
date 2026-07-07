import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { HiCheck } from 'react-icons/hi2';
import { cn } from '../../utils/cn';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  time?: string;
  icon?: ReactNode;
  status?: 'completed' | 'current' | 'pending';
  content?: ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

const Timeline = ({
  items,
  orientation = 'vertical',
  className,
}: TimelineProps) => {
  if (orientation === 'horizontal') {
    return (
      <div className={cn('flex items-start gap-4 overflow-x-auto', className)}>
        {items.map((item, index) => {
          const isCompleted = item.status === 'completed';
          const isCurrent = item.status === 'current';

          return (
            <div key={item.id} className="flex items-center min-w-[200px]">
              <div className="flex flex-col items-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2',
                    isCompleted
                      ? 'bg-primary-600 border-primary-600'
                      : isCurrent
                      ? 'bg-white dark:bg-slate-800 border-primary-600'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                  )}
                >
                  {isCompleted ? (
                    <HiCheck className="w-5 h-5 text-white" />
                  ) : item.icon ? (
                    <span
                      className={cn(
                        isCurrent
                          ? 'text-primary-600'
                          : 'text-slate-400 dark:text-slate-500'
                      )}
                    >
                      {item.icon}
                    </span>
                  ) : (
                    <span
                      className={cn(
                        'w-3 h-3 rounded-full',
                        isCurrent
                          ? 'bg-primary-600'
                          : 'bg-slate-300 dark:bg-slate-600'
                      )}
                    />
                  )}
                </motion.div>

                {/* Content */}
                <div className="mt-4 text-center">
                  <h4
                    className={cn(
                      'text-sm font-medium',
                      isCompleted || isCurrent
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400'
                    )}
                  >
                    {item.title}
                  </h4>
                  {item.time && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {item.time}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {index < items.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 w-full mx-2 mb-20',
                    isCompleted
                      ? 'bg-primary-600'
                      : 'bg-slate-300 dark:bg-slate-600'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {items.map((item, index) => {
        const isCompleted = item.status === 'completed';
        const isCurrent = item.status === 'current';
        const isLast = index === items.length - 1;

        return (
          <div key={item.id} className="relative flex gap-4 pb-8">
            {/* Line connector */}
            {!isLast && (
              <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700">
                {isCompleted && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="w-full bg-primary-600"
                  />
                )}
              </div>
            )}

            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'relative flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full border-2',
                isCompleted
                  ? 'bg-primary-600 border-primary-600'
                  : isCurrent
                  ? 'bg-white dark:bg-slate-800 border-primary-600'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
              )}
            >
              {isCompleted ? (
                <HiCheck className="w-5 h-5 text-white" />
              ) : item.icon ? (
                <span
                  className={cn(
                    isCurrent
                      ? 'text-primary-600'
                      : 'text-slate-400 dark:text-slate-500'
                  )}
                >
                  {item.icon}
                </span>
              ) : (
                <span
                  className={cn(
                    'w-3 h-3 rounded-full',
                    isCurrent
                      ? 'bg-primary-600'
                      : 'bg-slate-300 dark:bg-slate-600'
                  )}
                />
              )}
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.1 }}
              className="flex-1 pt-1"
            >
              <div className="flex items-center justify-between mb-1">
                <h4
                  className={cn(
                    'text-sm font-medium',
                    isCompleted || isCurrent
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400'
                  )}
                >
                  {item.title}
                </h4>
                {item.time && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {item.time}
                  </span>
                )}
              </div>

              {item.description && (
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                  {item.description}
                </p>
              )}

              {item.content && <div className="mt-2">{item.content}</div>}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
