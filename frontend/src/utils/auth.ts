// Token utilities for handling JWT expiration
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true; // If token is malformed, consider it expired
  }
};

export const getTokenExpirationTime = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convert to milliseconds
  } catch (error) {
    return null;
  }
};

export const isTokenExpiringSoon = (token: string, minutesBeforeExpiry: number = 5): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const expirationTime = payload.exp;
    const timeUntilExpiry = expirationTime - currentTime;
    return timeUntilExpiry < (minutesBeforeExpiry * 60);
  } catch (error) {
    return true;
  }
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  if (isTokenExpired(token)) {
    // Token is expired, remove it from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    return false;
  }
  
  return true;
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  // Trigger a storage event to notify other tabs/components
  window.dispatchEvent(new Event('storage'));
  window.location.href = '/login';
};
