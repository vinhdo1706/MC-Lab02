import { Redirect } from 'expo-router';
import { useAuth } from '../features/auth/AuthContext';

export default function IndexRoute() {
  const { user } = useAuth();
  return <Redirect href={user ? '/fitness' : '/login'} />;
}
