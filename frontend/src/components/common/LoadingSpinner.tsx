import React from 'react';
import { BrandIcon } from './BrandLogo';
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
  const sizePxMap = {
    sm: 28,
    md: 44,
    lg: 60,
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-8 gap-3 select-none', className)}>
      <div className="relative flex items-center justify-center">
        <BrandIcon sizePx={sizePxMap[size]} animate={true} />
      </div>
      {text && <p className="text-xs font-semibold tracking-wide text-slate-400 animate-pulse">{text}</p>}
    </div>
  );
};
