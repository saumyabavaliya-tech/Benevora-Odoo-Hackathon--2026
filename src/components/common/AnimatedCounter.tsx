import React, { useEffect, useState } from 'react';
import { formatCurrency } from '../../lib/utils';

interface AnimatedCounterProps {
  value: number;
  duration?: number; // ms
  prefix?: string;
  suffix?: string;
  isCurrency?: boolean;
  currency?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  prefix = '',
  suffix = '',
  isCurrency = false,
  currency = '₹',
  className,
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = 0;
    const endValue = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (endValue - startValue) * easeOut);
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  if (isCurrency) {
    return <span className={className}>{formatCurrency(displayValue, currency)}</span>;
  }

  return (
    <span className={className}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};
