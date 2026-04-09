import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme as lightTheme, darkTheme } from './src/theme/theme';
import RootNavigator from './src/navigation/RootNavigator';
import { AppProvider, useApp } from './src/store/AppContext';

function MainApp() {
  const { isDarkMode } = useApp();
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={currentTheme}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </SafeAreaProvider>
  );
}
