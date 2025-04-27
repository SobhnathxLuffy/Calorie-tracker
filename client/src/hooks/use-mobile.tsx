import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if running in Capacitor
    const isCapacitorApp = 
      window.location.href.includes('capacitor://') || 
      window.location.href.includes('ionic://') ||
      document.URL.startsWith('capacitor://') ||
      document.URL.startsWith('ionic://') ||
      // Detect mobile screen size
      window.innerWidth < 768;
    
    setIsMobile(isCapacitorApp);

    // Set a class on the html element for styling
    if (isCapacitorApp) {
      document.documentElement.classList.add('capacitor-app');
    }

    // Also listen for resize events to handle orientation changes
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}