import React from 'react';
import { Loader2, Compass } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className,
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-8 gap-3', className)}>
      <div className="relative flex items-center justify-center">
        <Compass className={cn('animate-spin text-blue-600', sizeMap[size])} />
      </div>
      {text && <p className="text-sm font-medium text-slate-500 animate-pulse">{text}</p>}
    </div>
  );
};
