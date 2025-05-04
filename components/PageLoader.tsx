import React, { useState, useEffect } from 'react';

const PageLoader = ({ children }: { children: React.ReactNode }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Mark as loaded after DOM is ready
    setIsLoaded(true);

    // Force any lagging resources to load
    const timer = setTimeout(() => {
      const event = new Event('resourcesloaded');
      window.dispatchEvent(event);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PageLoader; 