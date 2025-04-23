
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
export const formatDuration = (duration: string | number): string => {
  // If already formatted (e.g. "12:34"), return as is
  if (typeof duration === 'string' && duration.includes(':')) return duration;
  
  // Convert to number if it's a string
  const seconds = typeof duration === 'string' ? parseInt(duration, 10) : duration;
  
  // If duration is not a valid number, return as is
  if (isNaN(seconds)) return typeof duration === 'string' ? duration : '0:00';
  
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
 * Toggle fullscreen for a given element
 */
export const toggleFullscreen = (element: HTMLElement | null): void => {
  if (!element) return;

  if (!document.fullscreenElement) {
    // Enter fullscreen
    if (element.requestFullscreen) {
      element.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    }
  } else {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  }
};

/**
 * Pad a number with leading zero if less than 10
 */
const padZero = (num: number): string => {
  return num < 10 ? `0${num}` : `${num}`;
};
