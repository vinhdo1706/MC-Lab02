import { useRef, useState } from 'react';
import { router } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../../components/AppButton';
import { FormInput } from '../../components/FormInput';
import { theme } from '../../constants/theme';
import { useAuth } from './AuthContext';

export function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inFlight = useRef(false);

  async function handleLogin() {
    if (inFlight.current) return;

    if (!username.trim() || !password) {
      setError('Please enter username and password.');
      return;
    }

    inFlight.current = true;
    setLoading(true);
    setError('');

    try {
      const member = await login(username, password);
      if (member) {
        router.replace('/fitness');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch {
      setError('Unable to sign in. Please try again.');
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.brandIcon}>
            <Text style={styles.brandLetter}>F</Text>
          </View>
          <Text style={styles.heading}>Fitness Pocket</Text>
          <Text style={styles.subtitle}>Your training, all in one place.</Text>

          <View style={styles.card}>
            <Text style={styles.cardHeading}>Member Login</Text>
            <Text style={styles.cardSubheading}>Sign in to view your membership and sessions.</Text>

            <FormInput
              label="Username"
              value={username}
              onChangeText={(text) => { setUsername(text); setError(''); }}
              placeholder="Enter your username"
              editable={!loading}
            />
            <FormInput
              label="Password"
              value={password}
              onChangeText={(text) => { setPassword(text); setError(''); }}
              placeholder="Enter your password"
              secureTextEntry
              editable={!loading}
            />

            {error ? (
              <View style={styles.errorBox}>
                <Text accessibilityRole="alert" style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <AppButton
              title={loading ? 'Checking...' : 'Log In'}
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
            />
          </View>

          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>DEMO ACCOUNT</Text>
            <Text style={styles.demoLine}>Username: fitmember01</Text>
            <Text style={styles.demoLine}>Password: 123456</Text>
          </View>
          <Text style={styles.footer}>Local demo for MC-Lab02 · No real account required</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingBottom: 30 },
  brandIcon: { height: 64, width: 64, borderRadius: 20, backgroundColor: theme.colors.primary,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16 },
  brandLetter: { fontSize: 38, fontWeight: '800', color: '#FFFFFF' },
  heading: { textAlign: 'center', fontSize: 29, fontWeight: '800', color: theme.colors.ink },
  subtitle: { textAlign: 'center', fontSize: 15, color: theme.colors.muted, marginTop: 7, marginBottom: 28 },
  card: { backgroundColor: theme.colors.surface, borderRadius: 18, padding: 22,
    borderWidth: 1, borderColor: theme.colors.border },
  cardHeading: { fontSize: 22, fontWeight: '700', color: theme.colors.ink },
  cardSubheading: { color: theme.colors.muted, fontSize: 14, lineHeight: 21, marginTop: 6, marginBottom: 24 },
  errorBox: { backgroundColor: theme.colors.errorSoft, padding: 11, borderRadius: 9, marginBottom: 14 },
  errorText: { color: theme.colors.error, fontSize: 14 },
  demoBox: { marginTop: 18, padding: 15, borderRadius: 12,
    backgroundColor: theme.colors.primarySoft },
  demoTitle: { color: theme.colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  demoLine: { color: theme.colors.ink, fontSize: 14, marginTop: 6 },
  footer: { textAlign: 'center', color: theme.colors.muted, fontSize: 11, marginTop: 22 },
});
