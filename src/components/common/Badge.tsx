import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'purple' | 'amber' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  icon,
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
  };

  const variantStyles = {
    primary: 'bg-blue-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-md',
    secondary: 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 backdrop-blur-md',
    success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-md',
    warning: 'bg-amber-500/20 text-amber-300 border border-amber-400/30 backdrop-blur-md',
    danger: 'bg-rose-500/20 text-rose-300 border border-rose-400/30 backdrop-blur-md',
    purple: 'bg-purple-500/20 text-purple-300 border border-purple-400/30 backdrop-blur-md',
    amber: 'bg-orange-500/20 text-orange-300 border border-orange-400/30 backdrop-blur-md',
    neutral: 'bg-white/10 text-slate-200 border border-white/15 backdrop-blur-md',
    outline: 'border border-white/20 text-slate-200 bg-slate-900/60 backdrop-blur-md',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full tracking-tight shrink-0 whitespace-nowrap',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
