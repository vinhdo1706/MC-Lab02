import { Redirect } from 'expo-router';
import { useAuth } from '../features/auth/AuthContext';
import { LoginScreen } from '../features/auth/LoginScreen';

export default function LoginRoute() {
  const { user } = useAuth();
  if (user) return <Redirect href="/fitness" />;
  return <LoginScreen />;
}
