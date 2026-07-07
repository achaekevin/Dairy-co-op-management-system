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
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
              'hover:bg-slate-100 dark:hover:bg-slate-800',
              'text-slate-700 dark:text-slate-300',
              isCollapsed && 'justify-center'
            )}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                <motion.svg
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-4 h-4"
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
                className="overflow-hidden ml-4 mt-1 space-y-1"
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
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
          'hover:bg-slate-100 dark:hover:bg-slate-800',
          active
            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
            : 'text-slate-700 dark:text-slate-300',
          isCollapsed && 'justify-center',
          level > 0 && 'pl-6'
        )}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && (
          <span className="flex-1 text-sm font-medium">{item.label}</span>
        )}
        {!isCollapsed && item.badge && (
          <span className="badge-error text-xs">{item.badge}</span>
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-slate-700">
        <motion.div
          initial={false}
          animate={{ scale: isCollapsed ? 0.8 : 1 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <HiBeaker className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">DairyCoop</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Management System</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-1">
        {menuItems.map((item) => renderMenuItem(item))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
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
        className="hidden lg:block fixed left-0 top-0 h-screen bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-30"
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
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-50"
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
