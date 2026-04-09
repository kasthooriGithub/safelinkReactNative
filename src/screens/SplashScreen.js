import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <StatusBar style="light" />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="shield-outline" size={100} color={theme.colors.primary} />
        </View>
        <Text variant="displayMedium" style={styles.title}>SafeLink</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>Fast help when every second matters</Text>
      </Animated.View>
      <View style={styles.footer}>
        <ActivityIndicator animating={true} color="rgba(255, 255, 255, 0.5)" size="small" />
        <Text variant="bodySmall" style={styles.initText}>INITIALIZING SAFETY</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 160,
    height: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: 1.2,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  initText: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 15,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
});
