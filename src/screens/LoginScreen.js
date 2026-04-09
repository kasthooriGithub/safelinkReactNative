import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Text, useTheme, TextInput, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../store/AppContext';

export default function LoginScreen({ navigation }) {
  const theme = useTheme();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // In a real app, authenticate here
    login();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons name="shield-outline" size={48} color="#FFF" />
            </View>
            <Text variant="displaySmall" style={styles.title}>Welcome Back</Text>
            <Text variant="bodyLarge" style={styles.subtitle}>Log in to your SafeLink account</Text>
          </View>

          <View style={styles.form}>
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

            <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => {}}>
              <Text variant="labelLarge" style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Button
              mode="contained"
              onPress={handleLogin}
              style={[styles.loginButton, { backgroundColor: theme.colors.primary }]}
              contentStyle={[styles.loginButtonContent, { flexDirection: 'row-reverse' }]}
              labelStyle={styles.loginButtonLabel}
              icon="arrow-right"
            >
              Log In
            </Button>

            <View style={styles.registerContainer}>
              <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text variant="bodyMedium" style={[styles.registerText, { color: theme.colors.primary }]}>Register Now</Text>
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
    alignItems: 'flex-start',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EF4444', // Red logo background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    elevation: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    marginBottom: 30,
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
  forgotPasswordContainer: {
    alignItems: 'flex-start',
    marginTop: 5,
  },
  forgotPasswordText: {
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
  },
  loginButton: {
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loginButtonContent: {
    height: 64,
  },
  loginButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  registerText: {
    fontWeight: 'bold',
  },
});
