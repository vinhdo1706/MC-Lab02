import { Redirect } from 'expo-router';
import { useAuth } from '../features/auth/AuthContext';
import { FitnessScreen } from '../features/fitness/FitnessScreen';

export default function FitnessRoute() {
  const { user } = useAuth();
  if (!user) return <Redirect href="/login" />;
  return <FitnessScreen />;
}
