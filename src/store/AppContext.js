import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasMedicalProfile, setHasMedicalProfile] = useState(false);
  const [userData, setUserData] = useState(null);

  // 3. Load user from AsyncStorage on boot
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        const storedProfileState = await AsyncStorage.getItem('hasMedicalProfile');
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
          setHasMedicalProfile(storedProfileState === 'true');
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to load session from AsyncStorage:", error);
      }
    };
    loadSession();
  }, []);

  const login = async (user, hasProfile) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      await AsyncStorage.setItem('hasMedicalProfile', String(hasProfile));
      setUserData(user);
      setHasMedicalProfile(hasProfile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to store user session:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('hasMedicalProfile');
      setUserData(null);
      setHasMedicalProfile(false);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Failed to clear user session:", error);
    }
  };

  const completeMedicalProfile = async () => {
    try {
      await AsyncStorage.setItem('hasMedicalProfile', 'true');
      setHasMedicalProfile(true);
    } catch (error) {
      console.error("Failed to set medical profile state:", error);
    }
  };

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
      logout,
      hasMedicalProfile,
      setHasMedicalProfile: completeMedicalProfile,
      userData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
