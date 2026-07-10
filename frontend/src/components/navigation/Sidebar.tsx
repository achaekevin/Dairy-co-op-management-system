import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarStore } from '../../store/sidebarStore';
import { useAuthStore } from '../../store/authStore';
import { menuItems } from '../../constants/menu';
import { cn } from '../../utils/cn';
import type { MenuItem } from '../../types';
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
  HiChevronRight,
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
  const { user } = useAuthStore();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const hasPermission = (item: MenuItem): boolean => {
    if (!item.permissions || item.permissions.length === 0) {
      return true;
    }
    if (!user?.role) {
      return false;
    }
    return item.permissions.includes(user.role);
  };

  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items.filter(item => {
      if (!hasPermission(item)) {
        return false;
      }
      if (item.children) {
        item.children = filterMenuItems(item.children);
      }
      return true;
    });
  };

  const filteredMenuItems = filterMenuItems([...menuItems]);

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
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 min-h-[44px] group',
              'hover:bg-primary-50 dark:hover:bg-primary-900/20',
              'text-slate-900 dark:text-slate-100 hover:text-primary-700 dark:hover:text-primary-400',
              isCollapsed && 'justify-center'
            )}
          >
            <div className={cn(
              "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200",
              "bg-slate-100 dark:bg-slate-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30",
              "group-hover:scale-110"
            )}>
              <Icon className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            </div>
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left text-sm font-medium truncate">{item.label}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <HiChevronRight className="w-4 h-4" />
                </motion.div>
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
                className="overflow-hidden ml-12 mt-1 space-y-1"
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
          'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 min-h-[44px] group relative',
          active
            ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
            : 'hover:bg-primary-50 dark:hover:bg-primary-900/20 text-slate-900 dark:text-slate-100 hover:text-primary-700 dark:hover:text-primary-400',
          isCollapsed && 'justify-center',
          level > 0 && !isCollapsed && 'pl-6'
        )}
      >
        {active && !isCollapsed && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
        <div className={cn(
          "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200",
          active 
            ? "bg-white/20" 
            : "bg-slate-100 dark:bg-slate-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30",
          "group-hover:scale-110"
        )}>
          <Icon className={cn("w-5 h-5", active ? "text-white" : "text-slate-700 dark:text-slate-200")} />
        </div>
        {!isCollapsed && (
          <>
            <span className={cn("flex-1 text-sm font-semibold truncate", active ? "text-white" : "")}>{item.label}</span>
            {item.badge && (
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0",
                active 
                  ? "bg-white text-primary-700" 
                  : "bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400"
              )}>
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 flex-shrink-0">
        <motion.div
          initial={false}
          animate={{ scale: isCollapsed ? 0.9 : 1 }}
          className="flex items-center gap-3 min-w-0"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-glow flex-shrink-0">
            <HiBeaker className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">DairyCoop</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Management</p>
            </div>
          )}
        </motion.div>
      </div>

      <div className="px-3 mb-3">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 space-y-1">
        {filteredMenuItems.map((item) => renderMenuItem(item))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
            v1.0.0 © 2026 DairyCoop
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
        animate={{ width: isCollapsed ? 80 : 280 }}
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
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-280 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-50 shadow-elevated"
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
