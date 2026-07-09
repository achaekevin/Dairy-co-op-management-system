import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCheckCircle, HiXCircle, HiEnvelope } from 'react-icons/hi2';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        
        if (response.success) {
          setStatus('success');
          setMessage('Email verified successfully!');
          toast.success('Email verified! You can now log in.');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setStatus('error');
          setMessage(response.message || 'Verification failed');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. Link may have expired.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mx-auto mb-6"
          >
            {status === 'verifying' && (
              <div className="w-20 h-20 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <HiEnvelope className="w-10 h-10 text-primary-600" />
                </motion.div>
              </div>
            )}
            
            {status === 'success' && (
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <HiCheckCircle className="w-12 h-12 text-green-600" />
              </div>
            )}
            
            {status === 'error' && (
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <HiXCircle className="w-12 h-12 text-red-600" />
              </div>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-slate-900 mb-3"
          >
            {status === 'verifying' && 'Verifying Email'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-600 mb-6"
          >
            {message}
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            {status === 'success' && (
              <p className="text-sm text-slate-500">
                Redirecting to login page...
              </p>
            )}
            
            {status === 'error' && (
              <button
                onClick={() => navigate('/login')}
                className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
              >
                Go to Login
              </button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
