import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiEnvelope, 
  HiLockClosed, 
  HiEye, 
  HiEyeSlash, 
  HiBeaker,
  HiXMark,
} from 'react-icons/hi2';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginCardProps {
  onClose: () => void;
}

const LoginCard = ({ onClose }: LoginCardProps) => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      
      if (response.success) {
        const { user, accessToken, refreshToken } = response.data;
        setAuth(user, accessToken, refreshToken);
        toast.success('Login successful!');
        onClose();
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid email or password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-2xl relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <HiXMark className="w-6 h-6 text-slate-600" />
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <HiBeaker className="w-9 h-9 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-600 font-medium">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <HiEnvelope className="w-5 h-5" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  autoComplete="email"
                  placeholder="your.email@dairycoop.com"
                  className={cn(
                    'w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200',
                    'bg-white text-slate-900 font-medium',
                    'placeholder:text-slate-400',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-200'
                  )}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <HiLockClosed className="w-5 h-5" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={cn(
                    'w-full pl-12 pr-12 py-3.5 rounded-xl border-2 transition-all duration-200',
                    'bg-white text-slate-900 font-medium',
                    'placeholder:text-slate-400',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-200'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <HiEyeSlash className="w-5 h-5" />
                  ) : (
                    <HiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={onClose}
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-600">
            New to DairyCoop?{' '}
            <button className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              Contact Us
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginCard;
