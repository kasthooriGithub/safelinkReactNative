import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { Text, useTheme, TextInput, Button, IconButton, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function AddContactScreen({ navigation, route }) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [priority, setPriority] = useState('Medium');

  const onSave = () => {
    // Mock save logic
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
          <Text variant="titleLarge" style={styles.headerTitle}>Add Trusted Contact</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.iconSection}>
            <View style={[styles.profileIcon, { backgroundColor: theme.colors.primary + '10' }]}>
              <MaterialCommunityIcons name="account-plus" size={64} color={theme.colors.primary} />
            </View>
            <Text variant="bodyMedium" style={styles.infoText}>This person will receive an SMS if you trigger an SOS.</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              outlineColor="#E0E0E0"
              placeholder="e.g. John Doe"
            />
            <TextInput
              label="Relationship"
              value={relationship}
              onChangeText={setRelationship}
              mode="outlined"
              style={styles.input}
              outlineColor="#E0E0E0"
              placeholder="e.g. Father, Friend"
            />
            <TextInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              style={styles.input}
              outlineColor="#E0E0E0"
              keyboardType="phone-pad"
              placeholder="+1 234 567 890"
              left={<TextInput.Icon icon="phone" color={theme.colors.outline} />}
            />

            <View style={styles.prioritySection}>
              <Text variant="labelLarge" style={styles.priorityLabel}>Alert Priority</Text>
              <SegmentedButtons
                value={priority}
                onValueChange={setPriority}
                buttons={[
                  { value: 'Low', label: 'Low', showSelectedCheck: true },
                  { value: 'Medium', label: 'Med', showSelectedCheck: true },
                  { value: 'High', label: 'High', showSelectedCheck: true },
                ]}
                style={styles.segmentedButtons}
              />
              <Text variant="bodySmall" style={styles.priorityDesc}>
                High priority contacts are called automatically after the SMS alert.
              </Text>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={onSave}
            style={styles.saveButton}
            labelStyle={styles.saveButtonLabel}
            disabled={!name || !phone}
          >
            Save Contact
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  iconSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    textAlign: 'center',
    color: '#757575',
    paddingHorizontal: 40,
  },
  form: {
    gap: 16,
    marginVertical: 20,
  },
  input: {
    // Let Paper handle background color
  },
  prioritySection: {
    marginTop: 10,
  },
  priorityLabel: {
    marginBottom: 10,
    color: '#757575',
    fontWeight: 'bold',
  },
  segmentedButtons: {
    marginVertical: 10,
  },
  priorityDesc: {
    color: '#757575',
    marginTop: 8,
  },
  saveButton: {
    marginTop: 30,
    height: 56,
    justifyContent: 'center',
    borderRadius: 16,
  },
  saveButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
