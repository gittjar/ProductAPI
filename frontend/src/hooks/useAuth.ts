import { useState, useEffect } from 'react';
import { isAuthenticated } from '../utils/auth';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);
      setUsername(authenticated ? localStorage.getItem('username') : null);
    };

    checkAuth();

    // Check authentication status every 30 seconds
    const interval = setInterval(checkAuth, 30000);

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { isLoggedIn, username };
};
