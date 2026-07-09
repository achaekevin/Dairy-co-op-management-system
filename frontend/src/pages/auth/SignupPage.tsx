import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  HiUser,
  HiPhone,
  HiCheckCircle,
} from 'react-icons/hi2';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';
import Button from '../../components/ui/Button';

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      
      const response = await authService.register(registerData);
      
      if (response.success) {
        setShowSuccessModal(true);
        toast.success('Account created successfully!');
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative w-full max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <HiBeaker className="w-9 h-9 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">DairyCoop</h1>
                  <p className="text-slate-600 font-medium">Management System</p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-slate-900">
                  Join Our Growing Community
                </h2>
                <p className="text-lg text-slate-600">
                  Create your account and start managing your dairy cooperative efficiently.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  'Real-time milk collection tracking',
                  'Automated payment processing',
                  'Quality management & testing',
                  'Comprehensive analytics & reports',
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <HiCheckCircle className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="text-slate-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Signup Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <HiBeaker className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                Create Account
              </h2>
              <p className="text-slate-600">
                Fill in your details to get started
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <HiUser className="w-5 h-5" />
                    </div>
                    <input
                      {...register('firstName')}
                      type="text"
                      id="firstName"
                      placeholder="John"
                      className={cn(
                        'w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                        errors.firstName ? 'border-red-500' : 'border-slate-200'
                      )}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <HiUser className="w-5 h-5" />
                    </div>
                    <input
                      {...register('lastName')}
                      type="text"
                      id="lastName"
                      placeholder="Doe"
                      className={cn(
                        'w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                        errors.lastName ? 'border-red-500' : 'border-slate-200'
                      )}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <HiEnvelope className="w-5 h-5" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    placeholder="john.doe@example.com"
                    className={cn(
                      'w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                      errors.email ? 'border-red-500' : 'border-slate-200'
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <HiPhone className="w-5 h-5" />
                  </div>
                  <input
                    {...register('phone')}
                    type="tel"
                    id="phone"
                    placeholder="+254 712 345 678"
                    className={cn(
                      'w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                      errors.phone ? 'border-red-500' : 'border-slate-200'
                    )}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <HiLockClosed className="w-5 h-5" />
                  </div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="••••••••"
                    className={cn(
                      'w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                      errors.password ? 'border-red-500' : 'border-slate-200'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <HiLockClosed className="w-5 h-5" />
                  </div>
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    placeholder="••••••••"
                    className={cn(
                      'w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                      errors.confirmPassword ? 'border-red-500' : 'border-slate-200'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Sign In
              </button>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiCheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Account Created Successfully!
            </h3>
            <p className="text-slate-600 mb-6">
              Your account has been created. You will be redirected to the login page shortly.
            </p>
            <Button
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Go to Login
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
