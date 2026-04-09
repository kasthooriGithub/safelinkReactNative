import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, ScrollView, Dimensions } from 'react-native';
import { Text, useTheme, Card, IconButton, Banner, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../store/AppContext';

const { width } = Dimensions.get('window');

const ActionCard = ({ icon, title, subtitle, color, onPress }) => {
  const theme = useTheme();
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.cardContent}>
        <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
          <MaterialCommunityIcons name={icon} size={32} color={color} />
        </View>
        <View style={styles.cardText}>
          <Text variant="titleMedium" style={styles.cardTitle}>{title}</Text>
          <Text variant="bodySmall" style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.outline} />
      </Card.Content>
    </Card>
  );
};

export default function HomeScreen({ navigation }) {
  const theme = useTheme();
  const { isOffline, setIsOffline } = useApp();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleSOS = () => {
    navigation.navigate('Emergency');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="dark" />
      <Banner
        visible={isOffline}
        actions={[{ label: 'Dismiss', onPress: () => setIsOffline(false) }]}
        icon={({ size }) => <MaterialCommunityIcons name="wifi-off" size={size} color={theme.colors.error} />}
        style={styles.banner}
      >
        Offline mode active — SMS and saved contacts still available.
      </Banner>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text variant="headlineSmall" style={styles.greeting}>Hello, User</Text>
            <Text variant="bodyMedium" style={styles.statusLabel}>Your status is <Text style={{ color: theme.colors.tertiary, fontWeight: 'bold' }}>SAFE</Text></Text>
          </View>
          <IconButton icon="bell-outline" size={28} onPress={() => navigation.navigate('History')} />
        </View>

        <View style={styles.sosContainer}>
          <View style={styles.sosButtonWrapper}>
            <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }], borderColor: theme.colors.primary + '40' }]} />
            <TouchableOpacity style={[styles.sosButton, { backgroundColor: theme.colors.primary }]} onPress={handleSOS} activeOpacity={0.8}>
              <MaterialCommunityIcons name="shield-alert" size={70} color="#FFF" style={styles.shieldIcon} />
              <Text variant="headlineLarge" style={styles.sosInnerLabel}>SOS</Text>
            </TouchableOpacity>
          </View>
          <Text variant="labelLarge" style={styles.sosText}>TAP IN EMERGENCY</Text>
        </View>

        <View style={styles.actionsGrid}>
          <ActionCard
            icon="police-badge"
            title="Call Police"
            subtitle="Local emergency response"
            color="#1976D2"
            onPress={() => { }}
          />
          <ActionCard
            icon="ambulance"
            title="Call Ambulance"
            subtitle="Medical emergency help"
            color={theme.colors.primary}
            onPress={() => { }}
          />
          <ActionCard
            icon="phone-account"
            title="Emergency Contact"
            subtitle="Primary trusted person"
            color={theme.colors.secondary}
            onPress={() => { }}
          />
          <ActionCard
            icon="map-marker-radius"
            title="Share Location"
            subtitle="Current live coordinates"
            color={theme.colors.tertiary}
            onPress={() => { }}
          />
        </View>

        <Card style={[styles.timerCard, { backgroundColor: theme.colors.surfaceVariant || '#F5F5F5', borderColor: theme.colors.outlineVariant || '#E0E0E0' }]} onPress={() => navigation.navigate('Timer')}>
          <Card.Content style={styles.timerContent}>
            <View style={styles.timerRow}>
              <MaterialCommunityIcons name="timer-outline" size={28} color={theme.colors.primary} />
              <View style={styles.timerText}>
                <Text variant="titleMedium">Safety Timer</Text>
                <Text variant="bodySmall">Auto-alert if you don't check in</Text>
              </View>
            </View>
            <Button mode="contained-tonal" compact={true}>Set Timer</Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    elevation: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  greeting: {
    fontWeight: 'bold',
  },
  statusLabel: {
    color: '#757575',
    marginTop: 4,
  },
  sosContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  sosButtonWrapper: {
    width: 260,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 20,
  },
  sosButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    borderWidth: 6,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  sosInnerLabel: {
    color: '#FFF',
    fontWeight: '900',
    marginTop: -5,
  },
  shieldIcon: {
    marginBottom: -5,
  },
  sosText: {
    marginTop: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#9E9E9E',
  },
  actionsGrid: {
    gap: 12,
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#757575',
  },
  timerCard: {
    borderRadius: 16,
    borderWidth: 1,
  },
  timerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    marginLeft: 16,
  },
});
