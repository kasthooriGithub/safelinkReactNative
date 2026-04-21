import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, useTheme, TextInput, Button, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../store/AppContext';

export default function MedicalProfileFormScreen() {
  const theme = useTheme();
  const { userData, setHasMedicalProfile } = useApp();
  
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState('');
  const [conditions, setConditions] = useState('');
  const [medications, setMedications] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!bloodGroup) {
      Alert.alert("Required", "Blood Group is required for emergency safety.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch('http://192.168.1.10:5000/profile/medical', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userData?.id?.toString() || ''
        },
        body: JSON.stringify({
          blood_group: bloodGroup,
          allergies: allergies,
          medical_conditions: conditions,
          medications: medications,
          emergency_notes: notes
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save medical profile");
      }
      
      Alert.alert("Success", "Medical profile saved successfully!");
      setHasMedicalProfile(true);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="medical-bag" size={48} color="#EF4444" />
            </View>
            <Text variant="displaySmall" style={styles.title}>Medical Profile</Text>
            <Text variant="bodyLarge" style={styles.subtitle}>Please complete your emergency medical profile before proceeding. This information could save your life.</Text>
          </View>

          <Surface style={styles.form} elevation={2}>
            <TextInput
              label="Blood Group *"
              value={bloodGroup}
              onChangeText={setBloodGroup}
              placeholder="e.g. O+, A-, AB+"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="blood-bag" />}
            />
            
            <TextInput
              label="Allergies"
              value={allergies}
              onChangeText={setAllergies}
              placeholder="Any known allergies..."
              mode="outlined"
              multiline
              style={styles.input}
              left={<TextInput.Icon icon="peanut-outline" />}
            />

            <TextInput
              label="Medical Conditions"
              value={conditions}
              onChangeText={setConditions}
              placeholder="e.g. Asthma, Diabetes..."
              mode="outlined"
              multiline
              style={styles.input}
              left={<TextInput.Icon icon="heart-pulse" />}
            />

            <TextInput
              label="Current Medications"
              value={medications}
              onChangeText={setMedications}
              placeholder="e.g. Inhaler, Insulin..."
              mode="outlined"
              multiline
              style={styles.input}
              left={<TextInput.Icon icon="pill" />}
            />

            <TextInput
              label="Emergency Notes"
              value={notes}
              onChangeText={setNotes}
              placeholder="Where are your meds kept? Any special instructions?"
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              left={<TextInput.Icon icon="note-text-outline" />}
            />
          </Surface>

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
            contentStyle={styles.saveButtonContent}
            labelStyle={styles.saveButtonLabel}
            icon="content-save"
          >
            Save Profile & Continue
          </Button>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
  iconContainer: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#FEE2E2',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16
  },
  title: { fontWeight: '900', color: '#111827', marginBottom: 8, textAlign: 'center' },
  subtitle: { color: '#6B7280', textAlign: 'center', paddingHorizontal: 10, lineHeight: 22 },
  form: { padding: 20, borderRadius: 16, backgroundColor: '#FFF', marginBottom: 30, gap: 16 },
  input: { backgroundColor: '#FAFAFA' },
  saveButton: { borderRadius: 12, elevation: 4 },
  saveButtonContent: { height: 56 },
  saveButtonLabel: { fontSize: 16, fontWeight: 'bold' }
});
