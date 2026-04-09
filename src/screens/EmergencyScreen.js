import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Text, useTheme, Button, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const StatusItem = ({ icon, label, status, color }) => {
  const theme = useTheme();
  return (
    <View style={styles.statusItem}>
      <View style={[styles.statusIcon, { backgroundColor: color + '20' }]}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <Text variant="bodyLarge" style={styles.statusLabel}>{label}</Text>
      {status === 'loading' ? (
        <Animated.View style={styles.loader} />
      ) : (
        <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.tertiary} />
      )}
    </View>
  );
};

export default function EmergencyScreen({ navigation }) {
  const theme = useTheme();
  const flashAnim = useRef(new Animated.Value(0)).current;
  const [status, setStatus] = useState({
    sms: 'loading',
    location: 'loading',
    call: 'pending',
  });

  useEffect(() => {
    // Flashing background animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 1, duration: 400, useNativeDriver: false }),
        Animated.timing(flashAnim, { toValue: 0, duration: 400, useNativeDriver: false }),
      ])
    ).start();

    // Simulate status updates
    setTimeout(() => setStatus(s => ({ ...s, sms: 'sent' })), 2000);
    setTimeout(() => setStatus(s => ({ ...s, location: 'shared' })), 3500);
  }, []);

  const backgroundColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.primary, theme.colors.secondary],
  });

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <IconButton icon="close" iconColor="#FFF" size={32} onPress={goBack} />
        </View>

        <View style={styles.content}>
          <MaterialCommunityIcons name="alert" size={100} color="#FFF" style={styles.mainIcon} />
          <Text variant="displaySmall" style={styles.title}>EMERGENCY ALERT SENT</Text>
          <Text variant="bodyLarge" style={styles.subtitle}>Your contacts and emergency services have been notified.</Text>

          <View style={[styles.statusBox, { backgroundColor: theme.colors.surface }]}>
            <StatusItem
              icon="message-text"
              label="SMS Notification"
              status={status.sms}
              color={theme.colors.primary}
            />
            <StatusItem
              icon="map-marker"
              label="Location Sharing"
              status={status.location}
              color="#1976D2"
            />
            <StatusItem
              icon="phone"
              label="Emergency Services"
              status={status.call}
              color={theme.colors.tertiary}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            mode="contained"
            buttonColor="#FFF"
            textColor={theme.colors.primary}
            style={styles.actionButton}
            labelStyle={styles.buttonLabel}
            onPress={() => {}}
          >
            Call 911 Now
          </Button>
          <View style={styles.row}>
            <Button
              mode="outlined"
              textColor="#FFF"
              style={[styles.smallButton, { borderColor: '#FFF' }]}
              onPress={() => {}}
            >
              Resend
            </Button>
            <Button
              mode="text"
              textColor="rgba(255, 255, 255, 0.8)"
              onPress={goBack}
            >
              Cancel Alert
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'flex-end',
    padding: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  mainIcon: {
    marginBottom: 30,
  },
  title: {
    color: '#FFF',
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 28,
  },
  statusBox: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    elevation: 10,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  statusLabel: {
    flex: 1,
    fontWeight: 'bold',
  },
  loader: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderTopColor: '#1976D2',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  actionButton: {
    height: 60,
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom: 15,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallButton: {
    flex: 0.6,
    borderRadius: 15,
  },
});
