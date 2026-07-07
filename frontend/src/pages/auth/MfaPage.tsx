import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiDevicePhoneMobile, HiEnvelope, HiCheckCircle, HiShieldCheck } from 'react-icons/hi2';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

type MfaMethod = 'sms' | 'email' | 'authenticator';

const MfaPage = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<MfaMethod>('sms');
  const [isLoading, setIsLoading] = useState(false);

  const methods = [
    {
      id: 'sms' as MfaMethod,
      title: 'SMS Verification',
      description: 'Receive code via text message',
      icon: HiDevicePhoneMobile,
      detail: '+91 ******5432',
    },
    {
      id: 'email' as MfaMethod,
      title: 'Email Verification',
      description: 'Receive code via email',
      icon: HiEnvelope,
      detail: 'ad***@dairycoop.com',
    },
    {
      id: 'authenticator' as MfaMethod,
      title: 'Authenticator App',
      description: 'Use your authenticator app',
      icon: HiShieldCheck,
      detail: 'Google Authenticator / Authy',
    },
  ];

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`Verification code sent via ${selectedMethod}!`);

      // Navigate to OTP verification with selected method
      navigate('/verify-otp', {
        state: {
          email: 'admin@dairycoop.com',
          method: selectedMethod,
        },
      });
    } catch (error) {
      toast.error('Failed to send verification code');
      console.error('MFA error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <HiShieldCheck className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Two-Factor Authentication
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Choose how you want to verify your identity
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {methods.map((method, index) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <motion.button
              key={method.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedMethod(method.id)}
              className="w-full text-left"
            >
              <Card
                className={`p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary-500 dark:border-primary-500 ring-2 ring-primary-500/20'
                    : 'hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'bg-primary-100 dark:bg-primary-900/30'
                        : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isSelected
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {method.title}
                      </h3>
                      {isSelected && (
                        <HiCheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      {method.description}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">{method.detail}</p>
                  </div>
                </div>
              </Card>
            </motion.button>
          );
        })}
      </div>

      <Button
        onClick={handleContinue}
        variant="primary"
        className="w-full"
        isLoading={isLoading}
      >
        Continue
      </Button>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/login')}
          className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          Back to Login
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
      >
        <p className="text-xs text-blue-800 dark:text-blue-200 text-center">
          <strong>Security Tip:</strong> Never share your verification codes with anyone.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default MfaPage;
