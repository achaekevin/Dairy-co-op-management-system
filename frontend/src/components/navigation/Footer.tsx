import { Link } from 'react-router-dom';
import { useSidebarStore } from '../../store/sidebarStore';
import { motion } from 'framer-motion';

const Footer = () => {
  const { isCollapsed } = useSidebarStore();

  return (
    <motion.footer
      initial={false}
      animate={{
        marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? (isCollapsed ? 80 : 256) : 0,
      }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-4 px-6"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-600 dark:text-slate-400 text-center md:text-left">
          © {new Date().getFullYear()} <span className="font-semibold">DairyCoop</span>. All rights
          reserved.
        </div>

        <div className="flex items-center gap-6 text-sm">
          <Link
            to="/about"
            className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
          >
            About
          </Link>
          <Link
            to="/privacy"
            className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
          >
            Privacy
          </Link>
          <Link
            to="/terms"
            className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
          >
            Terms
          </Link>
          <Link
            to="/support"
            className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
          >
            Support
          </Link>
        </div>

        <div className="text-sm text-slate-500 dark:text-slate-500">
          Version 1.0.0
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
