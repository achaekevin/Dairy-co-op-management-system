import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiCommandLine } from 'react-icons/hi2';
import { createPortal } from 'react-dom';

interface Shortcut {
  keys: string;
  description: string;
  category: string;
}

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts: Shortcut[] = [
  { keys: 'Ctrl + K', description: 'Open search', category: 'Navigation' },
  { keys: 'Ctrl + /', description: 'Show keyboard shortcuts', category: 'General' },
  { keys: 'Ctrl + B', description: 'Toggle sidebar', category: 'Navigation' },
  { keys: 'Ctrl + S', description: 'Save changes', category: 'General' },
  { keys: 'Ctrl + P', description: 'Print page', category: 'General' },
  { keys: 'Escape', description: 'Close modal/dialog', category: 'General' },
  { keys: 'Ctrl + H', description: 'Go to home', category: 'Navigation' },
  { keys: 'Ctrl + N', description: 'Create new item', category: 'Actions' },
  { keys: 'Ctrl + E', description: 'Edit item', category: 'Actions' },
  { keys: 'Ctrl + D', description: 'Delete item', category: 'Actions' },
];

const KeyboardShortcutsModal = ({ isOpen, onClose }: KeyboardShortcutsModalProps) => {
  if (!isOpen) return null;

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden"
          >
            <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <HiCommandLine className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
                  <p className="text-primary-100">Speed up your workflow</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <HiXMark className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {categories.map((category) => (
                <div key={category} className="mb-8 last:mb-0">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary-500 rounded-full" />
                    {category}
                  </h3>
                  <div className="space-y-3">
                    {shortcuts
                      .filter((s) => s.category === category)
                      .map((shortcut, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <span className="text-slate-700 dark:text-slate-300">
                            {shortcut.description}
                          </span>
                          <kbd className="px-3 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono font-semibold text-slate-900 dark:text-white shadow-sm">
                            {shortcut.keys}
                          </kbd>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-slate-100 dark:bg-slate-900 p-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                Press <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs font-mono">Esc</kbd> or{' '}
                <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs font-mono">Ctrl + /</kbd> to close
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default KeyboardShortcutsModal;
