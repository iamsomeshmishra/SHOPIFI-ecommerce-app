import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/features/auth';
import { Input, Button } from '@/features/shared';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register: signupUser, error, loading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const redirect = new URLSearchParams(location.search).get('redirect') || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' }
  });

  const onSubmit = async (data) => {
    setAuthError('');
    try {
      await signupUser(data.name, data.email, data.password);
      navigate(redirect);
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-canvas-cream text-black flex items-center justify-center py-20 px-6 font-body">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl border border-hairline-light elevation-light-3">
        
        {/* Header Block */}
        <div className="flex flex-col gap-2 mb-8 text-center">
          <span className="text-[10px] uppercase tracking-widest text-emerald-800 font-semibold font-body">Get Started</span>
          <h2 className="text-3xl font-display font-light text-black">Create your account</h2>
        </div>

        {authError && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">
            {authError}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            error={errors.name}
            {...register('name')}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            error={errors.email}
            {...register('email')}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.password}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-zinc-400 hover:text-black cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Input
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            error={errors.confirmPassword}
            {...register('confirmPassword')}
          />

          <Button 
            type="submit" 
            variant="primary-pill" 
            className="w-full mt-2 group"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
            {!loading && <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-hairline-light text-center">
          <p className="text-sm text-shade-50 font-medium">
            Already have an account?{' '}
            <Link 
              to={redirect !== '/dashboard' ? `/login?redirect=${redirect}` : '/login'} 
              className="text-black hover:underline font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;
