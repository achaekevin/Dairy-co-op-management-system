import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import { HiHome, HiExclamationTriangle, HiArrowPath } from 'react-icons/hi2';

const ServerErrorPage = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <HiExclamationTriangle className="w-12 h-12 text-amber-600 dark:text-amber-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-bold text-amber-600 dark:text-amber-400 mb-4"
        >
          500
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-slate-900 dark:text-white mb-4"
        >
          Server Error
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-slate-600 dark:text-slate-400 mb-8"
        >
          Oops! Something went wrong on our end. We're working to fix it. Please try again later.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Button
            variant="outline"
            leftIcon={<HiArrowPath className="w-5 h-5" />}
            onClick={handleRefresh}
          >
            Refresh Page
          </Button>
          <Link to="/dashboard">
            <Button variant="primary" leftIcon={<HiHome className="w-5 h-5" />}>
              Back to Dashboard
            </Button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-slate-500 dark:text-slate-400 mt-8"
        >
          Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ServerErrorPage;
