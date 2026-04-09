import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  const toggleDemoMode = (val) => {
    setIsDemoMode(val);
    if (val) setIsOffline(true);
  };

  const toggleDarkMode = (val) => {
    setIsDarkMode(val);
  };

  return (
    <AppContext.Provider value={{ 
      isDemoMode, 
      toggleDemoMode, 
      isOffline, 
      setIsOffline,
      isDarkMode,
      toggleDarkMode,
      isAuthenticated,
      login,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
