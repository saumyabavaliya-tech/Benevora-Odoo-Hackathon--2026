import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { BrandLogo } from '../components/common/BrandLogo';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export const Signup: React.FC = () => {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    await signup(data.name, data.email, data.password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center group">
          <BrandLogo size="xl" showTagline={false} />
        </Link>
        <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight">
          Create an account
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Start planning your next adventure with Travel Saarthi AI co-pilot.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl backdrop-blur-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <Input
                placeholder="John Doe"
                error={errors.name?.message}
                {...register('name')}
                className="bg-slate-950/60 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

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
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
                className="bg-slate-950/60 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
                className="bg-slate-950/60 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 shadow-lg shadow-blue-600/30 mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign Up & Get Started
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 font-bold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
