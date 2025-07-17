import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated } from '../utils/auth';

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const checkAuth = () => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);
    setUsername(authenticated ? localStorage.getItem('username') : null);
  };

  const login = (token: string, user: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', user);
    setIsLoggedIn(true);
    setUsername(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername(null);
    window.location.href = '/login';
  };

  useEffect(() => {
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

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
