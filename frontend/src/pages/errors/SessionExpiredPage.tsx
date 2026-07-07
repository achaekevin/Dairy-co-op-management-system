import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import { HiClock, HiArrowRightOnRectangle } from 'react-icons/hi2';
import { useAuthStore } from '../../store/authStore';

const SessionExpiredPage = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogin = () => {
    clearAuth();
    navigate('/login');
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
          className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <HiClock className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-slate-900 dark:text-white mb-4"
        >
          Session Expired
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-slate-600 dark:text-slate-400 mb-8"
        >
          Your session has expired due to inactivity. Please login again to continue using the
          application.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="primary"
            leftIcon={<HiArrowRightOnRectangle className="w-5 h-5" />}
            onClick={handleLogin}
            className="w-full"
          >
            Login Again
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg"
        >
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <strong>Security Tip:</strong> Sessions expire after 30 minutes of inactivity to
            protect your account.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SessionExpiredPage;
