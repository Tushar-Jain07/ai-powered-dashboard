/**
 * Format a number as currency
 * @param value The number to format
 * @param currency The currency code (default: USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
};

/**
 * Format a number with commas
 * @param value The number to format
 * @param decimals The number of decimal places (default: 0)
 * @returns Formatted number string
 */
export const formatNumber = (value: number, decimals = 0): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format a date
 * @param date The date to format
 * @param format The format to use (default: 'short')
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | number,
  format: 'short' | 'long' | 'full' | 'relative' = 'short'
): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  switch (format) {
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'full':
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    case 'relative':
      return formatRelativeTime(dateObj);
    default:
      return dateObj.toLocaleDateString('en-US');
  }
};

/**
 * Format a date as relative time (e.g., "2 hours ago")
 * @param date The date to format
 * @returns Relative time string
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);
  
  if (diffSec < 60) {
    return diffSec <= 1 ? 'just now' : `${diffSec} seconds ago`;
  } else if (diffMin < 60) {
    return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
  } else if (diffHour < 24) {
    return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
  } else if (diffDay < 30) {
    return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
  } else if (diffMonth < 12) {
    return diffMonth === 1 ? '1 month ago' : `${diffMonth} months ago`;
  } else {
    return diffYear === 1 ? '1 year ago' : `${diffYear} years ago`;
  }
};

/**
 * Format a percentage
 * @param value The value to format as percentage
 * @param decimals The number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals = 1): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format bytes to human-readable string
 * @param bytes The bytes value
 * @param decimals The number of decimal places (default: 2)
 * @returns Formatted bytes string
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Truncate text with ellipsis
 * @param text The text to truncate
 * @param maxLength The maximum length (default: 50)
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength = 50): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}; 