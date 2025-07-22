import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names with Tailwind CSS compatibility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCurrencySymbol(currencyCode: string): string {
  switch (currencyCode) {
    case 'USD': return '$';
    case 'INR': return '₹';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'JPY': return '¥';
    default: return '$'; // Default to $ if currency code is unknown
  }
}

/**
 * Returns a safe image source URL, with a fallback for empty values
 * Works with both string URLs and File objects
 */
export function getSafeImageSrc(source: string | File | Blob | undefined): string {
  if (!source) return "https://placehold.co/600x400?text=No+Image";
  
  // If it's already a string URL, return it
  if (typeof source === 'string') {
    return source;
  }
  
  // If it's a File or Blob object, create an object URL
  if (source instanceof File || source instanceof Blob) {
    return URL.createObjectURL(source);
  }
  
  return "https://placehold.co/600x400?text=No+Image";
}

/**
 * Truncates text to a specific length and adds ellipsis
 */
export function truncateText(text: string | undefined, maxLength: number): string {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

 /**
 * Formats a number as currency with the specified currency code
 * @param amount The amount to format
 * @param currency The currency code (e.g., 'USD', 'EUR', 'INR')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
};