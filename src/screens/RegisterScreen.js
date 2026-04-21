import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { Text, useTheme, TextInput, Button, Checkbox } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../store/AppContext';

export default function RegisterScreen({ navigation }) {
  const theme = useTheme();
  const { login } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      console.log(`[Register API] Attempting fetch to http://192.168.1.10:5000/auth/register`);
      const response = await fetch('http://192.168.1.10:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: name, email: email.trim(), phone, password })
      });

      console.log(`[Register API] HTTP Response Status:`, response.status);
      const data = await response.json();
      console.log(`[Register API] Parsed JSON Data:`, data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || "Registration failed");
      }

      console.log(`[Register API] Success! Triggering AppContext login().`);
      // Since our backend returns { success, user: { id, full_name, email, phone }, hasMedicalProfile }
      await login(data.user, data.hasMedicalProfile);
      
    } catch (error) {
      console.error(`[Register API] Exception Caught:`, error);
      Alert.alert("Registration Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text variant="displaySmall" style={styles.title}>Create Account</Text>
            <Text variant="bodyLarge" style={styles.subtitle}>Join SafeLink for instant protection</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text variant="labelMedium" style={styles.inputLabel}>FULL NAME</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="John Doe"
                mode="outlined"
                style={styles.input}
                outlineStyle={styles.inputOutline}
                left={<TextInput.Icon icon="account-outline" color={theme.colors.outline} />}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text variant="labelMedium" style={styles.inputLabel}>EMAIL ADDRESS</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                outlineStyle={styles.inputOutline}
                left={<TextInput.Icon icon="email-outline" color={theme.colors.outline} />}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text variant="labelMedium" style={styles.inputLabel}>PHONE NUMBER</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+1 234 567 8900"
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
                outlineStyle={styles.inputOutline}
                left={<TextInput.Icon icon="phone-outline" color={theme.colors.outline} />}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text variant="labelMedium" style={styles.inputLabel}>PASSWORD</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                outlineStyle={styles.inputOutline}
                left={<TextInput.Icon icon="lock-outline" color={theme.colors.outline} />}
                right={
                  <TextInput.Icon 
                    icon={showPassword ? "eye-off" : "eye"} 
                    color={theme.colors.outline}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            </View>

            <View style={styles.checkboxContainer}>
              <Checkbox.Android 
                status={agreed ? 'checked' : 'unchecked'}
                onPress={() => setAgreed(!agreed)}
                color={theme.colors.primary}
              />
              <Text variant="bodySmall" style={styles.checkboxText}>
                I agree to the <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Terms of Service</Text> and <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Privacy Policy</Text>.
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              mode="contained"
              onPress={handleRegister}
              loading={isLoading}
              style={[styles.registerButton, { backgroundColor: theme.colors.primary }]}
              contentStyle={[styles.registerButtonContent, { flexDirection: 'row-reverse' }]}
              labelStyle={styles.registerButtonLabel}
              icon="arrow-right"
              disabled={!agreed || isLoading}
            >
              Create Account
            </Button>

            <View style={styles.loginContainer}>
              <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text variant="bodyMedium" style={[styles.loginText, { color: theme.colors.primary }]}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 30,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6B7280',
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#FAFAFA',
  },
  inputOutline: {
    borderRadius: 16,
    borderColor: '#E5E7EB',
    borderWidth: 1.5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 20,
  },
  checkboxText: {
    color: '#6B7280',
    flex: 1,
  },
  footer: {
    marginTop: 10,
  },
  registerButton: {
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  registerButtonContent: {
    height: 64,
  },
  registerButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  loginText: {
    fontWeight: 'bold',
  },
});
