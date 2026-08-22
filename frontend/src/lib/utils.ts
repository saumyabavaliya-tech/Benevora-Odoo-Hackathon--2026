import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, differenceInDays } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = '₹'): string {
  if (currency === 'INR' || currency === '₹') {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  if (currency === 'USD' || currency === '$') {
    return `$${amount.toLocaleString('en-US')}`;
  }
  if (currency === 'EUR' || currency === '€') {
    return `€${amount.toLocaleString('de-DE')}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
}

export function formatDateString(dateStr: string, formatPattern: string = 'MMM d, yyyy'): string {
  try {
    const date = parseISO(dateStr);
    return format(date, formatPattern);
  } catch {
    return dateStr;
  }
}

export function formatDateRange(startStr: string, endStr: string): string {
  try {
    const start = parseISO(startStr);
    const end = parseISO(endStr);
    const sameYear = start.getFullYear() === end.getFullYear();
    const sameMonth = sameYear && start.getMonth() === end.getMonth();

    if (sameMonth) {
      return `${format(start, 'MMM d')} – ${format(end, 'd, yyyy')}`;
    }
    if (sameYear) {
      return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
    }
    return `${format(start, 'MMM d, yyyy')} – ${format(end, 'MMM d, yyyy')}`;
  } catch {
    return `${startStr} – ${endStr}`;
  }
}

export function calculateTotalDays(startStr: string, endStr: string): number {
  try {
    const start = parseISO(startStr);
    const end = parseISO(endStr);
    return Math.max(1, differenceInDays(end, start) + 1);
  } catch {
    return 1;
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
