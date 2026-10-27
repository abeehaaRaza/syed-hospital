'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Eye, EyeOff, Loader2, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    setAuthError('');

    const result = await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setAuthError('Invalid username or password');
      return;
    }

    // Fetch the session to get the role and redirect correctly
    const sessionRes = await fetch('/api/auth/session');
    const session = await sessionRes.json();
    const role = session?.user?.role;

    if (role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else if (role === 'HR') {
      router.push('/hr/dashboard');
    } else if (role === 'DOCTOR') {
      router.push('/doctor/dashboard'); // <-- FIX: Doctors now go to their portal!
    } else {
      router.push('/reception/dashboard');
    }

    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* LEFT — Branded panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#1E3A6E] via-[#2E5FA3] to-[#3B7DD8]">
        <svg
          className="absolute bottom-24 left-0 w-full opacity-20"
          viewBox="0 0 400 60"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 30 H120 L135 10 L155 50 L170 20 L185 30 H400"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        </svg>
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8 bg-white rounded-2xl p-4 w-fit shadow-lg">
            <Image
              src="/hos.png"
              alt="Syed Hospital"
              width={140}
              height={140}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Your Health,
            <br />
            Our Priority
          </h1>
          <p className="text-blue-100 text-lg max-w-md leading-relaxed">
            Secure staff access to the Syed Hospital management system.
            Compassionate care, organized records.
          </p>
        </div>
      </div>

      {/* RIGHT — Login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Image
              src="/hos.png"
              alt="Syed Hospital"
              width={120}
              height={120}
              className="object-contain"
              priority
            />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500 mt-1">Sign in to access your portal</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-700">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username"
                  className="pl-10 h-11"
                  {...register('username')}
                />
              </div>
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-11"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {authError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {authError}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[#2E5FA3] hover:bg-[#264F87] text-white font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-8">
            Authorized personnel only · Syed Hospital
          </p>
        </div>
      </div>
    </div>
  );
}