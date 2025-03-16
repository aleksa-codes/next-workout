import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if code is running in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}
