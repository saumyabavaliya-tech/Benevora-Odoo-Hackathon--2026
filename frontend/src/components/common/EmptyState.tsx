import React from 'react';
import { Compass } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-slate-100/80 shadow-xs max-w-lg mx-auto',
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 shadow-inner">
        {icon || <Compass className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">{description}</p>
      {actionText && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} variant="primary" size="md">
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
