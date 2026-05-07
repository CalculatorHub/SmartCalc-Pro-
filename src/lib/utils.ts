import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Strips floating point errors from calculations
 */
export function strip(num: number): number {
  return parseFloat(num.toPrecision(12));
}

/**
 * Formats numbers with thousand separators
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(strip(num));
}

/**
 * Trigger haptic feedback if supported
 */
export function vibrate(pattern: number | number[] = 10) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

/**
 * Copy text to clipboard with feedback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    vibrate(20);
    return true;
  } catch (err) {
    console.error('Failed to copy team: ', err);
    return false;
  }
}
