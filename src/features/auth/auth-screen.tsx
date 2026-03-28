import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { setSecureItem } from '@/shared/infra/secure-storage';
import { useAuth } from '@/shared/infra/auth-context';

// \u2500\u2500\u2500 Types \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

type Mode = 'login' | 'register';

interface AuthScreenProps {
  mode: Mode;
}

interface FieldError {
  officerNumber?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

// \u2500\u2500\u2500 Constants \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

const ALLOWED_DOMAINS = [
  'melbourne.vic.gov.au',
  'gov.au',
  'vic.gov.au',
  'abs.gov.au',
  'ato.gov.au',
  'apo.gov.au',
];

// \u2500\u2500\u2500 Validation \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

function isGovAuEmail(email: string): boolean {
  const lower = email.toLowerCase().trim();
  const atIndex = lower.lastIndexOf('@');
  if (atIndex === -1) return false;
  const domain = lower.slice(atIndex + 1);
  return ALLOWED_DOMAINS.some(
    (allowed) => domain === allowed || domain.endsWith(`.${allowed}`)
  );
}

function validateOfficerNumber(value: string): string | undefined {
  if (!value.trim()) return 'Officer number is required';
  if (!/^\\d{2,4}$/.test(value.trim())) return 'Officer number must be 2\u20134 digits';
  return undefined;
}

function validateEmail(value: string): string | undefined {
  if (!value.trim()) return 'Email address is required';
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value.trim())) return 'Enter a valid email address';
  if (!isGovAuEmail(value)) {
    return 'Registration is restricted to government email addresses (@gov.au)';
  }
  return undefined;
}

function validatePassword(value: string): string | undefined {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  return undefined;
}

function validateConfirmPassword(password: string, confirm: string): string | undefined {
  if (!confirm) return 'Please confirm your password';
  if (password !== confirm) return 'Passwords do not match';
  return undefined;
}

// \u2500\u2500\u2500 Component \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

export default function AuthScreen({ mode }: AuthScreenProps) {
  const router = useRouter();
  const { login, register } = useAuth();

  const [officerNumber, setOfficerNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FieldError>({});
  const [loading, setLoading] = useState(false);

  const isLogin = mode === 'login';

  const validate = useCallback((): boolean => {
    const next: FieldError = {};

    const officerErr = validateOfficerNumber(officerNumber);
    if (officerErr) next.officerNumber = officerErr;

    if (!isLogin) {
      const emailErr = validateEmail(email);
      if (emailErr) next.email = emailErr;
    }

    const passwordErr = validatePassword(password);
    if (passwordErr) next.password = passwordErr;

    if (!isLogin) {
      const confirmErr = validateConfirmPassword(password, confirmPassword);
      if (confirmErr) next.confirmPassword = confirmErr;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [officerNumber, email, password, confirmPassword, isLogin]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    const officer = officerNumber.trim();
    const emailValue = email.toLowerCase().trim();

    try {
      const result = isLogin
        ? await login(officer, password)
        : await register(emailValue, officer, password, confirmPassword);

      if (!result.success) {
        setErrors({ general: result.error ?? (isLogin ? 'Login failed' : 'Registration failed') });
        return;
      }

      await setSecureItem('officer_number', officer);
      router.replace('/');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  }, [validate, isLogin, officerNumber, email, password, confirmPassword, login, register, router]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>MAPS</Text>
          <Text style={styles.subtitle}>Municipal Area Patrol System</Text>
          <Text style={styles.modeLine}>
            {isLogin ? 'Officer Sign In' : 'Officer Registration'}
          </Text>
        </View>

        {/* General error */}
        {errors.general ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{errors.general}</Text>
          </View>
        ) : null}

        {/* Form */}
        <View style={styles.form}>
          {/* Officer Number */}
          <View style={styles.field}>
            <Text style={styles.label}>Officer Number</Text>
            <TextInput
              style={[styles.input, errors.officerNumber ? styles.inputError : null]}
              value={officerNumber}
              onChangeText={setOfficerNumber}
              placeholder="e.g. 1234"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={4}
              returnKeyType="next"
              testID="input-officer-number"
            />
            {errors.officerNumber ? (
              <Text style={styles.fieldError}>{errors.officerNumber}</Text>
            ) : null}
          </View>

          {/* Email \u2014 registration only */}
          {!isLogin && (
            <View style={styles.field}>
              <Text style={styles.label}>Government Email Address</Text>
              <TextInput
                style={[styles.input, errors.email ? styles.inputError : null]}
                value={email}
                onChangeText={setEmail}
                placeholder="officer@melbourne.vic.gov.au"
                placeholderTextColor="#6B7280"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                testID="input-email"
              />
              {errors.email ? (
                <Text style={styles.fieldError}>{errors.email}</Text>
              ) : null}
              <Text style={styles.hint}>
                Restricted to @gov.au email addresses
              </Text>
            </View>
          )}

          {/* Password */}
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              value={password}
              onChangeText={setPassword}
              placeholder={isLogin ? 'Enter password' : 'Minimum 8 characters'}
              placeholderTextColor="#6B7280"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType={isLogin ? 'done' : 'next'}
              onSubmitEditing={isLogin ? handleSubmit : undefined}
              testID="input-password"
            />
            {errors.password ? (
              <Text style={styles.fieldError}>{errors.password}</Text>
            ) : null}
          </View>

          {/* Confirm Password \u2014 registration only */}
          {!isLogin && (
            <View style={styles.field}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.confirmPassword ? styles.inputError : null,
                ]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter password"
                placeholderTextColor="#6B7280"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                testID="input-confirm-password"
              />
              {errors.confirmPassword ? (
                <Text style={styles.fieldError}>{errors.confirmPassword}</Text>
              ) : null}
            </View>
          )}

          {/* Submit */}
          <TouchableOpacity
            style={[styles.button, loading ? styles.buttonDisabled : null]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
            testID="btn-submit"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Mode toggle */}
          <TouchableOpacity
            style={styles.toggle}
            onPress={() => router.replace(isLogin ? '/register' : '/login')}
            testID="btn-toggle-mode"
          >
            <Text style={styles.toggleText}>
              {isLogin
                ? "Don't have an account? Register"
                : 'Already have an account? Sign in'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          City of Melbourne \u2014 Parking Enforcement
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  modeLine: {
    fontSize: 18,
    fontWeight: '600',
    color: '#60A5FA',
    marginTop: 24,
  },
  errorBanner: {
    backgroundColor: '#7F1D1D',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorBannerText: {
    color: '#FCA5A5',
    fontSize: 14,
    lineHeight: 20,
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D1D5DB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#F9FAFB',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  fieldError: {
    fontSize: 12,
    color: '#F87171',
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
  },
  button: {
    backgroundColor: '#1D4ED8',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  toggle: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  toggleText: {
    color: '#60A5FA',
    fontSize: 14,
  },
  footer: {
    textAlign: 'center',
    color: '#374151',
    fontSize: 12,
    marginTop: 40,
  },
});
