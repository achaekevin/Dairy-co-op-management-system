import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCheckCircle, HiArrowPath } from 'react-icons/hi2';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || 'user@example.com';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (index === 5 && value && newOtp.every((digit) => digit)) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
      handleVerify(newOtp.join(''));
    }
  };

  const handleVerify = async (otpCode: string) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (otpCode === '123456') {
        setIsSuccess(true);
        toast.success('OTP verified successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        toast.error('Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
      console.error('OTP verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      handleVerify(otpCode);
    } else {
      toast.error('Please enter all 6 digits');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('OTP resent successfully!');
      setTimeLeft(120);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <HiCheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Verification Successful!
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Redirecting to dashboard...
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Verify Your Identity
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          We've sent a 6-digit code to
        </p>
        <p className="text-slate-900 dark:text-white font-medium mt-1">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 text-center">
            Enter OTP Code
          </label>
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-3">
            Demo OTP: 123456
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center gap-1"
            >
              <HiArrowPath className="w-4 h-4" />
              Resend OTP
            </button>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Resend OTP in{' '}
              <span className="font-medium text-primary-600 dark:text-primary-400">
                {formatTime(timeLeft)}
              </span>
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
          disabled={otp.some((digit) => !digit)}
        >
          Verify OTP
        </Button>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </motion.div>
  );
};

export default VerifyOtpPage;
