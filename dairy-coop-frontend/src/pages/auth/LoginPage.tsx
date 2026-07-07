import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { HiEnvelope, HiLockClosed, HiEye, HiEyeSlash } from 'react-icons/hi2';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { UserRole } from '../../types';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@dairycoop.com',
      password: 'password123',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Mock login for demo - replace with actual API call
      // const response = await authService.login(data);
      
      // Mock successful login
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
      
      setAuth(mockUser, mockToken, mockRefreshToken);
      
      toast.success('Login successful!');
      
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Invalid email or password');
      console.error('Login error:', error);
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
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          {...register('email')}
          label="Email Address"
          type="email"
          placeholder="admin@dairycoop.com"
          error={errors.email?.message}
          leftIcon={<HiEnvelope className="w-5 h-5" />}
          autoComplete="email"
        />

        <div className="relative">
          <Input
            {...register('password')}
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            error={errors.password?.message}
            leftIcon={<HiLockClosed className="w-5 h-5" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? (
                  <HiEyeSlash className="w-5 h-5" />
                ) : (
                  <HiEye className="w-5 h-5" />
                )}
              </button>
            }
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              {...register('rememberMe')}
              type="checkbox"
              className="w-4 h-4 text-primary-600 border-slate-300 dark:border-slate-600 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Remember me
            </span>
          </label>

          <Link
            to="/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              Demo Credentials
            </span>
          </div>
        </div>

        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            <strong>Email:</strong> admin@dairycoop.com
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <strong>Password:</strong> password123
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
