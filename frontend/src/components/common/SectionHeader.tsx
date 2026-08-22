import React from 'react';
import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  action,
  className,
}) => {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6', className)}>
      <div>
        {badge && (
          <span className="inline-block px-2.5 py-0.5 mb-2 text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-500/20 rounded-full border border-blue-400/30 backdrop-blur-md">
            {badge}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl font-normal">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
