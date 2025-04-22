
/**
 * Format view count to a readable format
 * Example: 1200 -> 1.2K, 1500000 -> 1.5M
 */
export const formatViewCount = (views: string | number): string => {
  const numViews = typeof views === 'string' ? parseInt(views.replace(/\D/g, ''), 10) : views;
  
  if (isNaN(numViews)) return '0 views';
  
  if (numViews >= 1000000) {
    return `${(numViews / 1000000).toFixed(1)}M views`;
  } else if (numViews >= 1000) {
    return `${(numViews / 1000).toFixed(1)}K views`;
  } else {
    return `${numViews} views`;
  }
};

/**
 * Format video duration to a readable format
 * Example: 135 -> 2:15, 3661 -> 1:01:01
 */
export const formatDuration = (duration: string): string => {
  // If already formatted (e.g. "12:34"), return as is
  if (duration.includes(':')) return duration;
  
  // If duration is not a number, return as is
  const seconds = parseInt(duration, 10);
  if (isNaN(seconds)) return duration;
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${padZero(minutes)}:${padZero(secs)}`;
  } else {
    return `${minutes}:${padZero(secs)}`;
  }
};

/**
 * Pad a number with leading zero if less than 10
 */
const padZero = (num: number): string => {
  return num < 10 ? `0${num}` : `${num}`;
};
