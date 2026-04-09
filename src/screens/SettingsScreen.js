import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, useTheme, List, Switch, Divider, Button, IconButton, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../store/AppContext';

const SettingItem = ({ icon, title, description, value, onToggle, type = 'switch' }) => {
  const theme = useTheme();
  return (
    <List.Item
      title={title}
      description={description}
      left={props => <List.Icon {...props} icon={icon} color={theme.colors.primary} />}
      right={() => 
        type === 'switch' ? (
          <Switch value={value} onValueChange={onToggle} color={theme.colors.primary} />
        ) : (
          <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.outline} />
        )
      }
      style={styles.settingItem}
    />
  );
};

export default function SettingsScreen() {
  const theme = useTheme();
  const { isDemoMode, toggleDemoMode, isDarkMode, toggleDarkMode, logout } = useApp();
  const [settings, setSettings] = useState({
    alarm: true,
    flashlight: false,
    autoSMS: true,
    autoCall: false,
  });

  const toggle = (key) => setSettings({ ...settings, [key]: !settings[key] });

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of SafeLink?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", onPress: logout, style: "destructive" }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>Settings</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Configure your safety preferences</Text>
        </View>

        <List.Section>
          <List.Subheader>EMERGENCY ACTIONS</List.Subheader>
          <SettingItem
            icon="volume-high"
            title="Alarm Sound"
            description="Play loud siren during SOS"
            value={settings.alarm}
            onToggle={() => toggle('alarm')}
          />
          <SettingItem
            icon="flashlight"
            title="Flashlight Signal"
            description="Flash device light SOS pattern"
            value={settings.flashlight}
            onToggle={() => toggle('flashlight')}
          />
          <SettingItem
            icon="message-text-outline"
            title="Auto SMS"
            description="Send location SMS immediately"
            value={settings.autoSMS}
            onToggle={() => toggle('autoSMS')}
          />
          <SettingItem
            icon="phone-outline"
            title="Auto Call"
            description="Call emergency contacts automatically"
            value={settings.autoCall}
            onToggle={() => toggle('autoCall')}
          />
        </List.Section>

        <Divider style={styles.divider} />

        <List.Section>
          <List.Subheader>SIMULATION & DEMO</List.Subheader>
          <SettingItem
            icon="test-tube"
            title="Demo Mode"
            description="Simulate offline status globally"
            value={isDemoMode}
            onToggle={toggleDemoMode}
          />
        </List.Section>

        <Divider style={styles.divider} />

        <List.Section>
          <List.Subheader>APP PREFERENCES</List.Subheader>
          <SettingItem
            icon="theme-light-dark"
            title="Dark Mode"
            description="Toggle app appearance"
            value={isDarkMode}
            onToggle={toggleDarkMode}
          />
          <SettingItem
            icon="translate"
            title="Language"
            description="English (United States)"
            type="link"
          />
        </List.Section>

        <Divider style={styles.divider} />

        <List.Section>
          <List.Subheader>ABOUT</List.Subheader>
          <List.Item
            title="SafeLink v1.0.4"
            description="Reliable help when you need it most."
            left={props => <Avatar.Icon {...props} icon="shield-check" size={40} style={{ backgroundColor: theme.colors.primary }} />}
          />
          <View style={styles.footerButtons}>
            <Button mode="text" style={styles.bottomBtn}>Privacy Policy</Button>
            <Button mode="text" style={styles.bottomBtn}>Terms of Service</Button>
          </View>
        </List.Section>

        <View style={styles.logoutContainer}>
          <Button 
            mode="outlined" 
            onPress={handleLogout} 
            textColor={theme.colors.error}
            style={[styles.logoutButton, { borderColor: theme.colors.error }]}
            icon="logout"
          >
            Log Out
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#757575',
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  settingItem: {
    paddingVertical: 8,
  },
  divider: {
    marginVertical: 10,
    backgroundColor: '#E0E0E0',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  bottomBtn: {
    marginHorizontal: 10,
  },
  logoutContainer: {
    padding: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.5,
  },
});
