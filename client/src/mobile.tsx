import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { App as CapacitorApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';

// Initialize Capacitor
const initializeCapacitor = async () => {
  try {
    // Hide splash screen with fade effect
    await SplashScreen.hide({
      fadeOutDuration: 500
    });

    // Add Capacitor app class to body for mobile-specific styling
    document.body.classList.add('capacitor-app');
    
    // Handle back button on Android
    CapacitorApp.addListener('backButton', ({ canGoBack }: { canGoBack: boolean }) => {
      if (!canGoBack) {
        CapacitorApp.exitApp();
      } else {
        window.history.back();
      }
    });
    
    // Handle app state changes
    CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      // App went to background or came to foreground
      console.log('App state changed. Is active:', isActive);
    });
  } catch (error) {
    console.error('Error initializing Capacitor:', error);
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeCapacitor);

// Add a wrapper component to handle mobile-specific logic
const MobileApp = () => {
  // Force initial dark mode check on app start
  useEffect(() => {
    // Check if dark mode is saved in localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Apply dark mode if saved preference exists
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  return <App />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MobileApp />
  </React.StrictMode>
);