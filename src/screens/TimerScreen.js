import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Text, useTheme, Button, IconButton, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const PresetButton = ({ minutes, active, onPress }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.presetBtn,
        { backgroundColor: active ? theme.colors.primary : theme.colors.surfaceVariant || '#F5F5F5', borderColor: active ? theme.colors.primary : theme.colors.outlineVariant || '#E0E0E0' }
      ]}
    >
      <Text variant="titleMedium" style={{ color: active ? '#FFF' : theme.colors.onSurfaceVariant || '#757575', fontWeight: 'bold' }}>{minutes}m</Text>
    </TouchableOpacity>
  );
};

export default function TimerScreen({ navigation }) {
  const theme = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(15);
  const [timeLeft, setTimeLeft] = useState(selectedPreset * 60);
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const size = 260;
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
      
      // Animate progress
      const progress = (selectedPreset * 60 - (timeLeft - 1)) / (selectedPreset * 60);
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false, // SVG props don't support native driver on Android
      }).start();

    } else if (timeLeft === 0) {
      clearInterval(interval);
      navigation.navigate('Emergency');
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsActive(true);
    progressAnim.setValue((selectedPreset * 60 - timeLeft) / (selectedPreset * 60));
  };

  const stopTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedPreset * 60);
    progressAnim.setValue(0);
  };

  const handlePreset = (mins) => {
    setSelectedPreset(mins);
    setTimeLeft(mins * 60);
    setIsActive(false);
    progressAnim.setValue(0);
  };

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
        <Text variant="titleLarge" style={styles.headerTitle}>Safety Timer</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="shield-check" size={48} color={theme.colors.tertiary} />
          <Text variant="headlineSmall" style={styles.infoTitle}>Safe Arrival Check-in</Text>
          <Text variant="bodyMedium" style={styles.infoDesc}>
            If you do not confirm safety before the timer ends, an SOS alert will be triggered to your contacts.
          </Text>
        </View>

        <View style={styles.timerWrapper}>
          <Svg width={size} height={size} style={styles.svg}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={theme.colors.surfaceVariant || "#F5F5F5"}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={isActive ? theme.colors.primary : theme.colors.secondary}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
          <Surface style={styles.timerContent} elevation={0}>
            <Text variant="displayLarge" style={[styles.timerText, { color: isActive ? theme.colors.primary : theme.colors.outline }]}>
              {formatTime(timeLeft)}
            </Text>
            <Text variant="labelLarge" style={styles.timerStatus}>
              {isActive ? 'TIMER RUNNING' : 'SET DURATION'}
            </Text>
          </Surface>
        </View>

        <View style={styles.presets}>
          <PresetButton minutes={15} active={selectedPreset === 15} onPress={() => handlePreset(15)} />
          <PresetButton minutes={30} active={selectedPreset === 30} onPress={() => handlePreset(30)} />
          <PresetButton minutes={60} active={selectedPreset === 60} onPress={() => handlePreset(60)} />
        </View>

        <View style={styles.footer}>
          {!isActive ? (
            <Button
              mode="contained"
              onPress={startTimer}
              style={styles.mainButton}
              labelStyle={styles.buttonLabel}
            >
              Start Safety Timer
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={stopTimer}
              style={[styles.mainButton, { backgroundColor: theme.colors.tertiary }]}
              labelStyle={styles.buttonLabel}
            >
              I am Safe (Stop)
            </Button>
          )}
          <Text variant="bodySmall" style={styles.disclaimer}>
            Make sure your phone is charged and has signal if you expect to be offline.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  headerTitle: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  infoBox: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  infoDesc: {
    textAlign: 'center',
    color: '#757575',
    lineHeight: 22,
  },
  timerWrapper: {
    width: 260,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  svg: {
    position: 'absolute',
  },
  timerContent: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontWeight: '900',
    letterSpacing: 2,
  },
  timerStatus: {
    marginTop: 5,
    color: '#757575',
    letterSpacing: 1,
  },
  presets: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 40,
  },
  presetBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  footer: {
    width: '100%',
    marginTop: 'auto',
  },
  mainButton: {
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  disclaimer: {
    textAlign: 'center',
    color: '#757575',
    marginTop: 15,
    paddingHorizontal: 40,
  },
});
