import { type ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi2';
import { cn } from '../../utils/cn';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: string[];
  multiple?: boolean;
  onChange?: (openItems: string[]) => void;
  className?: string;
}

const Accordion = ({
  items,
  defaultOpen = [],
  multiple = false,
  onChange,
  className,
}: AccordionProps) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (itemId: string) => {
    let newOpenItems: string[];

    if (multiple) {
      newOpenItems = openItems.includes(itemId)
        ? openItems.filter((id) => id !== itemId)
        : [...openItems, itemId];
    } else {
      newOpenItems = openItems.includes(itemId) ? [] : [itemId];
    }

    setOpenItems(newOpenItems);
    onChange?.(newOpenItems);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);

        return (
          <div
            key={item.id}
            className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => !item.disabled && toggleItem(item.id)}
              disabled={item.disabled}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3',
                'text-left font-medium text-slate-900 dark:text-white',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset',
                item.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer',
                isOpen && 'bg-slate-50 dark:bg-slate-800'
              )}
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <span className="text-slate-500 dark:text-slate-400">
                    {item.icon}
                  </span>
                )}
                <span>{item.title}</span>
              </div>

              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <HiChevronDown className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 py-3 text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
