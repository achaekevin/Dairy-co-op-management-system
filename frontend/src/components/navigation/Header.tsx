import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarStore } from '../../store/sidebarStore';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import NotificationPanel from './NotificationPanel';
import {
  HiBars3,
  HiMagnifyingGlass,
  HiBell,
  HiMoon,
  HiSun,
  HiChevronDown,
  HiCog,
  HiUser,
  HiArrowRightOnRectangle,
} from 'react-icons/hi2';

const Header = () => {
  const { toggleCollapse, toggleMobile } = useSidebarStore();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const { user, clearAuth } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  return (
    <>
      <header className="h-14 sm:h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 fixed top-0 right-0 left-0 lg:left-auto z-20">
        <div className="h-full flex items-center justify-between px-3 sm:px-4 lg:px-6 gap-2 sm:gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobile}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
              aria-label="Toggle mobile menu"
            >
              <HiBars3 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Desktop Collapse Button */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:block p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
              aria-label="Toggle sidebar"
            >
              <HiBars3 className="w-6 h-6" />
            </button>

            {/* Search - Desktop */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2 w-48 lg:w-64 xl:w-96 flex-shrink">
              <HiMagnifyingGlass className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none w-full text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 min-w-0"
              />
              <kbd className="hidden xl:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-mono bg-slate-200 dark:bg-slate-600 rounded flex-shrink-0">
                ⌘K
              </kbd>
            </div>

            {/* Search Button - Mobile Only */}
            <button
              className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
              aria-label="Search"
            >
              <HiMagnifyingGlass className="w-5 h-5" />
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? (
                <HiSun className="w-5 h-5" />
              ) : (
                <HiMoon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors relative"
                aria-label="Notifications"
              >
                <HiBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>

            {/* Profile Menu */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm font-semibold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div className="hidden lg:block text-left min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[120px] xl:max-w-[160px]">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.role}</p>
                </div>
                <HiChevronDown className="w-4 h-4 text-slate-400 hidden sm:block flex-shrink-0" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 sm:w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-40"
                    >
                      <div className="p-2">
                        <Link
                          to="/dashboard/profile"
                          className="flex items-center gap-3 px-3 py-2.5 sm:py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <HiUser className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm">Profile</span>
                        </Link>
                        <Link
                          to="/dashboard/settings"
                          className="flex items-center gap-3 px-3 py-2.5 sm:py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <HiCog className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm">Settings</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 sm:py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-red-600 dark:text-red-400"
                        >
                          <HiArrowRightOnRectangle className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};

export default Header;
