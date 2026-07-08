import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  HiEnvelope, 
  HiLockClosed, 
  HiEye, 
  HiEyeSlash, 
  HiBeaker,
  HiUsers,
  HiBuildingOffice2,
  HiSparkles,
  HiCheckCircle
} from 'react-icons/hi2';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import toast from 'react-hot-toast';
import { UserRole } from '../../types';
import { cn } from '../../utils/cn';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth, rememberedEmail, setRememberedEmail } = useAuthStore();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: rememberedEmail || '',
      password: '',
      rememberMe: !!rememberedEmail,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const mockUser = {
        id: '1',
        email: data.email,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        tenantId: '1',
        avatar: '',
        phoneNumber: '+91 9876543210',
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockRefreshToken = 'mock-refresh-token-' + Date.now();
      
      if (data.rememberMe) {
        setRememberedEmail(data.email);
      } else {
        setRememberedEmail(null);
      }
      
      setAuth(mockUser, mockToken, mockRefreshToken, data.rememberMe ? data.email : undefined);
      toast.success('Login successful!');
      
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { icon: HiUsers, label: 'Farmers Registered', value: '2,500+' },
    { icon: HiBeaker, label: 'Milk Collected Daily', value: '50,000L' },
    { icon: HiBuildingOffice2, label: 'Active Branches', value: '15' },
  ];

  const features = [
    'Real-time milk collection tracking',
    'Automated payment processing',
    'Quality management system',
    'Comprehensive reporting',
  ];

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden bg-gradient-to-br from-slate-50 via-primary-50/30 to-secondary-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.2, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-radial from-primary-400/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-radial from-secondary-400/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-radial from-accent-400/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Left Side - Branding & Information */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative z-10 flex-col justify-between p-12 xl:p-16"
      >
        {/* Logo & Brand */}
        <div>
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-glow">
              <HiBeaker className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">DairyCoop</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Management System</p>
            </div>
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-xl"
          >
            <h2 className="text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
              Modern Dairy
              <span className="block text-gradient-primary">Cooperative Management</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Streamline your dairy operations with our comprehensive, cloud-based management platform designed for cooperatives of all sizes.
            </p>

            {/* Features List */}
            <div className="space-y-3 mb-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <HiCheckCircle className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  className="relative group"
                >
                  <div className="glass rounded-2xl p-4 hover:shadow-card transition-all duration-300">
                    <stat.icon className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-2" />
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-sm text-slate-500 dark:text-slate-400"
        >
          <p>© 2026 DairyCoop. All rights reserved.</p>
        </motion.div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <HiBeaker className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">DairyCoop</h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">Management System</p>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/20 dark:border-slate-700/50"
            style={{ boxShadow: '0 8px 32px 0 rgb(0 0 0 / 0.12)' }}
          >
            {/* Theme Toggle */}
            <div className="flex justify-end mb-6">
              <button
                onClick={toggleTheme}
                className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-110"
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? (
                  <HiSparkles className="w-5 h-5 text-accent-400" />
                ) : (
                  <HiSparkles className="w-5 h-5 text-slate-600" />
                )}
              </button>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Sign in to access your dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                    placeholder="your.email@example.com"
                    className={cn(
                      'w-full pl-12 pr-4 py-3.5 rounded-xl border transition-all duration-200',
                      'bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white',
                      'placeholder:text-slate-400 dark:placeholder:text-slate-500',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                      errors.email 
                        ? 'border-error-500 focus:ring-error-500' 
                        : 'border-slate-300 dark:border-slate-600'
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-error-600 dark:text-error-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                    placeholder="Enter your password"
                    className={cn(
                      'w-full pl-12 pr-12 py-3.5 rounded-xl border transition-all duration-200',
                      'bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white',
                      'placeholder:text-slate-400 dark:placeholder:text-slate-500',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                      errors.password 
                        ? 'border-error-500 focus:ring-error-500' 
                        : 'border-slate-300 dark:border-slate-600'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <HiEyeSlash className="w-5 h-5" />
                    ) : (
                      <HiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-error-600 dark:text-error-400">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    {...register('rememberMe')}
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 border-slate-300 dark:border-slate-600 rounded focus:ring-primary-500 focus:ring-2 transition-all cursor-pointer"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    Remember me
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'w-full py-3.5 rounded-xl font-semibold text-white',
                  'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  'transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                )}
                style={{ boxShadow: '0 2px 8px 0 rgb(0 0 0 / 0.08)' }}
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
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                >
                  Contact Administrator
                </Link>
              </p>
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="lg:hidden grid grid-cols-3 gap-3 mt-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-3 border border-white/20 dark:border-slate-700/50 text-center">
                <stat.icon className="w-6 h-6 text-primary-600 dark:text-primary-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-[10px] text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
