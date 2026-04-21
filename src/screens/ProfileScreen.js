import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Animated, Alert, ActivityIndicator } from 'react-native';
import { Text, useTheme, TextInput, Button, Card, IconButton, Divider, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../store/AppContext';

export default function ProfileScreen() {
  const theme = useTheme();
  const { userData } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: userData?.full_name || '',
    bloodGroup: '',
    allergies: '',
    conditions: '',
    medications: '',
    notes: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://192.168.1.10:5000/profile', {
        headers: { 'x-user-id': userData?.id?.toString() || '' }
      });
      const data = await response.json();
      if (response.ok && data) {
        setProfile({
          name: data.personal?.full_name || '',
          bloodGroup: data.medical?.blood_group || '',
          allergies: data.medical?.allergies || '',
          conditions: data.medical?.medical_conditions || '',
          medications: data.medical?.medications || '',
          notes: data.medical?.emergency_notes || ''
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      // Assuming you only want to save medical data from this screen according to requirement
      const response = await fetch('http://192.168.1.10:5000/profile/medical', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': userData?.id?.toString() || '' 
        },
        body: JSON.stringify({
          blood_group: profile.bloodGroup,
          allergies: profile.allergies,
          medical_conditions: profile.conditions,
          medications: profile.medications,
          emergency_notes: profile.notes
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>Medical Profile</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Critical info for first responders</Text>
        </View>

        <Surface style={[styles.previewCard, { backgroundColor: theme.colors.primary }]} elevation={4}>
          <View style={styles.previewHeader}>
            <MaterialCommunityIcons name="medical-bag" size={32} color="#FFF" />
            <Text variant="titleMedium" style={styles.previewTitle}>EMERGENCY CARD</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.previewContent}>
            <View style={styles.previewRow}>
              <View style={styles.previewItem}>
                <Text variant="labelSmall" style={styles.previewLabel}>NAME</Text>
                <Text variant="titleMedium" style={styles.previewText}>{profile.name}</Text>
              </View>
              <View style={styles.previewItem}>
                <Text variant="labelSmall" style={styles.previewLabel}>BLOOD GROUP</Text>
                <Text variant="headlineSmall" style={styles.previewText}>{profile.bloodGroup || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.previewItem}>
              <Text variant="labelSmall" style={styles.previewLabel}>ALLERGIES</Text>
              <Text variant="bodyMedium" style={styles.previewText}>{profile.allergies || 'None'}</Text>
            </View>
          </View>
        </Surface>

        <View style={styles.form}>
          <TextInput
            label="Full Name"
            value={profile.name}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
            mode="outlined"
            style={styles.input}
            disabled // Not updating user's personal details down this route per design
          />
          <TextInput
            label="Blood Group"
            value={profile.bloodGroup}
            onChangeText={(text) => setProfile({ ...profile, bloodGroup: text })}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Allergies"
            value={profile.allergies}
            onChangeText={(text) => setProfile({ ...profile, allergies: text })}
            mode="outlined"
            multiline={true}
            style={styles.input}
          />
          <TextInput
            label="Medical Conditions"
            value={profile.conditions}
            onChangeText={(text) => setProfile({ ...profile, conditions: text })}
            mode="outlined"
            multiline={true}
            style={styles.input}
          />
          <TextInput
            label="Medications"
            value={profile.medications}
            onChangeText={(text) => setProfile({ ...profile, medications: text })}
            mode="outlined"
            multiline={true}
            style={styles.input}
          />
          <TextInput
            label="Emergency Notes"
            value={profile.notes}
            onChangeText={(text) => setProfile({ ...profile, notes: text })}
            mode="outlined"
            multiline={true}
            numberOfLines={4}
            style={styles.input}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleUpdate}
          loading={isSaving}
          disabled={isSaving}
          style={styles.saveButton}
          labelStyle={styles.saveButtonLabel}
          icon="check-circle"
        >
          Update Profile
        </Button>
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
  previewCard: {
    margin: 20,
    borderRadius: 24,
    padding: 20,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  previewTitle: {
    color: '#FFF',
    marginLeft: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    height: 1,
    marginBottom: 15,
  },
  previewContent: {
    gap: 15,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  previewItem: {
    flex: 1,
  },
  previewLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: 'bold',
  },
  previewText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
    gap: 16,
  },
  input: {
    // Let Paper handle background color
  },
  saveButton: {
    margin: 20,
    height: 56,
    justifyContent: 'center',
    borderRadius: 16,
  },
  saveButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
