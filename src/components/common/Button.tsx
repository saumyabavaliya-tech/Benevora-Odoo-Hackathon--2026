import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5 shadow-sm',
  };

  const variantStyles = {
    primary:
      'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 border border-blue-400/30 active:scale-[0.98] focus:ring-blue-500',
    secondary:
      'bg-white/15 hover:bg-white/25 text-white border border-white/10 active:scale-[0.98] focus:ring-slate-400 backdrop-blur-md',
    outline:
      'border border-white/20 hover:border-white/40 bg-slate-900/60 hover:bg-white/10 text-white active:scale-[0.98] focus:ring-slate-300 backdrop-blur-md',
    ghost:
      'text-slate-300 hover:text-white hover:bg-white/10 active:scale-[0.98] focus:ring-slate-300',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 border border-rose-400/30 active:scale-[0.98] focus:ring-rose-500',
    accent:
      'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30 active:scale-[0.98] focus:ring-indigo-500 backdrop-blur-md',
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
