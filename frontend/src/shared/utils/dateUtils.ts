/**
 * Format a date to a readable string (e.g., "Sep 5, 2025")
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric', 
    year: 'numeric'
  });
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

/**
 * Format a date to show relative time (e.g., "Today", "Tomorrow", or the actual date)
 */
export const getRelativeDate = (date: Date): string => {
  if (isToday(date)) {
    return 'Today';
  }
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()) {
    return 'Tomorrow';
  }
  
  return formatDate(date);
};
