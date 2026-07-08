import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarStore } from '../../store/sidebarStore';
import { menuItems } from '../../constants/menu';
import { cn } from '../../utils/cn';
import {
  HiHome,
  HiUsers,
  HiBeaker,
  HiCreditCard,
  HiBuildingLibrary,
  HiChartBar,
  HiHeart,
  HiShoppingBag,
  HiCube,
  HiShoppingCart,
  HiTruck,
  HiUserCircle,
  HiCalculator,
  HiCalendar,
  HiDocumentText,
  HiCog,
  HiChartPie,
  HiUserGroup,
  HiCubeTransparent,
} from 'react-icons/hi2';
import { useState } from 'react';

const iconMap: Record<string, React.ElementType> = {
  home: HiHome,
  users: HiUsers,
  droplet: HiBeaker,
  award: HiChartBar,
  'credit-card': HiCreditCard,
  bank: HiBuildingLibrary,
  'trending-up': HiChartBar,
  'heart-pulse': HiHeart,
  package: HiCube,
  'shopping-bag': HiShoppingBag,
  warehouse: HiCubeTransparent,
  boxes: HiCube,
  'shopping-cart': HiShoppingCart,
  truck: HiTruck,
  'user-check': HiUserGroup,
  calculator: HiCalculator,
  'user-circle': HiUserCircle,
  calendar: HiCalendar,
  'file-text': HiDocumentText,
  'bar-chart': HiChartPie,
  settings: HiCog,
};

const Sidebar = () => {
  const location = useLocation();
  const { isCollapsed, isMobileOpen, setMobileOpen } = useSidebarStore();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleSubmenu = (id: string) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const renderMenuItem = (item: typeof menuItems[0], level = 0) => {
    const Icon = iconMap[item.icon] || HiHome;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus.includes(item.id);
    const active = isActive(item.path);

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleSubmenu(item.id)}
            className={cn(
              'w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-all duration-200 min-h-[44px]',
              'hover:bg-slate-100 dark:hover:bg-slate-800',
              'text-slate-700 dark:text-slate-300',
              isCollapsed && 'justify-center'
            )}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left text-xs sm:text-sm font-medium truncate">{item.label}</span>
                <motion.svg
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </>
            )}
          </button>
          <AnimatePresence>
            {isOpen && !isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden ml-3 sm:ml-4 mt-0.5 sm:mt-1 space-y-0.5 sm:space-y-1"
              >
                {item.children?.map((child) => renderMenuItem(child, level + 1))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.path || '#'}
        onClick={() => isMobileOpen && setMobileOpen(false)}
        className={cn(
          'flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-all duration-200 min-h-[44px]',
          'hover:bg-slate-100 dark:hover:bg-slate-800',
          active
            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
            : 'text-slate-700 dark:text-slate-300',
          isCollapsed && 'justify-center',
          level > 0 && 'pl-4 sm:pl-6'
        )}
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
        {!isCollapsed && (
          <span className="flex-1 text-xs sm:text-sm font-medium truncate">{item.label}</span>
        )}
        {!isCollapsed && item.badge && (
          <span className="badge-error text-[10px] sm:text-xs flex-shrink-0">{item.badge}</span>
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-14 sm:h-16 flex items-center px-3 sm:px-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <motion.div
          initial={false}
          animate={{ scale: isCollapsed ? 0.8 : 1 }}
          className="flex items-center gap-2 sm:gap-3 min-w-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <HiBeaker className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">DairyCoop</h1>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">Management System</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin p-3 sm:p-4 space-y-0.5 sm:space-y-1">
        {menuItems.map((item) => renderMenuItem(item))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 text-center">
            Version 1.0.0
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:block fixed left-0 top-0 h-screen bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-30 overflow-hidden"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-64 sm:w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-50 shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
