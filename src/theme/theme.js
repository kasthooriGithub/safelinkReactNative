import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  displayLarge: { fontFamily: 'Roboto', fontSize: 57, lineHeight: 64, fontWeight: '400' },
  displayMedium: { fontFamily: 'Roboto', fontSize: 45, lineHeight: 52, fontWeight: '400' },
  displaySmall: { fontFamily: 'Roboto', fontSize: 36, lineHeight: 44, fontWeight: '400' },
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#E53935', // SOS Red
    secondary: '#FFC107', // Warning Yellow
    tertiary: '#4CAF50', // Safe Green
    error: '#B00020',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    onSurface: '#212121',
    outline: '#757575',
    surfaceVariant: '#F5F5F5',
    onSurfaceVariant: '#757575',
    outlineVariant: '#E0E0E0',
  },
  roundness: 12,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#EF5350',
    secondary: '#FFD54F',
    tertiary: '#66BB6A',
    error: '#CF6679',
    background: '#121212',
    surface: '#1E1E1E',
    onSurface: '#FFFFFF',
    outline: '#B0BEC5',
    surfaceVariant: '#2C2C2C',
    onSurfaceVariant: '#B0BEC5',
    outlineVariant: '#4E4E4E',
  },
  roundness: 12,
};
