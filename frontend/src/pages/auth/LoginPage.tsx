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
  HiCurrencyDollar,
  HiChartBar,
} from 'react-icons/hi2';
import { useAuthStore } from '../../store/authStore';
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

  const features = [
    {
      icon: HiUsers,
      title: 'Farmer Management',
      description: 'Track individual and group records efficiently.',
    },
    {
      icon: HiBeaker,
      title: 'Milk Collection',
      description: 'Real-time milk collection tracking and quality control.',
    },
    {
      icon: HiCurrencyDollar,
      title: 'Payment & Loans',
      description: 'Automated payment processing and loan management.',
    },
    {
      icon: HiChartBar,
      title: 'Analytics & Reporting',
      description: 'Real-time insights on cooperative operations and growth.',
    },
  ];

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side - Dark with Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)',
          }} />
        </div>

        <div className="relative z-10 w-full p-12 xl:p-16 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <HiBeaker className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">DairyCoop</h1>
              <p className="text-sm text-slate-400">Management Suite</p>
            </div>
          </div>

          {/* Main Heading */}
          <div className="mb-12">
            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
              Empower Your<br />
              Dairy's Journey.
            </h2>
            <p className="text-lg text-slate-400 max-w-md">
              Join leading dairy cooperatives in streamlining operations, managing farmers, and achieving sustainable growth.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4 mb-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Footer Links */}
          <div className="flex items-center gap-6 text-sm text-slate-400 mt-8">
            <Link to="/about" className="hover:text-white transition-colors">About DairyCoop</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image Background with Frosted Glass Card */}
      <div 
        className="w-full lg:w-1/2 relative flex items-center justify-center p-4 sm:p-8"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1974)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-slate-900/40" />

        {/* Mobile Logo (shown only on mobile) */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3 z-20">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <HiBeaker className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white drop-shadow-lg">DairyCoop</h1>
            <p className="text-xs text-white/80 drop-shadow">Management Suite</p>
          </div>
        </div>

        {/* Frosted Glass Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <div 
            className="bg-slate-900/70 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/10"
            style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' }}
          >
            {/* Logo Badge */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                <HiBeaker className="w-9 h-9 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Member Login
              </h2>
              <p className="text-slate-300">
                Sign in to access your secure dashboard.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Member Email
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
                    placeholder="email@yourdairy.com"
                    className={cn(
                      'w-full pl-12 pr-4 py-3.5 rounded-xl border transition-all duration-200',
                      'bg-slate-800/50 text-white',
                      'placeholder:text-slate-500',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-slate-800',
                      errors.email 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-slate-700'
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Access PIN / Password
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
                      'w-full pl-12 pr-12 py-3.5 rounded-xl border transition-all duration-200',
                      'bg-slate-800/50 text-white',
                      'placeholder:text-slate-500',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-slate-800',
                      errors.password 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-slate-700'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <HiEyeSlash className="w-5 h-5" />
                    ) : (
                      <HiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    {...register('rememberMe')}
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 bg-slate-800 border-slate-600 rounded focus:ring-primary-500 focus:ring-2 cursor-pointer"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    Remember me
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Forgot PIN/Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                  'Sign in'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
