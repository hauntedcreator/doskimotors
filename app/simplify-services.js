/**
 * This utility script contains helper functions to simplify and optimize page rendering
 * for better performance across the application.
 */

// Helper function to delay loading of heavy resources
export function delayLoadResources(callback, delay = 1000) {
  if (typeof window === 'undefined') return;
  
  let timeoutId;
  
  // Use requestIdleCallback when available, fallback to setTimeout
  const scheduleWork = () => {
    if (window.requestIdleCallback) {
      timeoutId = window.requestIdleCallback(() => {
        callback();
      });
    } else {
      timeoutId = setTimeout(callback, delay);
    }
  };
  
  // Schedule after page has time to render
  setTimeout(scheduleWork, 0);
  
  // Return a cleanup function
  return () => {
    if (window.requestIdleCallback && timeoutId) {
      window.cancelIdleCallback(timeoutId);
    } else if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}

// Helper function to register page performance measurements
export function registerPageLoad(pageName) {
  if (typeof window === 'undefined') return () => {};
  
  // Mark the start of page content being visible
  const startTime = performance.now();
  
  // Log when page is ready
  console.log(`${pageName} page loaded`);
  
  // Fire a custom event that can be used to trigger other behaviors
  window.dispatchEvent(new CustomEvent('pageLoaded', { detail: { pageName } }));
  
  // Return function to mark and log completion
  return () => {
    const endTime = performance.now();
    console.log(`${pageName} page fully loaded in ${Math.round(endTime - startTime)}ms`);
  };
}

// Simplified animation variants that are less resource-intensive
export const simpleAnimations = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    transition: { duration: 0.3 }
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  }
};

// Force page refresh for specific routes that have loading issues
export function useRouteChangeHandler() {
  if (typeof window === 'undefined') return;
  
  const problematicRoutes = ['/services', '/about'];
  let currentPath = window.location.pathname;
  
  // Listen for navigation events
  window.addEventListener('popstate', () => {
    const newPath = window.location.pathname;
    
    // If navigating to a problematic route, force a full page reload
    if (problematicRoutes.includes(newPath) && newPath !== currentPath) {
      window.location.reload();
    }
    
    currentPath = newPath;
  });
}

export default {
  delayLoadResources,
  registerPageLoad,
  simpleAnimations,
  useRouteChangeHandler
}; 