import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, ArrowRight, Lock, Mail, CheckCircle2, KeyRound, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { BrandLogo } from '../components/common/BrandLogo';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Redirect target if redirected from a protected route
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  const redirectedFromProtected = !!(location.state as any)?.from;

  // If already logged in, redirect away from login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password);
    navigate(from, { replace: true });
  };

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setIsResetting(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsResetting(false);
    setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center group">
          <BrandLogo size="xl" showTagline={false} />
        </Link>
        <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Sign in to access your planned routes, budget trackers, and travel memories.
        </p>

        {redirectedFromProtected && (
          <div className="mt-4 p-3 rounded-2xl bg-blue-950/80 border border-blue-500/30 text-blue-200 text-xs flex items-center gap-2 text-left backdrop-blur-md">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Please sign in to access your trips and travel tools.</span>
          </div>
        )}
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl backdrop-blur-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <Input
                type="email"
                placeholder="name@example.com"
                error={errors.email?.message}
                {...register('email')}
                className="bg-slate-950/60 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail('');
                    setResetSent(false);
                    setIsForgotOpen(true);
                  }}
                  className="text-xs text-blue-400 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
                className="bg-slate-950/60 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 shadow-lg shadow-blue-600/30 cursor-pointer"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 font-bold hover:underline">
              Create account
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        title="Reset Your Password"
        description="Enter your registered email address to receive password reset instructions."
      >
        {resetSent ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-400/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">Reset Link Dispatched!</h4>
            <p className="text-xs text-slate-300">
              We've sent a secure password recovery link to <span className="font-bold text-blue-300">{forgotEmail}</span>. Please check your inbox.
            </p>
            <Button
              onClick={() => setIsForgotOpen(false)}
              variant="primary"
              size="sm"
              className="w-full mt-2"
            >
              Back to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSendReset} className="space-y-4">
            <Input
              label="Registered Email Address"
              type="email"
              placeholder="het.beladiya@example.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={() => setIsForgotOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isResetting} leftIcon={<KeyRound className="w-4 h-4" />}>
                Send Reset Link
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
