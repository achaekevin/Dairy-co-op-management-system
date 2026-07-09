import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiLockClosed, HiEnvelope, HiArrowLeft } from 'react-icons/hi2';

const AccountLockedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
          >
            <HiLockClosed className="w-10 h-10 text-red-600" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-slate-900 text-center mb-3"
          >
            Account Locked
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-600 text-center mb-6"
          >
            Your account has been temporarily locked due to multiple failed login attempts.
            This is a security measure to protect your account.
          </motion.p>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6"
          >
            <h3 className="text-sm font-semibold text-amber-900 mb-2">What happened?</h3>
            <p className="text-sm text-amber-800 mb-3">
              Your account was locked after too many unsuccessful login attempts.
            </p>
            <h3 className="text-sm font-semibold text-amber-900 mb-2">What can you do?</h3>
            <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
              <li>Wait 30 minutes for automatic unlock</li>
              <li>Reset your password to unlock immediately</li>
              <li>Contact support if you believe this is an error</li>
            </ul>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <button
              onClick={() => navigate('/forgot-password')}
              className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <HiEnvelope className="w-5 h-5" />
              Reset Password
            </button>

            <button
              onClick={() => navigate('/login')}
              className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <HiArrowLeft className="w-5 h-5" />
              Back to Login
            </button>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-slate-600">
              Need help?{' '}
              <a href="mailto:support@dairycoop.com" className="text-primary-600 hover:text-primary-700 font-semibold">
                Contact Support
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountLockedPage;
