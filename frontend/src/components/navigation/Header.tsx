import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarStore } from '../../store/sidebarStore';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';
import NotificationPanel from './NotificationPanel';
import {
  HiBars3,
  HiMagnifyingGlass,
  HiBell,
  HiMoon,
  HiChevronDown,
  HiCog,
  HiUser,
  HiArrowRightOnRectangle,
  HiSparkles,
} from 'react-icons/hi2';
import { cn } from '../../utils/cn';

const Header = () => {
  const { toggleCollapse, toggleMobile } = useSidebarStore();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const { user, clearAuth } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Ignore logout errors, clear anyway
    } finally {
      clearAuth();
      window.location.href = '/';
    }
  };

  return (
    <>
      <header className="h-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 fixed top-0 right-0 left-0 lg:left-auto z-20 shadow-soft">
        <div className="h-full flex items-center justify-between px-4 lg:px-6 gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobile}
              className="lg:hidden p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-110 flex-shrink-0"
              aria-label="Toggle mobile menu"
            >
              <HiBars3 className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            </button>

            {/* Desktop Collapse Button */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:block p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-110 flex-shrink-0"
              aria-label="Toggle sidebar"
            >
              <HiBars3 className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            </button>

            {/* Search - Desktop */}
            <div className={cn(
              "hidden md:flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200",
              "w-96 xl:w-[32rem] flex-shrink border",
              searchFocused 
                ? "bg-white dark:bg-slate-800 border-primary-500 shadow-card ring-2 ring-primary-500/20" 
                : "bg-slate-100/80 dark:bg-slate-700/50 border-transparent hover:bg-slate-100 dark:hover:bg-slate-700"
            )}>
              <HiMagnifyingGlass className={cn(
                "w-5 h-5 transition-colors flex-shrink-0",
                searchFocused ? "text-primary-600 dark:text-primary-400" : "text-slate-400"
              )} />
              <input
                type="text"
                placeholder="Search anything..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="bg-transparent border-none outline-none w-full text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 min-w-0"
              />
              <kbd className="hidden xl:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-slate-200 dark:bg-slate-600 rounded-lg flex-shrink-0 font-semibold">
                ⌘K
              </kbd>
            </div>

            {/* Search Button - Mobile Only */}
            <button
              className="md:hidden p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-110 flex-shrink-0"
              aria-label="Search"
            >
              <HiMagnifyingGlass className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-110 flex-shrink-0 group"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? (
                <HiSparkles className="w-5 h-5 text-accent-400 group-hover:rotate-12 transition-transform" />
              ) : (
                <HiMoon className="w-5 h-5 text-slate-600 group-hover:rotate-12 transition-transform" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-110 relative group"
                aria-label="Notifications"
              >
                <HiBell className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:animate-pulse-soft" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-error-500 rounded-full animate-pulse" />
              </button>
            </div>

            {/* Profile Menu */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 pr-3 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-105 group"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft group-hover:shadow-glow transition-shadow">
                  <span className="text-white text-sm font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div className="hidden lg:block text-left min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[120px] xl:max-w-[160px]">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">{user?.role?.toLowerCase()}</p>
                </div>
                <HiChevronDown className="w-4 h-4 text-slate-400 hidden sm:block flex-shrink-0 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
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
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-elevated border border-slate-200/50 dark:border-slate-700/50 z-40 overflow-hidden"
                    >
                      <div className="p-2 space-y-1">
                        <Link
                          to="/dashboard/profile"
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200 group"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <HiUser className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Profile</span>
                        </Link>
                        <Link
                          to="/dashboard/settings"
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200 group"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <HiCog className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Settings</span>
                        </Link>
                        <div className="my-1 h-px bg-slate-200 dark:bg-slate-700" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-all duration-200 text-error-600 dark:text-error-400 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-error-100 dark:bg-error-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <HiArrowRightOnRectangle className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium">Logout</span>
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
