import { motion } from 'framer-motion';
import { HiWrenchScrewdriver, HiClock, HiArrowPath } from 'react-icons/hi2';
import { useState, useEffect } from 'react';

const MaintenancePage = () => {
  const [countdown, setCountdown] = useState({
    hours: 2,
    minutes: 30,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <HiWrenchScrewdriver className="w-12 h-12 text-primary-600" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-4"
          >
            Under Maintenance
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-slate-600 text-center mb-8"
          >
            We're currently performing scheduled maintenance to improve your experience.
            We'll be back shortly!
          </motion.p>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <HiClock className="w-6 h-6 text-primary-600" />
              <h3 className="text-lg font-semibold text-slate-900">Estimated Time Remaining</h3>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-1">
                  {countdown.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-slate-600 font-medium">Hours</div>
              </div>
              <div className="text-3xl font-bold text-slate-400">:</div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-1">
                  {countdown.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-slate-600 font-medium">Minutes</div>
              </div>
              <div className="text-3xl font-bold text-slate-400">:</div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-1">
                  {countdown.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-slate-600 font-medium">Seconds</div>
              </div>
            </div>
          </motion.div>

          {/* Info Boxes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-2 gap-4 mb-8"
          >
            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="font-semibold text-slate-900 mb-2">What's being updated?</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• System performance improvements</li>
                <li>• Security updates</li>
                <li>• New features</li>
              </ul>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="font-semibold text-slate-900 mb-2">What to expect?</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Faster load times</li>
                <li>• Enhanced security</li>
                <li>• Improved user experience</li>
              </ul>
            </div>
          </motion.div>

          {/* Refresh Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all hover:scale-105"
            >
              <HiArrowPath className="w-5 h-5" />
              Check Again
            </button>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-slate-600">
              For urgent matters, contact us at{' '}
              <a href="mailto:support@dairycoop.com" className="text-primary-600 hover:text-primary-700 font-semibold">
                support@dairycoop.com
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default MaintenancePage;
