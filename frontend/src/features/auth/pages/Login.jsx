import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/features/auth';
import { Input, Button } from '@/features/shared';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, loading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const redirect = new URLSearchParams(location.search).get('redirect') || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data) => {
    setAuthError('');
    try {
      await login(data.email, data.password);
      navigate(redirect);
    } catch (err) {
      setAuthError(err.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-canvas-cream text-black flex items-center justify-center py-20 px-6 font-body">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl border border-hairline-light elevation-light-3">

        {/* Header Block */}
        <div className="flex flex-col gap-2 mb-8 text-center">
          <span className="text-[10px] uppercase tracking-widest text-emerald-800 font-semibold font-body">Welcome Back</span>
          <h2 className="text-3xl font-display font-light text-black">Log in to Shopifi</h2>
        </div>

        {authError && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">
            {authError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-xs text-shade-50 hover:text-black hover:underline font-medium"
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary-pill"
            className="w-full mt-2 group"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            {!loading && <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-hairline-light text-center">
          <p className="text-sm text-shade-50 font-medium">
            New to Shopifi?{' '}
            <Link
              to={redirect !== '/dashboard' ? `/signup?redirect=${redirect}` : '/signup'}
              className="text-black hover:underline font-semibold"
            >
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
