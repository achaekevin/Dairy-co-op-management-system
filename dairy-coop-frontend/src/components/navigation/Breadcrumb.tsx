import { Link, useLocation } from 'react-router-dom';
import { HiChevronRight, HiHome } from 'react-icons/hi2';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];
    let currentPath = '';

    pathnames.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        path: index === pathnames.length - 1 ? undefined : currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm mb-4" aria-label="Breadcrumb">
      <Link
        to="/dashboard"
        className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
      >
        <HiHome className="w-4 h-4" />
      </Link>

      {breadcrumbs.map((item, index) => (
        <motion.div
          key={item.path || item.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center space-x-2"
        >
          <HiChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600" />
          {item.path ? (
            <Link
              to={item.path}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 dark:text-white font-medium">{item.label}</span>
          )}
        </motion.div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
